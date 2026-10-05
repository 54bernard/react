'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm, useWatch, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Archive, Eye, FileEdit, Loader2, Plus, Save, ScanEye, Trash2, Wand2, X } from 'lucide-react';
import { toast } from 'sonner';
import { saveProperty, suggestSlug } from '@/app/admin/actions';
import { ImageManager } from '@/components/admin/image-manager';
import { MapView } from '@/components/map/map-view';
import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/form-controls';
import { legalLabels, nearbyLabels, paymentLabels, statusLabels, typeLabels } from '@/lib/labels';
import { cn, formatNumber, formatPrice, slugify } from '@/lib/utils';
import { propertyFormSchema, type PropertyFormOutput, type PropertyFormValues } from '@/schemas/property';
import {
  LEGAL_STATUSES,
  NEARBY_TYPES,
  PAYMENT_OPTIONS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  publicationState,
  type Location,
  type PropertyWithRelations,
} from '@/types';

interface Props {
  initial?: PropertyWithRelations;
  locations: Location[];
  isDemo: boolean;
  siteUrl: string;
  /** Identifiant généré côté serveur pour un nouveau terrain (stable entre SSR et hydratation). */
  newId?: string;
}

const SECTIONS = [
  { id: 'general', label: 'Informations générales' },
  { id: 'prix', label: 'Prix' },
  { id: 'surface', label: 'Surface' },
  { id: 'localisation', label: 'Localisation & GPS' },
  { id: 'description', label: 'Description' },
  { id: 'caracteristiques', label: 'Caractéristiques' },
  { id: 'photos', label: 'Photos' },
  { id: 'documents', label: 'Documents' },
  { id: 'seo', label: 'SEO' },
  { id: 'statut', label: 'Statut & publication' },
] as const;

