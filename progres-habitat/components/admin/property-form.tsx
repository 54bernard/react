'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Save, ScanEye, Trash2, Wand2, X } from 'lucide-react';
import { toast } from 'sonner';
import { saveProperty, suggestSlug } from '@/app/admin/actions';
import { ImageManager } from '@/components/admin/image-manager';
import { MapView } from '@/components/map/map-view';
import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/form-controls';
import { legalLabels, nearbyLabels, paymentLabels, statusLabels, typeLabels } from '@/lib/labels';
import { slugify } from '@/lib/utils';
import { propertyFormSchema, type PropertyFormOutput, type PropertyFormValues } from '@/schemas/property';
import {
  LEGAL_STATUSES,
  NEARBY_TYPES,
  PAYMENT_OPTIONS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type Location,
  type PropertyWithRelations,
} from '@/types';

interface Props {
  initial?: PropertyWithRelations;
  locations: Location[];
  isDemo: boolean;
}

function toFormValues(p: PropertyWithRelations | undefined, id: string): PropertyFormValues {
  return {
    id,
    title: p?.title ?? '',
    slug: p?.slug ?? '',
    reference: p?.reference ?? `PH-${new Date().getFullYear().toString().slice(2)}${id.slice(0, 4).toUpperCase()}`,
    description: p?.description ?? '',
    location_id: p?.location_id ?? '',
    city: p?.city ?? 'Ouagadougou',
    district: p?.district ?? '',
    address: p?.address ?? '',
    latitude: p?.latitude ?? 12.3714,
    longitude: p?.longitude ?? -1.5197,
    price: p?.price ?? 0,
    surface: p?.surface ?? 300,
    type: p?.type ?? 'residentiel',
    status: p?.status ?? 'disponible',
    payment_options: p?.payment_options ?? ['comptant'],
    installment_months: p?.installment_months ?? '',
    legal_status: p?.legal_status ?? 'attestation_attribution',
    road_access: p?.road_access ?? '',
    has_water: p?.has_water ?? false,
    has_electricity: p?.has_electricity ?? false,
    distance_to_paved_road_m: p?.distance_to_paved_road_m ?? '',
    topography: p?.topography ?? '',
    amenities: p?.amenities ?? [],
    nearby: p?.nearby ?? [],
    documents:
      p?.documents.map(({ name, doc_type, file_url, is_available }) => ({ name, doc_type, file_url, is_available })) ?? [
        { name: "Attestation d'attribution", doc_type: 'attestation_attribution', file_url: null, is_available: true },
        { name: 'Plan de situation', doc_type: 'plan', file_url: null, is_available: true },
      ],
    images: p?.images.map(({ id: imgId, url, alt, is_main }) => ({ id: imgId, url, alt, is_main, storage_path: null })) ?? [],
    cadastral_plan_url: p?.cadastral_plan_url ?? '',
    is_featured: p?.is_featured ?? false,
    is_published: p?.is_published ?? false,
  };
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft sm:p-7">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function AmenitiesInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (v && !value.includes(v) && value.length < 20) onChange([...value, v]);
    setDraft('');
  };
  return (
    <div>
      <div className="flex gap-2">
        <Input
          id="amenities"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Ex. Parcelle d’angle, Bornage effectué…"
        />
        <Button type="button" variant="outline" onClick={add}>
          Ajouter
        </Button>
      </div>
      {value.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {value.map((a) => (
            <li key={a} className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pr-1 pl-3 text-sm text-brand-800">
              {a}
              <button type="button" onClick={() => onChange(value.filter((x) => x !== a))} aria-label={`Retirer ${a}`} className="grid size-6 cursor-pointer place-items-center rounded-full hover:bg-brand-100">
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PropertyForm({ initial, locations, isDemo }: Props) {
  const router = useRouter();
  const [propertyId] = useState(() => initial?.id ?? crypto.randomUUID());
  const [saving, startSaving] = useTransition();
  const isNew = !initial;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors, isDirty },
  } = useForm<PropertyFormValues, unknown, PropertyFormOutput>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: toFormValues(initial, propertyId),
  });

  const nearby = useFieldArray({ control, name: 'nearby' });
  const documents = useFieldArray({ control, name: 'documents' });
  const [lat, lng, title, paymentOptions] = useWatch({ control, name: ['latitude', 'longitude', 'title', 'payment_options'] });

  // Avertit avant de quitter la page avec des modifications non enregistrées
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const onInvalid = () => toast.error('Certains champs sont à corriger.');

  const onSubmit = handleSubmit(
    (values) =>
      startSaving(async () => {
      const res = await saveProperty(values);
      if (!res.ok) {
        toast.error(res.error);
        Object.entries(res.fieldErrors ?? {}).forEach(([key, msgs]) => {
          if (msgs?.[0]) setError(key as keyof PropertyFormValues, { message: msgs[0] });
        });
        return;
      }
      toast.success(res.message);
      if (isNew) router.replace(`/admin/terrains/${propertyId}`);
      else router.refresh();
      }),
    onInvalid,
  );

  const generateSlug = async () => {
    const t = getValues('title');
    if (!t) return;
    const slug = isDemo ? slugify(t) : await suggestSlug(t, propertyId);
    setValue('slug', slug, { shouldDirty: true, shouldValidate: true });
  };

  const err = (path: string) => {
    const parts = path.split('.');
    let node: unknown = errors;
    for (const part of parts) node = (node as Record<string, unknown> | undefined)?.[part];
    return (node as { message?: string } | undefined)?.message;
  };

  const latNum = Number(lat);
  const lngNum = Number(lng);
  const coordsValid = Number.isFinite(latNum) && Number.isFinite(lngNum) && Math.abs(latNum) <= 90 && Math.abs(lngNum) <= 180;

  return (
    <form onSubmit={onSubmit} noValidate className="pb-28">
      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-6">
          <Section title="Informations principales">
            <Field label="Titre de l’annonce" htmlFor="title" error={err('title')}>
              <Input
                id="title"
                aria-invalid={!!errors.title}
                {...register('title', {
                  onBlur: () => {
                    if (!getValues('slug')) void generateSlug();
                  },
                })}
                placeholder="Ex. Parcelle de 300 m² à Saaba"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Adresse de la page (slug)" htmlFor="slug" error={err('slug')} hint={`/terrains/${getValues('slug') || '…'}`}>
                <div className="flex gap-2">
                  <Input id="slug" aria-invalid={!!errors.slug} {...register('slug')} />
                  <Button type="button" variant="outline" size="icon" onClick={generateSlug} aria-label="Générer depuis le titre" disabled={!title}>
                    <Wand2 />
                  </Button>
                </div>
              </Field>
              <Field label="Référence" htmlFor="reference" error={err('reference')}>
                <Input id="reference" aria-invalid={!!errors.reference} {...register('reference')} />
              </Field>
            </div>
            <Field label="Description" htmlFor="description" error={err('description')} hint="Séparez les paragraphes par une ligne vide.">
              <Textarea id="description" rows={7} aria-invalid={!!errors.description} {...register('description')} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Type de terrain" htmlFor="type">
                <Select id="type" {...register('type')}>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {typeLabels[t]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Statut" htmlFor="status">
                <Select id="status" {...register('status')}>
                  {PROPERTY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </Section>

          <Section title="Photos" description="La photo principale apparaît sur les cartes et en tête de l’annonce.">
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <ImageManager
                  propertyId={propertyId}
                  value={field.value}
                  onChange={(imgs) => field.onChange(imgs)}
                  disabled={isDemo}
                />
              )}
            />
          </Section>

          <Section title="Localisation">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Zone" htmlFor="location_id">
                <Select
                  id="location_id"
                  {...register('location_id', {
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                      const zone = locations.find((l) => l.id === e.target.value);
                      if (zone) {
                        setValue('city', zone.city, { shouldDirty: true });
                        if (!getValues('district')) setValue('district', zone.name, { shouldDirty: true });
                        setValue('latitude', zone.latitude, { shouldDirty: true });
                        setValue('longitude', zone.longitude, { shouldDirty: true });
                      }
                    },
                  })}
                >
                  <option value="">— Aucune —</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.city})
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Ville" htmlFor="city" error={err('city')}>
                <Input id="city" aria-invalid={!!errors.city} {...register('city')} />
              </Field>
              <Field label="Quartier / secteur" htmlFor="district" error={err('district')}>
                <Input id="district" aria-invalid={!!errors.district} {...register('district')} />
              </Field>
              <Field label="Adresse ou repère" htmlFor="address" optional>
                <Input id="address" {...register('address')} />
              </Field>
              <Field label="Latitude" htmlFor="latitude" error={err('latitude')}>
                <Input id="latitude" inputMode="decimal" {...register('latitude')} />
              </Field>
              <Field label="Longitude" htmlFor="longitude" error={err('longitude')}>
                <Input id="longitude" inputMode="decimal" {...register('longitude')} />
              </Field>
            </div>
            {coordsValid && (
              <div className="h-64 overflow-hidden rounded-2xl border border-ink-100">
                <MapView
                  markers={[
                    {
                      id: propertyId,
                      slug: '',
                      title: title || 'Nouveau terrain',
                      reference: '',
                      price: Number(getValues('price')) || 0,
                      surface: Number(getValues('surface')) || 0,
                      district: '',
                      city: '',
                      latitude: latNum,
                      longitude: lngNum,
                      status: 'disponible',
                      image: null,
                    },
                  ]}
                  singleZoom={14}
                  interactivePopups={false}
                />
              </div>
            )}
            <p className="text-xs text-ink-500">
              Astuce : dans Google Maps, faites un clic droit sur le terrain pour copier ses coordonnées GPS.
            </p>
          </Section>

          <Section title="Prix et paiement">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Prix (FCFA)" htmlFor="price" error={err('price')}>
                <Input id="price" inputMode="numeric" aria-invalid={!!errors.price} {...register('price')} />
              </Field>
              <Field label="Superficie (m²)" htmlFor="surface" error={err('surface')}>
                <Input id="surface" inputMode="numeric" aria-invalid={!!errors.surface} {...register('surface')} />
              </Field>
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink-800">Modes de paiement</legend>
              <div className="flex flex-wrap gap-4">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <Checkbox value={opt} {...register('payment_options')} /> {paymentLabels[opt]}
                  </label>
                ))}
              </div>
              {err('payment_options') && <p className="mt-1.5 text-sm text-red-600">{err('payment_options')}</p>}
            </fieldset>
            {paymentOptions?.includes('echelonne') && (
              <Field label="Durée maximale du paiement échelonné (mois)" htmlFor="installment_months" error={err('installment_months')}>
                <Input id="installment_months" inputMode="numeric" className="max-w-40" {...register('installment_months')} />
              </Field>
            )}
          </Section>

          <Section title="Juridique et documents">
            <Field label="Statut juridique" htmlFor="legal_status">
              <Select id="legal_status" {...register('legal_status')}>
                {LEGAL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {legalLabels[s]}
                  </option>
                ))}
              </Select>
            </Field>
            <div>
              <p className="mb-2 text-sm font-medium text-ink-800">Documents disponibles</p>
              <ul className="space-y-3">
                {documents.fields.map((f, i) => (
                  <li key={f.id} className="grid gap-3 rounded-xl border border-ink-100 p-3 sm:grid-cols-[1fr_12rem_auto_auto] sm:items-center">
                    <div>
                      <label htmlFor={`doc-name-${i}`} className="sr-only">
                        Nom du document
                      </label>
                      <Input id={`doc-name-${i}`} placeholder="Nom du document" {...register(`documents.${i}.name` as const)} />
                      {err(`documents.${i}.name`) && <p className="mt-1 text-xs text-red-600">{err(`documents.${i}.name`)}</p>}
                    </div>
                    <label htmlFor={`doc-type-${i}`} className="sr-only">
                      Type de document
                    </label>
                    <Select id={`doc-type-${i}`} {...register(`documents.${i}.doc_type` as const)}>
                      {LEGAL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {legalLabels[s]}
                        </option>
                      ))}
                      <option value="plan">Plan</option>
                      <option value="autre">Autre</option>
                    </Select>
                    <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                      <Checkbox {...register(`documents.${i}.is_available` as const)} /> Disponible
                    </label>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => documents.remove(i)} aria-label="Retirer le document">
                      <Trash2 className="text-red-600" />
                    </Button>
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => documents.append({ name: '', doc_type: 'autre', file_url: null, is_available: true })}
              >
                <Plus /> Ajouter un document
              </Button>
            </div>
            <Field label="URL du plan du terrain" htmlFor="cadastral_plan_url" optional hint="Image du plan (ex. une photo déjà envoyée).">
              <Input id="cadastral_plan_url" {...register('cadastral_plan_url')} />
            </Field>
          </Section>

          <Section title="Équipements et accès">
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox {...register('has_water')} /> Eau (ONEA)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox {...register('has_electricity')} /> Électricité (SONABEL)
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Accès routier" htmlFor="road_access" optional>
                <Input id="road_access" placeholder="Ex. Voie latéritique carrossable" {...register('road_access')} />
              </Field>
              <Field label="Distance du goudron (m)" htmlFor="distance_to_paved_road_m" optional error={err('distance_to_paved_road_m')}>
                <Input id="distance_to_paved_road_m" inputMode="numeric" {...register('distance_to_paved_road_m')} />
              </Field>
              <Field label="Topographie" htmlFor="topography" optional className="sm:col-span-2">
                <Input id="topography" placeholder="Ex. Terrain plat, sol latéritique" {...register('topography')} />
              </Field>
            </div>
            <Field label="Atouts" htmlFor="amenities" optional>
              <Controller control={control} name="amenities" render={({ field }) => <AmenitiesInput value={field.value} onChange={field.onChange} />} />
            </Field>
          </Section>

          <Section title="À proximité" description="Écoles, commerces, santé, route principale…">
            <ul className="space-y-3">
              {nearby.fields.map((f, i) => (
                <li key={f.id} className="grid gap-3 rounded-xl border border-ink-100 p-3 sm:grid-cols-[10rem_1fr_8rem_auto] sm:items-start">
                  <label htmlFor={`near-type-${i}`} className="sr-only">
                    Catégorie
                  </label>
                  <Select id={`near-type-${i}`} {...register(`nearby.${i}.type` as const)}>
                    {NEARBY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {nearbyLabels[t]}
                      </option>
                    ))}
                  </Select>
                  <div>
                    <label htmlFor={`near-name-${i}`} className="sr-only">
                      Nom du lieu
                    </label>
                    <Input id={`near-name-${i}`} placeholder="Nom du lieu" {...register(`nearby.${i}.name` as const)} />
                    {err(`nearby.${i}.name`) && <p className="mt-1 text-xs text-red-600">{err(`nearby.${i}.name`)}</p>}
                  </div>
                  <div className="relative">
                    <label htmlFor={`near-dist-${i}`} className="sr-only">
                      Distance en mètres
                    </label>
                    <Input id={`near-dist-${i}`} inputMode="numeric" className="pr-8" {...register(`nearby.${i}.distance_m` as const)} />
                    <span className="pointer-events-none absolute top-3 right-3 text-xs text-ink-400">m</span>
                  </div>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => nearby.remove(i)} aria-label="Retirer">
                    <Trash2 className="text-red-600" />
                  </Button>
                </li>
              ))}
            </ul>
            <Button type="button" variant="outline" size="sm" onClick={() => nearby.append({ type: 'ecole', name: '', distance_m: 500 })}>
              <Plus /> Ajouter un lieu
            </Button>
          </Section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
          <Section title="Publication">
            <label className="flex items-start gap-3 text-sm">
              <Checkbox className="mt-0.5" {...register('is_published')} />
              <span>
                <strong className="block font-medium text-ink-900">Publié sur le site</strong>
                <span className="text-ink-500">Décochez pour garder en brouillon.</span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <Checkbox className="mt-0.5" {...register('is_featured')} />
              <span>
                <strong className="block font-medium text-ink-900">Mettre à la une</strong>
                <span className="text-ink-500">Affiché sur la page d’accueil.</span>
              </span>
            </label>
          </Section>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-200 bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <p className="hidden text-sm text-ink-500 sm:block">{isDirty ? 'Modifications non enregistrées' : 'Aucune modification'}</p>
          <div className="flex flex-1 justify-end gap-2 sm:flex-none">
            {!isNew && (
              <Button asChild variant="outline">
                <Link href={`/admin/terrains/${propertyId}/apercu`} target="_blank">
                  <ScanEye /> Aperçu
                </Link>
              </Button>
            )}
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />} Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
