import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Eye,
  FileSearch,
  Handshake,
  HeartHandshake,
  KeyRound,
  Landmark,
  Search,
  ShieldCheck,
  Star,
  Wallet,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/layout/whatsapp-icon';
import { PropertyCard } from '@/components/property/property-card';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/misc';
import { Reveal } from '@/components/ui/reveal';
import { cn, formatPrice } from '@/lib/utils';
import { phoneHref, whatsappLink } from '@/lib/whatsapp';
import type { LocationWithStats, PropertyWithRelations, Testimonial } from '@/types';

/* ------------------------------------------------------------ Terrains à la une */
export function FeaturedProperties({ properties }: { properties: PropertyWithRelations[] }) {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="featured-title">
      <div className="container-page">
        <SectionHeading
          eyebrow="Sélection"
          title={<span id="featured-title">Terrains à la une</span>}
          description="Une sélection de parcelles vérifiées par nos équipes, prêtes à accueillir votre projet."
          action={
            <Button asChild variant="outline">
              <Link href="/terrains">
                Tous les terrains <ArrowRight />
              </Link>
            </Button>
          }
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
    <section className="border-y border-ink-100 bg-white py-16 lg:py-20" aria-labelledby="popular-title">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">
              <Eye className="size-4" aria-hidden="true" /> Les plus consultés
            </p>
            <h2 id="popular-title" className="font-display text-3xl font-medium tracking-tight">
              Terrains populaires
            </h2>
          </div>
        </div>
        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 [&>li]:min-w-0">
          {properties.map((p, i) => (
            <li key={p.id}>
              <Link
                href={`/terrains/${p.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-ink-100 p-3 transition hover:border-ink-200 hover:bg-sand-50"
              >
                <span className="w-7 shrink-0 text-center font-display text-2xl text-ink-300">{i + 1}</span>
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sand-100 sm:size-24">
                  {p.images[0] && (
                    <Image src={p.images[0].url} alt={p.images[0].alt ?? p.title} fill sizes="96px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink-900 group-hover:text-brand-700">{p.title}</p>
                  <p className="mt-0.5 truncate text-sm text-ink-500">
                    {p.district}, {p.city}
                  </p>
                  <p className="mt-1.5 font-semibold text-ink-900">{formatPrice(p.price)}</p>
                </div>
                <ArrowRight className="mr-2 size-5 shrink-0 text-ink-300 transition group-hover:translate-x-1 group-hover:text-brand-600" aria-hidden="true" />
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
    <section className="bg-sand-100/60 py-20 lg:py-28" aria-labelledby="zones-title">
      <div className="container-page">
        <SectionHeading
          eyebrow="Nos zones"
          title={<span id="zones-title">Recherchez par localisation</span>}
          description="Des quartiers en plein développement à Ouagadougou et Tenkodogo, choisis pour leur potentiel."
          action={
            <Button asChild variant="outline">
              <Link href="/zones">
                Toutes les zones <ArrowRight />
              </Link>
            </Button>
          }
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((z, i) => (
            <Reveal as="li" key={z.id} delay={(i % 3) * 0.08} className={cn(i === 0 && 'lg:row-span-2')}>
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
        'group relative flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-3xl bg-ink-900 p-6 text-white',
        tall && 'lg:min-h-[34rem]',
      )}
    >
      {zone.image_url && (
        <Image
          src={zone.image_url}
          alt={`Terrains à ${zone.name}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent" />
      <div className="relative">
        <p className="text-sm text-white/70">{zone.city}</p>
        <h3 className="mt-1 font-display text-2xl font-medium text-white sm:text-3xl">{zone.name}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span>
            <strong className="font-semibold">{zone.available_count}</strong>{' '}
            <span className="text-white/75">terrain{zone.available_count > 1 ? 's' : ''} disponible{zone.available_count > 1 ? 's' : ''}</span>
          </span>
          {zone.average_price !== null && (
            <span className="text-white/75">
              Prix moyen <strong className="font-semibold text-white">{formatPrice(zone.average_price)}</strong>
            </span>
          )}
        </div>
      </div>
      <span className="absolute top-5 right-5 grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-white group-hover:text-ink-900">
        <ArrowRight className="size-5 -rotate-45 transition group-hover:rotate-0" aria-hidden="true" />
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------ Pourquoi nous choisir */
const reasons = [
  { icon: BadgeCheck, title: 'Terrains vérifiés', text: 'Chaque parcelle est contrôlée : lotissement, bornage et situation administrative.' },
  { icon: Landmark, title: 'Accompagnement juridique', text: 'Nous vous guidons jusqu’à l’ACD et au titre foncier, en toute transparence.' },
  { icon: Wallet, title: 'Prix transparents', text: 'Prix affichés, frais annexes estimés par écrit avant toute réservation.' },
  { icon: CalendarCheck, title: 'Visites organisées', text: 'Visite gratuite sur site avec un conseiller, ou en vidéo pour la diaspora.' },
  { icon: ShieldCheck, title: 'Paiements sécurisés', text: 'Contrat écrit, reçu pour chaque versement, paiement comptant ou échelonné.' },
  { icon: HeartHandshake, title: 'Service après-vente', text: 'Suivi des démarches et construction possible par nos équipes BTP.' },
];

export function WhyUs() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="why-title">
      <div className="container-page grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Pourquoi Progrès Habitat"
            title={<span id="why-title">Acheter un terrain, en toute confiance</span>}
            description="Acheter une parcelle est souvent l’investissement d’une vie. Notre rôle : sécuriser chaque étape, du premier appel à la remise des documents."
          />
          <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/apropos.webp"
              alt="Vue aérienne d’un lotissement aménagé"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {reasons.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={(i % 2) * 0.08} className="border-t border-ink-100 pt-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon className="size-6" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-500">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Processus d'achat */
export const purchaseSteps = [
  { icon: Search, title: 'Découvrir', text: 'Parcourez nos terrains en ligne ou échangez avec un conseiller sur votre projet et votre budget.' },
  { icon: HeartHandshake, title: 'Choisir', text: 'Nous vous proposons une sélection adaptée à vos critères : zone, surface, budget.' },
  { icon: CalendarCheck, title: 'Visiter', text: 'Visite gratuite sur le terrain avec un conseiller, ou en vidéo si vous êtes à l’étranger.' },
  { icon: FileSearch, title: 'Vérifier les documents', text: 'Nous vous remettons les références du document pour vérification auprès des services compétents.' },
  { icon: Handshake, title: 'Réserver', text: 'Vous versez un acompte et signez le contrat de réservation, avec reçu.' },
  { icon: KeyRound, title: 'Finaliser l’achat', text: 'Règlement du solde, bornage contradictoire et remise des documents officiels.' },
];

export function PurchaseProcess({ compact = false }: { compact?: boolean }) {
  return (
    <section className={cn('bg-ink-950 text-white', compact ? 'py-16' : 'py-20 lg:py-28')} aria-labelledby="process-title">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3 !text-brand-300">Processus d’achat</p>
          <h2 id="process-title" className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Six étapes claires, un seul interlocuteur
          </h2>
        </div>
        <ol className="relative mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {purchaseSteps.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 0.1} className="relative pl-16">
              <span className="absolute top-0 left-0 grid size-12 place-items-center rounded-full border border-white/15 bg-white/5 font-display text-lg text-accent-400">
                {i + 1}
              </span>
              {i < purchaseSteps.length - 1 && (
                <span aria-hidden="true" className="absolute top-14 bottom-[-2.5rem] left-6 w-px bg-gradient-to-b from-white/20 to-transparent sm:hidden" />
              )}
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Icon className="size-5 text-brand-300" aria-hidden="true" /> {title}
              </h3>
              <p className="mt-2 leading-relaxed text-white/65">{text}</p>
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
    <section className="py-20 lg:py-28" aria-labelledby="testimonials-title">
      <div className="container-page">
        <SectionHeading
          eyebrow="Témoignages"
          align="center"
          title={<span id="testimonials-title">Ils nous ont fait confiance</span>}
          description={isExample ? 'Mode démonstration : ces cartes sont des exemples de mise en page, pas de vrais avis.' : undefined}
        />
        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-7 shadow-soft">
                {isExample && (
                  <span className="mb-4 self-start rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    Exemple
                  </span>
                )}
                <div className="flex gap-0.5" role="img" aria-label={`Note : ${t.rating} sur 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={cn('size-4', s < t.rating ? 'fill-accent-500 text-accent-500' : 'text-ink-200')} aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 text-[17px] leading-relaxed text-ink-700">“{t.content}”</blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-ink-100 pt-5">
                  {t.photo_url ? (
                    <Image src={t.photo_url} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
                  ) : (
                    <span className="grid size-11 place-items-center rounded-full bg-brand-50 font-semibold text-brand-700" aria-hidden="true">
                      {t.name.replace(/^Exemple — /, '').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="font-semibold text-ink-900">{t.name}</p>
                    {t.property_label && <p className="text-sm text-ink-500">{t.property_label}</p>}
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
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16" aria-labelledby="cta-title">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-brand-800 px-6 py-16 sm:px-12 lg:px-20 lg:py-24">
        <Image src="/images/hero.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25 mix-blend-luminosity" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900 via-brand-900/90 to-brand-800/60" />
        <div className="max-w-2xl">
          <h2 id="cta-title" className="font-display text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl">
            Votre futur terrain vous attend.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            Parlez à un conseiller : nous vous aidons à trouver la parcelle adaptée à votre budget et organisons votre
            visite.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="whatsapp">
              <a
                href={whatsappLink(whatsapp, 'Bonjour, je souhaite parler avec un conseiller Progrès Habitat.')}
                target="_blank"
                rel="noopener noreferrer"
              >
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
