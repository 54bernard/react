'use server';

import { headers } from 'next/headers';
import { isSupabaseConfigured } from '@/lib/env';
import { rateLimit } from '@/lib/rate-limit';
import { createSupabasePublicClient } from '@/lib/supabase/server';
import { sanitizeText } from '@/lib/utils';
import { antiSpamSchema, contactSchema, subjectLabels, visitSchema } from '@/schemas/forms';
import { sendNotificationEmail } from '@/services/email';
import type { ActionResult } from '@/types';

const MIN_FILL_TIME_MS = 2500;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function clientKey(scope: string) {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'inconnu';
  return `${scope}:${ip}`;
}

/** Contrôles anti-spam communs. Renvoie un message d'erreur ou null. */
async function guard(scope: string, raw: Record<string, unknown>): Promise<string | null> {
  const spam = antiSpamSchema.safeParse(raw);
  if (!spam.success) return 'Votre demande n’a pas pu être envoyée.';
  if (Date.now() - spam.data.startedAt < MIN_FILL_TIME_MS) return 'Votre demande n’a pas pu être envoyée. Réessayez.';
  const { allowed } = rateLimit(await clientKey(scope), 5, 10 * 60 * 1000);
  if (!allowed) return 'Trop de demandes envoyées. Réessayez dans quelques minutes.';
  return null;
}

const toPropertyId = (id?: string) => (id && UUID_RE.test(id) ? id : null);

export async function submitContact(raw: Record<string, unknown>): Promise<ActionResult> {
  const blocked = await guard('contact', raw);
  if (blocked) return { ok: false, error: blocked };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Veuillez corriger les champs indiqués.', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const input = parsed.data;
  const message = `[${subjectLabels[input.subject]}] ${sanitizeText(input.message)}`;

  if (isSupabaseConfigured) {
    const supabase = createSupabasePublicClient();
    const { error } = await supabase.from('leads').insert({
      name: sanitizeText(input.name),
      phone: sanitizeText(input.phone),
      email: input.email ?? null,
      property_id: toPropertyId(input.propertyId),
      source: 'site_formulaire',
      message,
    });
    if (error) {
      return {
        ok: false,
        error: error.code === 'P0001' ? error.message : 'Une erreur est survenue. Réessayez ou contactez-nous par WhatsApp.',
      };
    }
  }

  await sendNotificationEmail('Nouvelle demande de contact', {
    Nom: input.name,
    Téléphone: input.phone,
    'E-mail': input.email,
    Objet: subjectLabels[input.subject],
    Message: input.message,
  });

  return {
    ok: true,
    message: isSupabaseConfigured
      ? 'Merci ! Votre message a bien été envoyé. Un conseiller vous recontacte rapidement.'
      : 'Mode démonstration : le formulaire est valide, mais rien n’est enregistré tant que Supabase n’est pas configuré.',
  };
}

export async function submitVisitRequest(raw: Record<string, unknown>): Promise<ActionResult> {
  const blocked = await guard('visite', raw);
  if (blocked) return { ok: false, error: blocked };

  const parsed = visitSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Veuillez corriger les champs indiqués.', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const input = parsed.data;
  const propertyId = toPropertyId(input.propertyId);
  const cleanMessage = input.message ? sanitizeText(input.message) : null;

  if (isSupabaseConfigured) {
    const supabase = createSupabasePublicClient();
    // L'identifiant est généré ici : le public n'a pas le droit de relire la table leads (RLS).
    const leadId = crypto.randomUUID();
    const { error: leadError } = await supabase
      .from('leads')
      .insert({
        id: leadId,
        name: sanitizeText(input.name),
        phone: sanitizeText(input.phone),
        email: input.email ?? null,
        property_id: propertyId,
        source: 'site_visite',
        message: `Demande de visite le ${input.date} à ${input.time}${cleanMessage ? ` — ${cleanMessage}` : ''}`,
      });
    if (leadError) {
      return {
        ok: false,
        error: leadError.code === 'P0001' ? leadError.message : 'Une erreur est survenue. Réessayez ou contactez-nous par WhatsApp.',
      };
    }
    const { error } = await supabase.from('appointments').insert({
      lead_id: leadId,
      property_id: propertyId,
      name: sanitizeText(input.name),
      phone: sanitizeText(input.phone),
      email: input.email ?? null,
      preferred_date: input.date,
      preferred_time: input.time,
      message: cleanMessage,
    });
    if (error) return { ok: false, error: 'La demande de visite n’a pas pu être enregistrée. Réessayez.' };
  }

  await sendNotificationEmail('Nouvelle demande de visite', {
    Nom: input.name,
    Téléphone: input.phone,
    'E-mail': input.email,
    Terrain: input.propertyId,
    Date: input.date,
    Heure: input.time,
    Message: cleanMessage,
  });

  return {
    ok: true,
    message: isSupabaseConfigured
      ? `Votre demande de visite pour le ${new Date(input.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} à ${input.time} est enregistrée. Nous vous appelons pour la confirmer.`
      : 'Mode démonstration : la demande est valide, mais rien n’est enregistré tant que Supabase n’est pas configuré.',
  };
}

/** Synchronise un favori (anonyme, par appareil) pour les statistiques. */
export async function syncFavorite(deviceId: string, propertyId: string, active: boolean): Promise<void> {
  if (!isSupabaseConfigured) return;
  if (!/^[a-z0-9-]{8,64}$/i.test(deviceId) || !UUID_RE.test(propertyId)) return;
  const { allowed } = rateLimit(await clientKey('favoris'), 60, 60 * 1000);
  if (!allowed) return;
  await createSupabasePublicClient().rpc('set_favorite', { p_device_id: deviceId, p_property_id: propertyId, p_active: active });
}
