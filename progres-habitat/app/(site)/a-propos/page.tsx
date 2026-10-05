import Image from 'next/image';
import Link from 'next/link';
import { Compass, Eye, FileCheck2, HardHat, Scale, Target, Users } from 'lucide-react';
import { CtaSection } from '@/components/home/sections';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { pageMetadata } from '@/lib/seo';
import { getSettings } from '@/services/content';

export const metadata = pageMetadata({
  title: 'À propos de Progrès Habitat',
  description:
    'Progrès Habitat, entreprise de BTP et génie civil basée à Dassasgho (Ouagadougou) : vente de terrains vérifiés, accompagnement juridique et construction.',
  path: '/a-propos',
});

const values = [
  { icon: Scale, title: 'Transparence', text: 'Prix affichés, documents présentés avant tout engagement, contrats écrits.' },
  { icon: FileCheck2, title: 'Rigueur', text: 'Chaque terrain est vérifié : situation administrative, bornage, accès.' },
  { icon: Users, title: 'Proximité', text: 'Un conseiller dédié, joignable par téléphone et WhatsApp, avant comme après l’achat.' },
  { icon: HardHat, title: 'Savoir-faire BTP', text: 'Notre expertise en génie civil nous permet aussi de construire votre maison.' },
];

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'À propos', path: '/a-propos' }]}
        eyebrow="Qui sommes-nous"
        title={`${settings.company_name} : ${settings.tagline.toLowerCase()}`}
        description="Une entreprise burkinabè de BTP et de génie civil qui accompagne les familles et la diaspora dans l’achat de leur terrain, puis dans la construction de leur maison."
      />

      <section className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24" aria-labelledby="histoire">
        <Reveal>
          <p className="eyebrow mb-3">Notre histoire</p>
          <h2 id="histoire" className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Née d’un constat : acheter un terrain doit être simple et sûr
          </h2>
          <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink-600">
            <p>
              Au Burkina Faso, acheter une parcelle est souvent l’investissement d’une vie. Pourtant, beaucoup d’acheteurs
              se heurtent à des documents incomplets, des doubles ventes ou des démarches interminables.
            </p>
            <p>
              {settings.company_name} est née{settings.founded_year ? ` en ${settings.founded_year}` : ''} à Dassasgho,
              Ouagadougou, avec une ambition simple : proposer des terrains vérifiés, expliquer chaque étape et accompagner
              nos clients jusqu’à la remise des documents — et au-delà, grâce à notre activité de BTP et de génie civil.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src="/images/apropos.webp" alt="Lotissement aménagé vu du ciel" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </section>

      <section className="bg-white py-16 lg:py-24" aria-label="Mission et vision">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-3xl bg-brand-800 p-8 text-white sm:p-10">
            <Target className="size-8 text-brand-200" aria-hidden="true" />
            <h2 className="mt-6 font-display text-2xl font-medium text-white sm:text-3xl">Notre mission</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Rendre l’accès à la propriété foncière sûr et accessible, en proposant des terrains vérifiés, des prix
              transparents et des modalités de paiement adaptées aux réalités de chacun.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl bg-sand-100 p-8 sm:p-10">
            <Eye className="size-8 text-brand-700" aria-hidden="true" />
            <h2 className="mt-6 font-display text-2xl font-medium sm:text-3xl">Notre vision</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              Devenir l’acteur de référence du foncier et de la construction au Burkina Faso, en contribuant à des quartiers
              mieux planifiés, viabilisés et agréables à vivre.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16 lg:py-24" aria-labelledby="valeurs">
        <p className="eyebrow mb-3">Nos valeurs</p>
        <h2 id="valeurs" className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Ce qui guide notre travail
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.06} className="rounded-3xl border border-ink-100 bg-white p-7">
              <Icon className="size-7 text-brand-600" strokeWidth={1.7} aria-hidden="true" />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-500">{text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-y border-ink-100 bg-white py-16 lg:py-24" aria-labelledby="equipe">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow mb-3">L’équipe</p>
            <h2 id="equipe" className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Des conseillers fonciers et des ingénieurs BTP
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-600">
              Notre équipe réunit des conseillers commerciaux, un service administratif dédié au suivi des dossiers
              fonciers et des techniciens du bâtiment et du génie civil. Chaque client est suivi par un conseiller unique,
              du premier contact à la remise des documents.
            </p>
            <Button asChild className="mt-8">
              <Link href="/contact">Rencontrer un conseiller</Link>
            </Button>
          </div>
          <div className="rounded-3xl bg-sand-100 p-8 sm:p-10">
            <Compass className="size-8 text-brand-700" aria-hidden="true" />
            <h3 className="mt-6 text-xl font-semibold">Documents administratifs et agréments</h3>
            <p className="mt-3 leading-relaxed text-ink-600">
              Nos documents d’entreprise (registre du commerce, identifiant fiscal, attestations) sont présentés sur
              simple demande et lors de chaque rendez-vous. Pour chaque terrain, les références du document foncier
              (attestation d’attribution, ACD ou titre foncier) vous sont communiquées afin que vous puissiez les vérifier
              auprès des services compétents.
            </p>
          </div>
        </div>
      </section>

      <CtaSection whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}