/** Champs → section, pour signaler les sections contenant des erreurs. */
const FIELD_SECTION: Record<string, (typeof SECTIONS)[number]['id']> = {
  title: 'general',
  slug: 'general',
  reference: 'general',
  type: 'general',
  price: 'prix',
  payment_options: 'prix',
  installment_months: 'prix',
  surface: 'surface',
  location_id: 'localisation',
  city: 'localisation',
  district: 'localisation',
  address: 'localisation',
  latitude: 'localisation',
  longitude: 'localisation',
  description: 'description',
  road_access: 'caracteristiques',
  distance_to_paved_road_m: 'caracteristiques',
  topography: 'caracteristiques',
  amenities: 'caracteristiques',
  nearby: 'caracteristiques',
  images: 'photos',
  documents: 'documents',
  legal_status: 'documents',
  cadastral_plan_url: 'documents',
  seo_title: 'seo',
  seo_description: 'seo',
};

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
    seo_title: p?.seo_title ?? '',
    seo_description: p?.seo_description ?? '',
    is_featured: p?.is_featured ?? false,
    publication: p ? publicationState(p) : 'brouillon',
  };
}

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-titre`} className="scroll-mt-24 rounded-2xl border border-ink-100 bg-white p-5 sm:p-7">
      <header className="mb-6">
        <h2 id={`${id}-titre`} className="text-base font-semibold text-ink-950">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Counter({ value, max }: { value: string; max: number }) {
  const n = value.length;
  return (
    <span className={cn('text-xs tabular-nums', n > max ? 'font-semibold text-red-600' : n > max * 0.9 ? 'text-amber-700' : 'text-ink-400')}>
      {n}/{max}
    </span>
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
          placeholder="Ex. Parcelle d’angle, bornage effectué…"
        />
        <Button type="button" variant="outline" onClick={add} className="rounded-xl">
          Ajouter
        </Button>
      </div>
      {value.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {value.map((a) => (
            <li key={a} className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white py-1 pr-1 pl-3 text-[13px] text-ink-800">
              {a}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== a))}
                aria-label={`Retirer ${a}`}
                className="grid size-6 cursor-pointer place-items-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-950"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const PUBLICATION_OPTIONS = [
  { value: 'brouillon', label: 'Brouillon', text: 'Invisible sur le site, modifiable librement.', icon: FileEdit },
  { value: 'publie', label: 'Publié', text: 'Visible sur le site et dans le sitemap.', icon: Eye },
  { value: 'archive', label: 'Archivé', text: 'Retiré du site et des listes, conservé.', icon: Archive },
] as const;

export function PropertyForm({ initial, locations, isDemo, siteUrl, newId }: Props) {
  const router = useRouter();
  const propertyId = initial?.id ?? newId ?? '';
  const [saving, startSaving] = useTransition();
  const [activeSection, setActiveSection] = useState<string>('general');
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
  const [lat, lng, title, slug, price, surface, paymentOptions, description, seoTitle, seoDescription, publication] = useWatch({
    control,
    name: ['latitude', 'longitude', 'title', 'slug', 'price', 'surface', 'payment_options', 'description', 'seo_title', 'seo_description', 'publication'],
  });

  // Avertit avant de quitter la page avec des modifications non enregistrées
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  // Section active dans le sommaire (au défilement)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-15% 0px -70% 0px' },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const sectionsWithErrors = new Set(Object.keys(errors).map((k) => FIELD_SECTION[k]).filter(Boolean));

  const onInvalid = (errs: typeof errors) => {
    const first = Object.keys(errs).map((k) => FIELD_SECTION[k]).find(Boolean);
    toast.error('Certains champs sont à corriger.');
    if (first) document.getElementById(first)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onSubmit = handleSubmit(
    (values) =>
      startSaving(async () => {
        const res = await saveProperty(values);
        if (!res.ok) {
          toast.error(res.error);
          Object.entries(res.fieldErrors ?? {}).forEach(([key, msgs]) => {
            if (msgs?.[0]) setError(key as FieldPath<PropertyFormValues>, { message: msgs[0] });
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
    const next = isDemo ? slugify(t) : await suggestSlug(t, propertyId);
    setValue('slug', next, { shouldDirty: true, shouldValidate: true });
  };

  const err = (path: string) => {
    let node: unknown = errors;
    for (const part of path.split('.')) node = (node as Record<string, unknown> | undefined)?.[part];
    return (node as { message?: string } | undefined)?.message;
  };

  const latNum = Number(lat);
  const lngNum = Number(lng);
  const coordsValid = Number.isFinite(latNum) && Number.isFinite(lngNum) && Math.abs(latNum) <= 90 && Math.abs(lngNum) <= 180;
  const priceNum = Number(price) || 0;
  const surfaceNum = Number(surface) || 0;
  const previewTitle = (seoTitle || `Terrain à vendre à ${getValues('district') || '…'} – ${surfaceNum} m²`).slice(0, 70);
  const previewDescription = (seoDescription || description || '').slice(0, 170);

  return (
    <form onSubmit={onSubmit} noValidate className="pb-28">
      <div className="grid gap-8 lg:grid-cols-[12.5rem_minmax(0,1fr)] xl:grid-cols-[12.5rem_minmax(0,1fr)_18rem]">
        {/* Sommaire */}
        <nav aria-label="Sections du formulaire" className="hidden lg:block">
          <ol className="sticky top-8 space-y-0.5 border-l border-ink-200">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={cn(
                    '-ml-px flex items-center justify-between gap-2 border-l-2 py-1.5 pr-2 pl-4 text-[13px] transition-colors',
                    activeSection === s.id ? 'border-ink-950 font-semibold text-ink-950' : 'border-transparent text-ink-500 hover:text-ink-950',
                  )}
                >
                  {s.label}
                  {sectionsWithErrors.has(s.id) && <span className="size-1.5 rounded-full bg-red-500" aria-label="Erreur dans cette section" />}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 space-y-5">
          <Section id="general" title="Informations générales" description="Identité de l’annonce telle qu’elle apparaîtra sur le site.">
            <Field label="Titre de l’annonce" htmlFor="title" error={err('title')} aside={<Counter value={title ?? ''} max={140} />}>
              <Input
                id="title"
                aria-invalid={!!errors.title}
                aria-describedby="title-error"
                placeholder="Ex. Parcelle de 300 m² à Saaba"
                {...register('title', {
                  onBlur: () => {
                    if (!getValues('slug')) void generateSlug();
                  },
                })}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Adresse de la page" htmlFor="slug" error={err('slug')} hint={`/terrains/${slug || '…'}`}>
                <div className="flex gap-2">
                  <Input id="slug" aria-invalid={!!errors.slug} aria-describedby="slug-error" {...register('slug')} />
                  <Button type="button" variant="outline" size="icon" className="rounded-xl" onClick={generateSlug} aria-label="Générer depuis le titre" disabled={!title}>
                    <Wand2 />
                  </Button>
                </div>
              </Field>
              <Field label="Référence" htmlFor="reference" error={err('reference')}>
                <Input id="reference" aria-invalid={!!errors.reference} aria-describedby="reference-error" {...register('reference')} />
              </Field>
            </div>
            <Field label="Type de terrain" htmlFor="type">
              <Select id="type" {...register('type')}>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {typeLabels[t]}
                  </option>
                ))}
              </Select>
            </Field>
          </Section>

          <Section id="prix" title="Prix" description="Prix affiché et modalités de paiement proposées.">
            <Field label="Prix de vente (FCFA)" htmlFor="price" error={err('price')} hint={priceNum ? formatPrice(priceNum) : undefined}>
              <Input id="price" inputMode="numeric" aria-invalid={!!errors.price} aria-describedby="price-error" {...register('price')} />
            </Field>
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink-800">Modes de paiement</legend>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm transition has-[:checked]:border-ink-950 has-[:checked]:bg-ink-50"
                  >
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

          <Section id="surface" title="Surface">
            <Field
              label="Superficie (m²)"
              htmlFor="surface"
              error={err('surface')}
              hint={surfaceNum && priceNum ? `${formatNumber(Math.round(priceNum / surfaceNum))} FCFA/m²${surfaceNum >= 10_000 ? ` · ${(surfaceNum / 10_000).toLocaleString('fr-FR')} ha` : ''}` : undefined}
            >
              <Input id="surface" inputMode="numeric" className="max-w-56" aria-invalid={!!errors.surface} aria-describedby="surface-error" {...register('surface')} />
            </Field>
          </Section>

          <Section id="localisation" title="Localisation & GPS" description="La zone alimente les filtres du site ; les coordonnées placent le terrain sur la carte.">
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
                <Input id="city" aria-invalid={!!errors.city} aria-describedby="city-error" {...register('city')} />
              </Field>
              <Field label="Quartier / secteur" htmlFor="district" error={err('district')}>
                <Input id="district" aria-invalid={!!errors.district} aria-describedby="district-error" {...register('district')} />
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
              <div className="h-64 overflow-hidden rounded-xl border border-ink-100">
                <MapView
                  markers={[
                    {
                      id: propertyId,
                      slug: '',
                      title: title || 'Nouveau terrain',
                      reference: '',
                      price: priceNum,
                      surface: surfaceNum,
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
            <p className="text-xs text-ink-500">Astuce : dans Google Maps, un clic droit sur le terrain affiche ses coordonnées GPS.</p>
          </Section>

          <Section id="description" title="Description">
            <Field
              label="Texte de l’annonce"
              htmlFor="description"
              error={err('description')}
              hint="Séparez les paragraphes par une ligne vide."
              aside={<Counter value={description ?? ''} max={5000} />}
            >
              <Textarea id="description" rows={8} aria-invalid={!!errors.description} aria-describedby="description-error" {...register('description')} />
            </Field>
          </Section>

          <Section id="caracteristiques" title="Caractéristiques" description="Viabilisation, accès et environnement du terrain.">
            <div className="flex flex-wrap gap-2">
              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm has-[:checked]:border-ink-950 has-[:checked]:bg-ink-50">
                <Checkbox {...register('has_water')} /> Eau (ONEA)
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm has-[:checked]:border-ink-950 has-[:checked]:bg-ink-50">
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
            <div>
              <p className="mb-2 text-sm font-medium text-ink-800">À proximité</p>
              <ul className="space-y-2">
                {nearby.fields.map((f, i) => (
                  <li key={f.id} className="grid gap-2 sm:grid-cols-[10rem_1fr_7rem_auto] sm:items-start">
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
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-ink-400">m</span>
                    </div>
                    <Button type="button" variant="danger-ghost" size="icon" className="rounded-xl" onClick={() => nearby.remove(i)} aria-label="Retirer ce lieu">
                      <Trash2 />
                    </Button>
                  </li>
                ))}
              </ul>
              <Button type="button" variant="outline" size="sm" className="mt-3 rounded-xl" onClick={() => nearby.append({ type: 'ecole', name: '', distance_m: 500 })}>
                <Plus /> Ajouter un lieu
              </Button>
            </div>
          </Section>

          <Section id="photos" title="Photos" description="Glissez-déposez pour ajouter ou réordonner. La photo principale illustre l’annonce partout sur le site.">
            <Controller
              control={control}
              name="images"
              render={({ field }) => <ImageManager propertyId={propertyId} value={field.value} onChange={(imgs) => field.onChange(imgs)} disabled={isDemo} />}
            />
          </Section>

          <Section id="documents" title="Documents" description="Statut juridique et pièces remises à l’acheteur.">
            <Field label="Statut juridique" htmlFor="legal_status">
              <Select id="legal_status" {...register('legal_status')}>
                {LEGAL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {legalLabels[s]}
                  </option>
                ))}
              </Select>
            </Field>
            <ul className="space-y-2">
              {documents.fields.map((f, i) => (
                <li key={f.id} className="grid gap-2 rounded-xl border border-ink-100 p-3 sm:grid-cols-[1fr_13rem_auto_auto] sm:items-center">
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
                  <label className="flex items-center gap-2 px-1 text-sm whitespace-nowrap">
                    <Checkbox {...register(`documents.${i}.is_available` as const)} /> Disponible
                  </label>
                  <Button type="button" variant="danger-ghost" size="icon" className="rounded-xl" onClick={() => documents.remove(i)} aria-label="Retirer le document">
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => documents.append({ name: '', doc_type: 'autre', file_url: null, is_available: true })}
            >
              <Plus /> Ajouter un document
            </Button>
            <Field label="Image du plan du terrain" htmlFor="cadastral_plan_url" optional hint="URL d’une image (par exemple une photo déjà envoyée).">
              <Input id="cadastral_plan_url" {...register('cadastral_plan_url')} />
            </Field>
          </Section>

          <Section id="seo" title="SEO" description="Laissez vide pour utiliser automatiquement le titre et la description de l’annonce.">
            <Field label="Titre pour Google" htmlFor="seo_title" optional error={err('seo_title')} aside={<Counter value={seoTitle ?? ''} max={70} />}>
              <Input id="seo_title" {...register('seo_title')} />
            </Field>
            <Field label="Description pour Google" htmlFor="seo_description" optional error={err('seo_description')} aside={<Counter value={seoDescription ?? ''} max={170} />}>
              <Textarea id="seo_description" rows={3} {...register('seo_description')} />
            </Field>
            <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-4" aria-label="Aperçu du résultat Google">
              <p className="text-xs text-ink-500">Aperçu du résultat de recherche</p>
              <p className="mt-2 truncate text-xs text-ink-600">
                {siteUrl.replace(/^https?:\/\//, '')} › terrains › {slug || '…'}
              </p>
              <p className="mt-0.5 truncate text-lg leading-snug text-[#1a0dab]">{previewTitle} | Progrès Habitat</p>
              <p className="mt-0.5 line-clamp-2 text-sm text-ink-600">{previewDescription || 'Description de l’annonce…'}</p>
            </div>
          </Section>

          <Section id="statut" title="Statut & publication">
            <Field label="Statut commercial" htmlFor="status">
              <Select id="status" {...register('status')}>
                {PROPERTY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </Select>
            </Field>
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink-800">Publication</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {PUBLICATION_OPTIONS.map(({ value, label, text, icon: Icon }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer flex-col gap-1 rounded-xl border border-ink-200 p-4 transition has-[:checked]:border-ink-950 has-[:checked]:ring-1 has-[:checked]:ring-ink-950 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-500"
                  >
                    <span className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-950">
                        <Icon className="size-4 text-ink-500" aria-hidden="true" /> {label}
                      </span>
                      <input type="radio" value={value} className="size-4 accent-ink-950" {...register('publication')} />
                    </span>
                    <span className="text-xs text-ink-500">{text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-200 p-4 text-sm has-[:checked]:border-ink-950">
              <Checkbox className="mt-0.5" disabled={publication === 'archive'} {...register('is_featured')} />
              <span>
                <strong className="block font-semibold text-ink-950">Mettre à la une</strong>
                <span className="text-ink-500">Affiché dans la sélection de la page d’accueil.</span>
              </span>
            </label>
          </Section>
        </div>

        {/* Résumé (grand écran) */}
        <aside className="hidden xl:block">
          <div className="sticky top-8 space-y-4">
            <div className="rounded-2xl border border-ink-100 bg-white p-5">
              <p className="text-xs font-semibold tracking-[0.08em] text-ink-500 uppercase">Résumé</p>
              <p className="mt-3 line-clamp-2 font-semibold text-ink-950">{title || 'Nouveau terrain'}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-500">Prix</dt>
                  <dd className="font-medium text-ink-950 tabular-nums">{priceNum ? formatPrice(priceNum) : '—'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-500">Surface</dt>
                  <dd className="font-medium text-ink-950 tabular-nums">{surfaceNum ? `${formatNumber(surfaceNum)} m²` : '—'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-500">Publication</dt>
                  <dd className="font-medium text-ink-950">{PUBLICATION_OPTIONS.find((o) => o.value === publication)?.label}</dd>
                </div>
              </dl>
            </div>
            {!isNew && (
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href={`/admin/terrains/${propertyId}/apercu`} target="_blank">
                  <ScanEye /> Prévisualiser l’annonce
                </Link>
              </Button>
            )}
          </div>
        </aside>
      </div>

      {/* Barre d'enregistrement */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-200 bg-white/95 backdrop-blur lg:left-[15.5rem]">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <p className="hidden items-center gap-2 text-sm text-ink-500 sm:flex" aria-live="polite">
            <span className={cn('size-2 rounded-full', isDirty ? 'bg-amber-500' : 'bg-emerald-500')} aria-hidden="true" />
            {isDirty ? 'Modifications non enregistrées' : 'Tout est enregistré'}
          </p>
          <div className="flex flex-1 justify-end gap-2 sm:flex-none">
            {!isNew && (
              <Button asChild variant="outline" className="rounded-xl xl:hidden">
                <Link href={`/admin/terrains/${propertyId}/apercu`} target="_blank">
                  <ScanEye /> Aperçu
                </Link>
              </Button>
            )}
            <Button type="submit" className="rounded-xl" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              {publication === 'publie' ? 'Enregistrer et publier' : publication === 'archive' ? 'Enregistrer (archivé)' : 'Enregistrer le brouillon'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
