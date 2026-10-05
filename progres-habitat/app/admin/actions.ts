'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminForAction } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { sanitizeText, slugify } from '@/lib/utils';
import {
  appointmentUpdateSchema,
  leadCreateSchema,
  leadUpdateSchema,
  propertyFormSchema,
  settingsSchema,
  testimonialSchema,
} from '@/schemas/property';
import { PROPERTY_STATUSES, type ActionResult, type PropertyStatus } from '@/types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const IMAGE_BUCKET = 'property-images';

function revalidatePublic(slug?: string) {
  revalidatePath('/');
  revalidatePath('/terrains');
  revalidatePath('/zones');
  revalidatePath('/sitemap.xml');
  if (slug) revalidatePath(`/terrains/${slug}`);
}

/* =============================================================== Terrains */

export async function saveProperty(raw: unknown): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  const { supabase } = auth;

  const parsed = propertyFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Certains champs sont invalides.', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const v = parsed.data;
  if (!UUID_RE.test(v.id) || v.images.some((img) => img.id && !UUID_RE.test(img.id))) {
    return { ok: false, error: 'Identifiant de terrain ou de photo invalide.' };
  }

  const { data: existing } = await supabase.from('properties').select('id, slug').eq('id', v.id).maybeSingle();

  const row = {
    id: v.id,
    slug: v.slug,
    reference: v.reference.toUpperCase(),
    title: sanitizeText(v.title),
    description: sanitizeText(v.description),
    location_id: v.location_id ?? null,
    city: sanitizeText(v.city),
    district: sanitizeText(v.district),
    address: v.address,
    latitude: v.latitude,
    longitude: v.longitude,
    price: v.price,
    surface: v.surface,
    type: v.type,
    status: v.status,
    payment_options: v.payment_options,
    installment_months: v.payment_options.includes('echelonne') ? (v.installment_months ?? null) : null,
    legal_status: v.legal_status,
    road_access: v.road_access,
    has_water: v.has_water,
    has_electricity: v.has_electricity,
    distance_to_paved_road_m: v.distance_to_paved_road_m ?? null,
    topography: v.topography,
    nearby: v.nearby.map((n) => ({ ...n, name: sanitizeText(n.name) })),
    amenities: v.amenities.map(sanitizeText).filter(Boolean),
    cadastral_plan_url: v.cadastral_plan_url,
    is_featured: v.is_featured,
    is_published: v.is_published,
  };

  const { error } = await supabase.from('properties').upsert(row, { onConflict: 'id' });
  if (error) {
    if (error.code === '23505') {
      const field = error.message.includes('reference') ? 'reference' : 'slug';
      return { ok: false, error: 'Cette valeur est déjà utilisée par un autre terrain.', fieldErrors: { [field]: ['Déjà utilisé.'] } };
    }
    return { ok: false, error: `Enregistrement impossible : ${error.message}` };
  }

  // Images : synchronisation de la liste (ordre, image principale, suppression)
  const { data: currentImages } = await supabase.from('property_images').select('id, url, storage_path').eq('property_id', v.id);
  const keptIds = new Set(v.images.map((img) => img.id).filter(Boolean));
  const removed = (currentImages ?? []).filter((img) => !keptIds.has(img.id));
  if (removed.length > 0) {
    await supabase.from('property_images').delete().in('id', removed.map((r) => r.id));
    const owned = removed.filter((r): r is typeof r & { storage_path: string } => Boolean(r.storage_path));
    if (owned.length > 0) {
      // On ne supprime pas un fichier encore utilisé par un terrain dupliqué
      const { data: stillUsed } = await supabase.from('property_images').select('url').in('url', owned.map((r) => r.url));
      const usedUrls = new Set((stillUsed ?? []).map((r) => r.url));
      const paths = owned.filter((r) => !usedUrls.has(r.url)).map((r) => r.storage_path);
      if (paths.length > 0) await supabase.storage.from(IMAGE_BUCKET).remove(paths);
    }
  }
  // L'index unique « une seule image principale » impose de réinitialiser avant d'écrire
  await supabase.from('property_images').update({ is_main: false }).eq('property_id', v.id);
  const hasMain = v.images.some((img) => img.is_main);
  const imageRows = v.images.map((img, position) => ({
    ...(img.id ? { id: img.id } : {}),
    property_id: v.id,
    url: img.url,
    storage_path: img.storage_path ?? null,
    alt: img.alt ? sanitizeText(img.alt) : `${row.title} — photo ${position + 1}`,
    position,
    is_main: hasMain ? img.is_main : position === 0,
  }));
  const withId = imageRows.filter((r) => 'id' in r);
  const withoutId = imageRows.filter((r) => !('id' in r));
  if (withId.length > 0) {
    const { error: imgError } = await supabase.from('property_images').upsert(withId, { onConflict: 'id' });
    if (imgError) return { ok: false, error: `Photos : ${imgError.message}` };
  }
  if (withoutId.length > 0) {
    const { error: imgError } = await supabase.from('property_images').insert(withoutId);
    if (imgError) return { ok: false, error: `Photos : ${imgError.message}` };
  }

  // Documents : remplacement complet de la liste
  await supabase.from('property_documents').delete().eq('property_id', v.id);
  if (v.documents.length > 0) {
    const { error: docError } = await supabase
      .from('property_documents')
      .insert(v.documents.map((d) => ({ ...d, name: sanitizeText(d.name), property_id: v.id })));
    if (docError) return { ok: false, error: `Documents : ${docError.message}` };
  }

  revalidatePublic(v.slug);
  if (existing?.slug && existing.slug !== v.slug) revalidatePath(`/terrains/${existing.slug}`);
  revalidatePath('/admin/terrains');
  return { ok: true, message: existing ? 'Terrain mis à jour.' : 'Terrain créé.', data: { id: v.id } };
}

