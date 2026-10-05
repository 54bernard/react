import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, FileCheck2, FileClock, Navigation, X } from 'lucide-react';
import { toMarker } from '@/components/map/types';
import { MapView } from '@/components/map/map-view';
import { Gallery } from '@/components/property/gallery';
import { MobileActionBar, PropertyActions } from '@/components/property/property-actions';
import { PropertyCard } from '@/components/property/property-card';
import { StatusBadge } from '@/components/property/status-badge';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { LazyMount } from '@/components/ui/lazy-mount';
import { legalLabels, nearbyLabels, paymentLabels, typeLabels } from '@/lib/labels';
import { cn, formatDistance, formatNumber, formatPrice, formatSurface, pricePerSquareMeter } from '@/lib/utils';
import type { PropertyWithRelations, SiteSettings } from '@/types';

function Section({ id, title, children, className }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={cn('border-t border-ink-950/[0.08] py-12 lg:py-14', className)}>
      <h2 id={id} className="text-h3">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Ligne de fiche technique : libellé à gauche, valeur à droite, filet fin. */
function Spec({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-ink-950/[0.07] py-4">
      <dt className="text-[15px] text-ink-500">{label}</dt>
      <dd className="flex items-center gap-1.5 text-right text-[15px] font-medium text-ink-950">
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
      ? { title: 'Ce terrain a été vendu.', text: 'Contactez-nous : nous vous proposerons des terrains similaires dans la même zone.' }
      : p.status === 'reserve'
        ? { title: 'Ce terrain est actuellement réservé.', text: 'Laissez-nous vos coordonnées pour être prévenu s’il redevient disponible.' }
        : null;

  const keyFacts = [
    { label: 'Superficie', value: formatSurface(p.surface) },
    { label: 'Prix au m²', value: `${formatNumber(ppm)} FCFA` },
    { label: 'Document', value: legalLabels[p.legal_status].replace(/ \(.+\)$/, '') },
    { label: 'Type', value: typeLabels[p.type] },
  ];

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

        <header className="mt-8 mb-8 lg:mt-12 lg:mb-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusBadge status={p.status} />
            <p className="text-[12px] font-medium tracking-[0.08em] text-ink-500 uppercase">
              {p.district} · {p.city}
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <h1 className="max-w-3xl text-h1">{p.title}</h1>
            <div className="shrink-0 lg:pb-1 lg:text-right">
              <p className={cn('font-display text-[2rem] leading-none tracking-tight text-ink-950 tabular-nums sm:text-[2.5rem]', p.status === 'vendu' && 'text-ink-400 line-through decoration-1')}>
                {formatPrice(p.price)}
              </p>
              {p.payment_options.includes('echelonne') && p.installment_months && (
                <p className="mt-2 text-sm text-ink-500">Paiement possible jusqu’à {p.installment_months} mois</p>
              )}
            </div>
          </div>
        </header>

        <Gallery
          images={p.images}
          title={p.title}
          overlay={
            p.status !== 'disponible' ? (
              <span className="pointer-events-none absolute top-5 left-5 rounded-full bg-ink-950/80 px-4 py-2 text-[13px] font-semibold tracking-wide text-white backdrop-blur">
                {p.status === 'vendu' ? 'Vendu' : 'Réservé'}
              </span>
            ) : undefined
          }
        />

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
          <div className="min-w-0">
            {statusNotice && (
              <div role="status" className="mb-10 rounded-2xl bg-amber-50 p-5 text-[15px] text-amber-950">
                <strong className="font-semibold">{statusNotice.title}</strong> {statusNotice.text}
              </div>
            )}

            <dl className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
              {keyFacts.map(({ label, value }, i) => (
                <div key={label} className={cn('pr-4', i > 0 && 'sm:border-l sm:border-ink-950/[0.08] sm:pl-6', i % 2 === 1 && 'border-l border-ink-950/[0.08] pl-5 sm:pl-6')}>
                  <dt className="text-[12px] font-medium tracking-[0.08em] text-ink-500 uppercase">{label}</dt>
                  <dd className="mt-2 text-[17px] font-semibold tracking-[-0.01em] text-ink-950">{value}</dd>
                </div>
              ))}
            </dl>

            <Section id="description" title="Le terrain" className="mt-12">
              <div className="max-w-2xl space-y-5 text-[17px] leading-[1.75] text-ink-600">
                {p.description.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {p.amenities.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-2">
                  {p.amenities.map((a) => (
                    <li key={a} className="rounded-full border border-ink-950/10 px-3.5 py-1.5 text-sm text-ink-800">
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section id="caracteristiques" title="Caractéristiques">
              <dl className="grid sm:grid-cols-2 sm:gap-x-12">
                <Spec label="Accès" value={p.road_access ?? 'À préciser lors de la visite'} />
                <Spec
                  label="Distance du goudron"
                  value={p.distance_to_paved_road_m === null ? 'Non renseignée' : p.distance_to_paved_road_m === 0 ? 'En bordure' : formatDistance(p.distance_to_paved_road_m)}
                />
                <Spec label="Eau (ONEA)" value={p.has_water ? 'Disponible' : 'Non raccordé'} ok={p.has_water} />
                <Spec label="Électricité (SONABEL)" value={p.has_electricity ? 'Disponible' : 'Non raccordé'} ok={p.has_electricity} />
                <Spec label="Topographie" value={p.topography ?? 'Non renseignée'} />
                <Spec label="Référence" value={p.reference} />
              </dl>
            </Section>

            <Section id="documents" title="Documents et statut juridique">
              <p className="max-w-2xl text-[15px] leading-relaxed text-ink-600">
                Statut juridique : <strong className="font-semibold text-ink-950">{legalLabels[p.legal_status]}</strong>. Les références des documents
                vous sont communiquées pour vérification avant toute réservation.
              </p>
              <ul className="mt-6 border-t border-ink-950/[0.07]">
                {p.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between gap-4 border-b border-ink-950/[0.07] py-4">
                    <span className="text-[15px] text-ink-950">{doc.name}</span>
                    {doc.is_available ? (
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-emerald-700">
                        <FileCheck2 className="size-4" aria-hidden="true" /> Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500">
                        <FileClock className="size-4" aria-hidden="true" /> En cours
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Section>

            {p.nearby.length > 0 && (
              <Section id="proximite" title="À proximité">
                <dl className="grid sm:grid-cols-2 sm:gap-x-12">
                  {p.nearby.map((place) => (
                    <div key={`${place.type}-${place.name}`} className="flex items-baseline justify-between gap-6 border-b border-ink-950/[0.07] py-4">
                      <dt className="min-w-0">
                        <span className="block truncate text-[15px] font-medium text-ink-950">{place.name}</span>
                        <span className="text-[13px] text-ink-500">{nearbyLabels[place.type]}</span>
                      </dt>
                      <dd className="text-[15px] text-ink-700 tabular-nums">{formatDistance(place.distance_m)}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            )}

            <Section id="localisation" title="Localisation">
              <LazyMount className="h-80 overflow-hidden rounded-2xl bg-sand-100 sm:h-[26rem]">
                <MapView markers={[toMarker(p)]} singleZoom={15} interactivePopups={false} />
              </LazyMount>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-500">
                <p>
                  GPS{' '}
                  <span className="font-mono text-[13px] text-ink-800">
                    {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
                  </span>
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 font-semibold text-ink-950"
                >
                  <Navigation className="size-4" aria-hidden="true" />
                  <span className="link-underline">Itinéraire</span>
                </a>
              </div>
            </Section>

            {p.cadastral_plan_url && (
              <Section id="plan" title="Plan du terrain">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-ink-950/[0.07] bg-white">
                  <Image src={p.cadastral_plan_url} alt={`Plan de situation — ${p.reference}`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain" />
                </div>
                <p className="mt-3 text-sm text-ink-500">Plan indicatif. Le plan cadastral officiel est remis lors de la réservation.</p>
              </Section>
            )}

            <Section id="financement" title="Financement">
              <div className="grid gap-4 sm:grid-cols-2">
                {p.payment_options.map((opt) => (
                  <div key={opt} className="rounded-2xl bg-sand-100/70 p-6">
                    <p className="text-[12px] font-semibold tracking-[0.08em] text-ink-500 uppercase">{paymentLabels[opt]}</p>
                    {opt === 'comptant' ? (
                      <>
                        <p className="mt-3 font-display text-2xl tracking-tight text-ink-950">{formatPrice(p.price)}</p>
                        <p className="mt-2 text-sm text-ink-600">Règlement à la signature, contre reçu et remise des documents.</p>
                      </>
                    ) : installments ? (
                      <>
                        <p className="mt-3 font-display text-2xl tracking-tight text-ink-950">
                          ≈ {formatPrice(monthly)} <span className="font-sans text-sm text-ink-500">/ mois</span>
                        </p>
                        <p className="mt-2 text-sm text-ink-600">
                          Après un acompte de {formatPrice(deposit)}, sur {p.installment_months} mois. Simulation indicative.
                        </p>
                      </>
                    ) : (
                      <p className="mt-3 text-sm text-ink-600">Échéancier personnalisé selon votre situation.</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <aside aria-label="Contacter un conseiller" className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-ink-950/[0.08] bg-white p-7">
              <p className="text-[12px] font-medium tracking-[0.08em] text-ink-500 uppercase">Réf. {p.reference}</p>
              <p className="mt-3 font-display text-[2rem] leading-none tracking-tight text-ink-950 tabular-nums">{formatPrice(p.price)}</p>
              <p className="mt-2 text-sm text-ink-500">
                {formatSurface(p.surface)} · {p.district}
              </p>
              <div className="my-6 h-px bg-ink-950/[0.08]" />
              <PropertyActions property={actionProperty} whatsapp={settings.whatsapp} phone={settings.phone} pageUrl={pageUrl} trackView={!preview} />
              <p className="mt-6 text-center text-xs leading-relaxed text-ink-500">Visite gratuite et sans engagement.</p>
            </div>
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similaires" className="section-y mt-8 border-t border-ink-950/[0.06] bg-white">
          <div className="container-page">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="similaires" className="text-h2">
                Terrains similaires
              </h2>
              <Link href={`/terrains?ville=${encodeURIComponent(p.city)}`} className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ink-950">
                <span className="link-underline">Voir tout à {p.city}</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
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
