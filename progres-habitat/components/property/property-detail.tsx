import Image from 'next/image';
import Link from 'next/link';
import {
  AlertTriangle,
  Banknote,
  Building2,
  CalendarClock,
  Check,
  Droplets,
  FileCheck2,
  FileText,
  GraduationCap,
  Hash,
  HeartPulse,
  Landmark,
  MapPin,
  Maximize2,
  Mountain,
  Navigation,
  Route,
  ShoppingBag,
  Bus,
  Church,
  X,
  Zap,
} from 'lucide-react';
import { toMarker } from '@/components/map/types';
import { MapView } from '@/components/map/map-view';
import { LazyMount } from '@/components/ui/lazy-mount';
import { Gallery } from '@/components/property/gallery';
import { MobileActionBar, PropertyActions } from '@/components/property/property-actions';
import { PropertyCard } from '@/components/property/property-card';
import { StatusBadge } from '@/components/property/status-badge';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { legalLabels, nearbyLabels, paymentLabels, typeLabels } from '@/lib/labels';
import { cn, formatDistance, formatNumber, formatPrice, formatSurface, pricePerSquareMeter } from '@/lib/utils';
import type { NearbyType, PropertyWithRelations, SiteSettings } from '@/types';

const nearbyIcons: Record<NearbyType, typeof GraduationCap> = {
  ecole: GraduationCap,
  commerce: ShoppingBag,
  sante: HeartPulse,
  route: Route,
  transport: Bus,
  lieu_culte: Church,
};

