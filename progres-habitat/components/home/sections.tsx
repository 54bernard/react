import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { WhatsAppIcon } from '@/components/layout/whatsapp-icon';
import { PropertyCard } from '@/components/property/property-card';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/misc';
import { Reveal } from '@/components/ui/reveal';
import { cn, formatPrice, formatSurface } from '@/lib/utils';
import { phoneHref, whatsappLink } from '@/lib/whatsapp';
import type { LocationWithStats, PropertyWithRelations, Testimonial } from '@/types';

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ink-950">
      <span className="link-underline">{children}</span>
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}

/* ------------------------------------------------------------ Terrains à la une */
export function FeaturedProperties({ properties }: { properties: PropertyWithRelations[] }) {
  return (
    <section className="section-y" aria-labelledby="featured-title">
      <div className="container-page">
        <SectionHeading
          id="featured-title"
          eyebrow="Sélection du moment"
          title="Terrains à la une"
          description="Des parcelles vérifiées par nos équipes, prêtes à accueillir votre projet."
          action={<TextLink href="/terrains">Voir tous les terrains</TextLink>}
        />
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {properties.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 3) * 0.08}>
              <PropertyCard property={p} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Terrains populaires */
export function PopularProperties({ properties }: { properties: PropertyWithRelations[] }) {
  if (properties.length === 0) return null;
  return (
    <section className="border-y border-ink-950/[0.06] bg-white" aria-labelledby="popular-title">
      <div className="container-page grid gap-10 py-16 lg:grid-cols-[18rem_1fr] lg:gap-16 lg:py-20">
        <div>
          <p className="eyebrow mb-4">Les plus consultés</p>
          <h2 id="popular-title" className="text-h3">
            Terrains populaires
          </h2>
          <p className="mt-3 text-[15px] text-ink-500">Les annonces que nos visiteurs regardent le plus en ce moment.</p>
        </div>
        <ol className="grid divide-y divide-ink-950/[0.06] sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0">
          {properties.map((p, i) => (
            <li key={p.id} className="sm:border-b sm:border-ink-950/[0.06] sm:[&:nth-last-child(-n+2)]:border-0">
              <Link href={`/terrains/${p.slug}`} className="group flex items-center gap-5 py-5">
                <span className="w-6 font-display text-2xl text-ink-300 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sand-100 sm:size-[4.5rem]">
                  {p.images[0] && (
                    <Image
                      src={p.images[0].url}
                      alt=""
                      fill
                      sizes="72px"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-ink-950">{p.title}</p>
                  <p className="mt-1 text-sm text-ink-500">
                    {formatPrice(p.price)} · {formatSurface(p.surface)}
                  </p>
                </div>
                <ArrowUpRight
                  className="size-5 shrink-0 text-ink-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-950"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Zones */
export function ZonesSection({ zones }: { zones: LocationWithStats[] }) {
  return (
    <section className="section-y" aria-labelledby="zones-title">
      <div className="container-page">
        <SectionHeading
          id="zones-title"
          eyebrow="Nos zones"
          title="Rechercher par localisation"
          description="Des quartiers en développement à Ouagadougou et Tenkodogo, choisis pour leur desserte et leur potentiel."
          action={<TextLink href="/zones">Toutes les zones</TextLink>}
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-5">
          {zones.map((z, i) => (
            <Reveal
              as="li"
              key={z.id}
              delay={(i % 3) * 0.08}
              className={cn(i === 0 ? 'sm:col-span-2 lg:col-span-7 lg:row-span-2' : i < 3 ? 'lg:col-span-5' : 'lg:col-span-4', i >= 3 && 'lg:col-span-6')}
            >
              <ZoneCard zone={z} tall={i === 0} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ZoneCard({ zone, tall = false }: { zone: LocationWithStats; tall?: boolean }) {
  return (
    <Link
      href={`/terrains?zone=${zone.slug}`}
      className={cn(
        'group relative flex h-full min-h-72 flex-col justify-end overflow-hidden rounded-2xl bg-ink-900 p-6 text-white sm:p-7',
        tall && 'min-h-96 lg:min-h-[36rem]',
      )}
    >
      {zone.image_url && (
        <Image
          src={zone.image_url}
          alt=""
          fill
          sizes={tall ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 100vw'}
          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-premium)] group-hover:scale-[1.04]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-ink-950/0" />
      <div className="relative flex items-end justify-between gap-6">
        <div>
          <p className="text-[12px] font-medium tracking-[0.08em] text-white/65 uppercase">{zone.city}</p>
          <h3 className={cn('mt-2 font-display tracking-tight text-white', tall ? 'text-4xl sm:text-5xl' : 'text-[1.75rem]')}>{zone.name}</h3>
          <p className="mt-3 text-sm text-white/75">
            {zone.available_count} terrain{zone.available_count > 1 ? 's' : ''} disponible{zone.available_count > 1 ? 's' : ''}
            {zone.average_price !== null && <> · prix moyen {formatPrice(zone.average_price)}</>}
          </p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/30 transition-all duration-500 ease-[var(--ease-premium)] group-hover:border-white group-hover:bg-white group-hover:text-ink-950">
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------ Pourquoi nous choisir */
const reasons = [
  { title: 'Terrains vérifiés', text: 'Lotissement, bornage et situation administrative contrôlés avant toute mise en vente.' },
  { title: 'Accompagnement juridique', text: 'Nous vous guidons jusqu’à l’ACD et au titre foncier, à chaque étape.' },
  { title: 'Prix transparents', text: 'Prix affichés et frais annexes estimés par écrit avant la réservation.' },
  { title: 'Visites organisées', text: 'Sur place avec un conseiller, ou en vidéo pour la diaspora.' },
  { title: 'Paiements sécurisés', text: 'Contrat écrit, reçu pour chaque versement, comptant ou échelonné.' },
  { title: 'Service après-vente', text: 'Suivi des démarches et construction possible par nos équipes BTP.' },
];

export function WhyUs() {
  return (
    <section className="section-y border-t border-ink-950/[0.06] bg-white" aria-labelledby="why-title">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            id="why-title"
            eyebrow="Pourquoi Progrès Habitat"
            title="Acheter un terrain, en toute confiance."
            description="Une parcelle est souvent l’investissement d’une vie. Notre rôle : sécuriser chaque étape, du premier appel à la remise des documents."
          />
          <div className="relative mt-10 aspect-[5/4] overflow-hidden rounded-3xl">
            <Image src="/images/apropos.webp" alt="Vue aérienne d’un lotissement aménagé" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
        <ol className="grid sm:grid-cols-2 sm:gap-x-12">
          {reasons.map(({ title, text }, i) => (
            <Reveal as="li" key={title} delay={(i % 2) * 0.08} className="border-t border-ink-950/10 py-8">
              <span className="font-display text-sm text-ink-400 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 text-lg font-semibold tracking-[-0.01em] text-ink-950">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Processus d'achat */
export const purchaseSteps = [
  { title: 'Découvrir', text: 'Parcourez nos terrains ou échangez avec un conseiller sur votre projet et votre budget.' },
  { title: 'Choisir', text: 'Nous vous proposons une sélection adaptée : zone, surface, budget.' },
  { title: 'Visiter', text: 'Visite gratuite avec un conseiller, ou en vidéo si vous êtes à l’étranger.' },
  { title: 'Vérifier les documents', text: 'Vous recevez les références du document pour vérification auprès des services compétents.' },
  { title: 'Réserver', text: 'Acompte et signature du contrat de réservation, avec reçu.' },
  { title: 'Finaliser l’achat', text: 'Règlement du solde, bornage contradictoire et remise des documents officiels.' },
];

export function PurchaseProcess({ compact = false }: { compact?: boolean }) {
  return (
    <section className={cn('bg-ink-950 text-white', compact ? 'py-16 lg:py-24' : 'section-y')} aria-labelledby="process-title">
      <div className="container-page">
        <SectionHeading
          id="process-title"
          tone="inverse"
          eyebrow="Processus d’achat"
          title="Six étapes claires, un seul interlocuteur."
          description="De la première visite à la remise des documents, vous savez toujours où en est votre dossier."
        />
        <ol className="relative mt-14 grid gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:mt-20 lg:grid-cols-6 lg:gap-x-6">
          <span aria-hidden="true" className="absolute top-[1.4rem] right-0 left-0 hidden h-px bg-white/15 lg:block" />
          {purchaseSteps.map(({ title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.06} className="relative">
              <span className="relative grid size-11 place-items-center rounded-full border border-white/20 bg-ink-950 font-display text-[15px] text-white tabular-nums">
                {i + 1}
              </span>
              <h3 className="mt-6 text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">{text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Témoignages */
export function Testimonials({ items, isExample }: { items: Testimonial[]; isExample: boolean }) {
  if (items.length === 0) return null;
  return (
    <section className="section-y" aria-labelledby="testimonials-title">
      <div className="container-page">
        <SectionHeading
          id="testimonials-title"
          eyebrow="Témoignages"
          title="Ils nous ont fait confiance."
          description={isExample ? 'Mode démonstration : ces cartes sont des exemples de mise en page, pas de vrais avis.' : undefined}
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {items.slice(0, 3).map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-ink-950/[0.07] bg-white p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5" role="img" aria-label={`Note : ${t.rating} sur 5`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className={cn('size-3.5', s < t.rating ? 'fill-ink-950 text-ink-950' : 'text-ink-200')} aria-hidden="true" />
                    ))}
                  </div>
                  {isExample && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900">Exemple</span>}
                </div>
                <blockquote className="mt-6 flex-1 font-display text-[1.25rem] leading-snug tracking-[-0.01em] text-ink-950">
                  « {t.content} »
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-ink-950/[0.07] pt-5">
                  {t.photo_url ? (
                    <Image src={t.photo_url} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
                  ) : (
                    <span className="grid size-10 place-items-center rounded-full bg-sand-100 text-sm font-semibold text-ink-700" aria-hidden="true">
                      {t.name.replace(/^Exemple — /, '').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-ink-950">{t.name}</p>
                    {t.property_label && <p className="text-[13px] text-ink-500">{t.property_label}</p>}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Appel à l'action */
export function CtaSection({ whatsapp, phone }: { whatsapp: string; phone: string }) {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-10 lg:pb-28" aria-labelledby="cta-title">
      <div className="relative isolate mx-auto max-w-[80rem] overflow-hidden rounded-3xl bg-ink-950 px-6 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-28">
        <Image src="/images/hero.webp" alt="" fill sizes="(min-width: 1280px) 1280px, 100vw" className="-z-10 object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/30" />
        <div className="max-w-2xl">
          <p className="eyebrow !text-white/60">Parlons de votre projet</p>
          <h2 id="cta-title" className="mt-5 text-h1 text-white">
            Votre futur terrain vous attend.
          </h2>
          <p className="mt-5 max-w-lg text-lead text-white/70">
            Un conseiller vous aide à trouver la parcelle adaptée à votre budget et organise votre visite.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="light">
              <a href={whatsappLink(whatsapp, 'Bonjour, je souhaite parler avec un conseiller Progrès Habitat.')} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> Parler avec un conseiller
              </a>
            </Button>
            <Button asChild size="lg" variant="glass">
              <a href={phoneHref(phone)}>Appeler le {phone}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