export async function deleteProperty(id: string): Promise<ActionResult> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  if (!UUID_RE.test(id)) return { ok: false, error: 'Identifiant invalide.' };
  const { supabase } = auth;

  const [{ data: property }, { data: images }] = await Promise.all([
    supabase.from('properties').select('slug').eq('id', id).maybeSingle(),
    supabase.from('property_images').select('url, storage_path').eq('property_id', id),
  ]);
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };

  // Les fichiers encore utilisés par un terrain dupliqué sont conservés
  const owned = (images ?? []).filter((i): i is { url: string; storage_path: string } => Boolean(i.storage_path));
  if (owned.length > 0) {
    const { data: stillUsed } = await supabase.from('property_images').select('url').in('url', owned.map((i) => i.url));
    const usedUrls = new Set((stillUsed ?? []).map((r) => r.url));
    const paths = owned.filter((i) => !usedUrls.has(i.url)).map((i) => i.storage_path);
    if (paths.length > 0) await supabase.storage.from(IMAGE_BUCKET).remove(paths);
  }

  revalidatePublic(property?.slug);
  revalidatePath('/admin/terrains');
  return { ok: true, message: 'Terrain supprimé.' };
}

export async function duplicateProperty(id: string): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  if (!UUID_RE.test(id)) return { ok: false, error: 'Identifiant invalide.' };
  const { supabase } = auth;

  const { data: source, error } = await supabase
    .from('properties')
    .select('*, images:property_images(*), documents:property_documents(*)')
    .eq('id', id)
    .single();
  if (error || !source) return { ok: false, error: 'Terrain introuvable.' };

  const newId = crypto.randomUUID();
  const suffix = newId.slice(0, 4);
  const { images, documents, ...rest } = source as Record<string, unknown> & {
    images: Record<string, unknown>[];
    documents: Record<string, unknown>[];
    slug: string;
    reference: string;
    title: string;
  };
  const copy = {
    ...rest,
    id: newId,
    slug: `${rest.slug}-copie-${suffix}`.slice(0, 120),
    reference: `${rest.reference}-C${suffix.toUpperCase()}`.slice(0, 30),
    title: `${rest.title} (copie)`.slice(0, 140),
    is_published: false,
    is_featured: false,
    views_count: 0,
    created_at: undefined,
    updated_at: undefined,
  };
  const { error: insertError } = await supabase.from('properties').insert(copy);
  if (insertError) return { ok: false, error: insertError.message };

  // Copie des lignes liées sans leurs identifiants ni horodatages (régénérés par la base)
  const withoutMeta = (row: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(row).filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key)));
  if (images.length > 0) {
    // storage_path à null : les fichiers restent rattachés au terrain d'origine
    await supabase.from('property_images').insert(images.map((img) => ({ ...withoutMeta(img), property_id: newId, storage_path: null })));
  }
  if (documents.length > 0) {
    await supabase.from('property_documents').insert(documents.map((doc) => ({ ...withoutMeta(doc), property_id: newId })));
  }
  revalidatePath('/admin/terrains');
  return { ok: true, message: 'Terrain dupliqué (brouillon).', data: { id: newId } };
}