function Section({ id, title, children, className }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={cn('border-t border-ink-100 py-10', className)}>
      <h2 id={id} className="font-display text-2xl font-medium tracking-tight">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Feature({ icon: Icon, label, value, ok }: { icon: typeof Droplets; label: string; value: string; ok?: boolean }) {
  return (
    <div className="relative rounded-2xl border border-ink-100 bg-white py-4 pr-4 pl-[4.375rem]">
      <dt className="text-sm text-ink-500">
        <span className="absolute top-1/2 left-4 grid size-10 -translate-y-1/2 place-items-center rounded-xl bg-sand-100 text-ink-700" aria-hidden="true">
          <Icon className="size-5" strokeWidth={1.7} />
        </span>
        {label}
      </dt>
      <dd className="mt-0.5 flex min-w-0 items-center gap-1.5 font-medium text-ink-900">
        {ok !== undefined &&
          (ok ? <Check className="size-4 text-emerald-600" aria-hidden="true" /> : <X className="size-4 text-ink-400" aria-hidden="true" />)}
        {value}
      </dd>
    </div>
  );
}

interface Props {
  property: PropertyWithRelations;
  settings: SiteSettings;
  similar: PropertyWithRelations[];
  pageUrl: string;
  preview?: boolean;
}

export function PropertyDetail({ property: p, settings, similar, pageUrl, preview = false }: Props) {
  const ppm = pricePerSquareMeter(p.price, p.surface);
  const installments = p.payment_options.includes('echelonne') && p.installment_months;
  const deposit = Math.round((p.price * 0.3) / 10_000) * 10_000;
  const monthly = installments ? Math.ceil((p.price - deposit) / (p.installment_months ?? 1) / 1_000) * 1_000 : 0;

  // Seuls les champs utiles sont transmis aux composants client
  const actionProperty = {
    id: p.id,
    slug: p.slug,
    reference: p.reference,
    title: p.title,
    district: p.district,
    city: p.city,
    price: p.price,
    surface: p.surface,
    status: p.status,
  };

  const statusNotice =
    p.status === 'vendu'
      ? { title: 'Ce terrain a été vendu', text: 'Contactez-nous : nous vous proposerons des terrains similaires dans la même zone.' }
      : p.status === 'reserve'
        ? { title: 'Ce terrain est actuellement réservé', text: 'Une réservation est en cours. Laissez-nous vos coordonnées pour être prévenu s’il redevient disponible.' }
        : null;

  return (
    <div className={cn('pb-28 lg:pb-0', !preview && 'pt-header')}>
      <div className="container-page pt-6 lg:pt-10">
        <Breadcrumbs
          items={[
            { name: 'Terrains', path: '/terrains' },
            { name: p.city, path: `/terrains?ville=${encodeURIComponent(p.city)}` },
            { name: p.reference, path: `/terrains/${p.slug}` },
          ]}
        />

        <header className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={p.status} />
              <Badge variant="neutral">{typeLabels[p.type]}</Badge>
              {p.payment_options.includes('echelonne') && (
                <Badge variant="brand">
                  <CalendarClock aria-hidden="true" /> Paiement échelonné
                </Badge>
              )}
            </div>
            <h1 className="mt-4 font-display text-3xl leading-tight font-medium tracking-tight sm:text-4xl lg:text-[2.75rem]">{p.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-ink-500">
              <MapPin className="size-4.5 text-brand-600" aria-hidden="true" /> {p.district}, {p.city}
            </p>
          </div>
          <div className="lg:text-right">
            <p className="text-sm text-ink-500">Prix</p>
            <p className={cn('font-display text-4xl font-medium tracking-tight', p.status === 'vendu' && 'text-ink-400 line-through decoration-1')}>
              {formatPrice(p.price)}
            </p>
            <p className="mt-1 text-sm text-ink-500">
              {formatSurface(p.surface)} · soit {formatNumber(ppm)} FCFA/m²
            </p>
          </div>
        </header>

        <div className="mt-8">
          <Gallery
            images={p.images}
            title={p.title}
            overlay={
              p.status !== 'disponible' ? (
                <div className="pointer-events-none absolute inset-0 grid place-items-center bg-ink-950/30">
                  <span className="rounded-full bg-white px-6 py-2.5 text-lg font-semibold tracking-wide text-ink-900 uppercase shadow-lift">
                    {p.status === 'vendu' ? 'Vendu' : 'Réservé'}
                  </span>
                </div>
              ) : undefined
            }
          />
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
          <div className="min-w-0">
            {statusNotice && (
              <div role="status" className="mb-8 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <AlertTriangle className="size-5 shrink-0 text-amber-600" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-amber-900">{statusNotice.title}</p>
                  <p className="mt-1 text-sm text-amber-800">{statusNotice.text}</p>
                </div>
              </div>
            )}

            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Maximize2, label: 'Superficie', value: formatSurface(p.surface) },
                { icon: Landmark, label: 'Document', value: legalLabels[p.legal_status].replace(/ \(.+\)$/, '') },
                { icon: Building2, label: 'Type', value: typeLabels[p.type] },
                { icon: Hash, label: 'Référence', value: p.reference },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl bg-white p-4 ring-1 ring-ink-100">
                  <dt className="text-xs text-ink-500">
                    <Icon className="mb-3 size-5 text-brand-600" strokeWidth={1.7} aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="mt-0.5 font-semibold text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>

            <Section id="description" title="Description">
              <div className="space-y-4 text-[17px] leading-relaxed text-ink-600">
                {p.description.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {p.amenities.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.amenities.map((a) => (
                    <li key={a} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800">
                      <Check className="size-3.5" aria-hidden="true" /> {a}
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section id="caracteristiques" title="Caractéristiques">
              <dl className="grid gap-3 sm:grid-cols-2">
                <Feature icon={Route} label="Accès routier" value={p.road_access ?? 'À préciser lors de la visite'} />
                <Feature
                  icon={Navigation}
                  label="Distance du goudron"
                  value={p.distance_to_paved_road_m === null ? 'Non renseignée' : p.distance_to_paved_road_m === 0 ? 'En bordure de voie bitumée' : formatDistance(p.distance_to_paved_road_m)}
                />
                <Feature icon={Droplets} label="Eau (ONEA)" value={p.has_water ? 'Disponible' : 'Non raccordé'} ok={p.has_water} />
                <Feature icon={Zap} label="Électricité (SONABEL)" value={p.has_electricity ? 'Disponible' : 'Non raccordé'} ok={p.has_electricity} />
                <Feature icon={Mountain} label="Topographie" value={p.topography ?? 'Non renseignée'} />
                <Feature icon={MapPin} label="Quartier" value={`${p.district}, ${p.city}`} />
              </dl>
            </Section>

            <Section id="documents" title="Documents et statut juridique">
              <p className="mb-5 text-ink-600">
                Statut juridique : <strong className="font-semibold text-ink-900">{legalLabels[p.legal_status]}</strong>. Les
                références des documents vous sont communiquées pour vérification avant toute réservation.
              </p>
              <ul className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
                {p.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <span className="flex items-center gap-3">
                      <FileText className="size-5 text-ink-400" aria-hidden="true" />
                      <span className="font-medium text-ink-800">{doc.name}</span>
                    </span>
                    {doc.is_available ? (
                      <Badge variant="success">
                        <FileCheck2 aria-hidden="true" /> Disponible
                      </Badge>
                    ) : (
                      <Badge variant="neutral">En cours</Badge>
                    )}
                  </li>
                ))}
              </ul>
            </Section>

            {p.nearby.length > 0 && (
              <Section id="proximite" title="À proximité">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {p.nearby.map((place) => {
                    const Icon = nearbyIcons[place.type] ?? MapPin;
                    return (
                      <li key={`${place.type}-${place.name}`} className="flex items-center gap-3.5 rounded-2xl border border-ink-100 bg-white p-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                          <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-ink-900">{place.name}</p>
                          <p className="text-sm text-ink-500">{nearbyLabels[place.type]}</p>
                        </div>
                        <span className="text-sm font-semibold whitespace-nowrap text-ink-700">{formatDistance(place.distance_m)}</span>
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}

            <Section id="localisation" title="Localisation">
              <LazyMount className="h-80 overflow-hidden rounded-3xl border border-ink-100 bg-sand-100 sm:h-96">
                <MapView markers={[toMarker(p)]} singleZoom={15} interactivePopups={false} />
              </LazyMount>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-500">
                <p>
                  Coordonnées GPS :{' '}
                  <span className="font-mono text-ink-800">
                    {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
                  </span>
                </p>
                <Button asChild variant="outline" size="sm">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`} target="_blank" rel="noopener noreferrer">
                    <Navigation /> Itinéraire
                  </a>
                </Button>
              </div>
            </Section>

            {p.cadastral_plan_url && (
              <Section id="plan" title="Plan du terrain">
                <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-ink-100 bg-white">
                  <Image src={p.cadastral_plan_url} alt={`Plan de situation — ${p.reference}`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain" />
                </div>
                <p className="mt-3 text-sm text-ink-500">Plan indicatif. Le plan cadastral officiel est remis lors de la réservation.</p>
              </Section>
            )}

            <Section id="financement" title="Possibilités de financement">
              <div className="grid gap-4 sm:grid-cols-2">
                {p.payment_options.map((opt) => (
                  <div key={opt} className="rounded-2xl border border-ink-100 bg-white p-5">
                    <Banknote className="size-6 text-brand-600" strokeWidth={1.7} aria-hidden="true" />
                    <p className="mt-3 font-semibold">{paymentLabels[opt]}</p>
                    {opt === 'comptant' ? (
                      <p className="mt-1 text-sm text-ink-500">Règlement en une fois à la signature, contre reçu et remise des documents.</p>
                    ) : installments ? (
                      <p className="mt-1 text-sm text-ink-500">
                        Exemple : acompte de <strong className="text-ink-800">{formatPrice(deposit)}</strong> puis{' '}
                        <strong className="text-ink-800">{p.installment_months} mensualités</strong> d’environ{' '}
                        <strong className="text-ink-800">{formatPrice(monthly)}</strong>. Simulation indicative.
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-ink-500">Échéancier personnalisé selon votre situation.</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <aside aria-label="Contacter un conseiller" className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
              <p className="text-sm text-ink-500">Réf. {p.reference}</p>
              <p className="mt-1 font-display text-3xl font-medium tracking-tight">{formatPrice(p.price)}</p>
              <p className="mt-1 text-sm text-ink-500">{formatSurface(p.surface)}</p>
              <div className="my-6 h-px bg-ink-100" />
              <PropertyActions
                property={actionProperty}
                whatsapp={settings.whatsapp}
                phone={settings.phone}
                pageUrl={pageUrl}
                trackView={!preview}
              />
              <p className="mt-6 text-center text-xs leading-relaxed text-ink-400">
                Visite gratuite et sans engagement. Réponse rapide par WhatsApp ou téléphone.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similaires" className="mt-16 border-t border-ink-100 bg-white py-16 lg:mt-20 lg:py-20">
          <div className="container-page">
            <div className="flex items-end justify-between gap-4">
              <h2 id="similaires" className="font-display text-3xl font-medium tracking-tight">
                Terrains similaires
              </h2>
              <Link href={`/terrains?ville=${encodeURIComponent(p.city)}`} className="text-sm font-semibold text-brand-700 hover:underline">
                Voir tout à {p.city}
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <li key={s.id}>
                  <PropertyCard property={s} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {!preview && <MobileActionBar property={actionProperty} whatsapp={settings.whatsapp} phone={settings.phone} pageUrl={pageUrl} />}
    </div>
  );
}