export async function updatePropertyStatus(id: string, status: PropertyStatus): Promise<ActionResult> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  if (!UUID_RE.test(id) || !PROPERTY_STATUSES.includes(status)) return { ok: false, error: 'Paramètres invalides.' };
  const { data, error } = await auth.supabase.from('properties').update({ status }).eq('id', id).select('slug').single();
  if (error) return { ok: false, error: error.message };
  revalidatePublic(data?.slug);
  revalidatePath('/admin/terrains');
  return { ok: true, message: 'Statut mis à jour.' };
}

export async function togglePublished(id: string, published: boolean): Promise<ActionResult> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  if (!UUID_RE.test(id)) return { ok: false, error: 'Identifiant invalide.' };
  const { data, error } = await auth.supabase.from('properties').update({ is_published: published }).eq('id', id).select('slug').single();
  if (error) return { ok: false, error: error.message };
  revalidatePublic(data?.slug);
  revalidatePath('/admin/terrains');
  return { ok: true, message: published ? 'Terrain publié.' : 'Terrain dépublié.' };
}

/** Propose un slug unique à partir du titre. */
export async function suggestSlug(title: string, currentId?: string): Promise<string> {
  const base = slugify(title) || 'terrain';
  const auth = await requireAdminForAction();
  if ('error' in auth) return base;
  const { data } = await auth.supabase.from('properties').select('id, slug').like('slug', `${base}%`);
  const taken = new Set((data ?? []).filter((r) => r.id !== currentId).map((r) => r.slug));
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

/* =============================================================== CRM */

export async function updateLead(raw: unknown): Promise<ActionResult> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  const parsed = leadUpdateSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Données invalides.' };
  const { id, ...values } = parsed.data;
  const { error } = await auth.supabase.from('leads').update(values).eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/demandes');
  revalidatePath('/admin');
  return { ok: true, message: 'Fiche client mise à jour.' };
}

export async function createLead(raw: unknown): Promise<ActionResult> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  const parsed = leadCreateSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Certains champs sont invalides.', fieldErrors: parsed.error.flatten().fieldErrors };
  const v = parsed.data;
  const { error } = await auth.supabase.from('leads').insert({
    name: sanitizeText(v.name),
    phone: sanitizeText(v.phone),
    email: v.email ?? null,
    property_id: v.property_id ?? null,
    source: v.source,
    message: v.message ? sanitizeText(v.message) : null,
    follow_up_at: v.follow_up_at ?? null,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/demandes');
  revalidatePath('/admin');
  return { ok: true, message: 'Prospect ajouté.' };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  if (!UUID_RE.test(id)) return { ok: false, error: 'Identifiant invalide.' };
  const { error } = await auth.supabase.from('leads').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/demandes');
  return { ok: true, message: 'Demande supprimée.' };
}

export async function updateAppointment(raw: unknown): Promise<ActionResult> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  const parsed = appointmentUpdateSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Données invalides.' };
  const { error } = await auth.supabase.from('appointments').update({ status: parsed.data.status }).eq('id', parsed.data.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/rendez-vous');
  revalidatePath('/admin');
  return { ok: true, message: 'Rendez-vous mis à jour.' };
}

/* =============================================================== Contenus */

export async function saveTestimonial(raw: unknown, id?: string): Promise<ActionResult> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  const parsed = testimonialSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Certains champs sont invalides.', fieldErrors: parsed.error.flatten().fieldErrors };
  const values = { ...parsed.data, name: sanitizeText(parsed.data.name), content: sanitizeText(parsed.data.content) };
  const { error } =
    id && UUID_RE.test(id)
      ? await auth.supabase.from('testimonials').update(values).eq('id', id)
      : await auth.supabase.from('testimonials').insert(values);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/');
  revalidatePath('/admin/temoignages');
  return { ok: true, message: 'Témoignage enregistré.' };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  if (!UUID_RE.test(id)) return { ok: false, error: 'Identifiant invalide.' };
  const { error } = await auth.supabase.from('testimonials').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/');
  revalidatePath('/admin/temoignages');
  return { ok: true, message: 'Témoignage supprimé.' };
}

export async function saveSettings(raw: unknown): Promise<ActionResult> {
  const auth = await requireAdminForAction();
  if ('error' in auth) return { ok: false, error: auth.error };
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Certains champs sont invalides.', fieldErrors: parsed.error.flatten().fieldErrors };
  const { error } = await auth.supabase.from('settings').upsert({ id: 1, ...parsed.data });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/', 'layout');
  return { ok: true, message: 'Paramètres enregistrés.' };
}

/* =============================================================== Session */

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect('/admin/connexion');
}
