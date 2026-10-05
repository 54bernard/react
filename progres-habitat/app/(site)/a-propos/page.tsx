import Image from 'next/image';
import Link from 'next/link';
import { Compass, Eye, FileCheck2, HardHat, Scale, Target, Users } from 'lucide-react';
import { CtaSection } from '@/components/home/sections';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/misc';
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

      <section className="container-page section-y grid items-center gap-12 lg:grid-cols-12 lg:gap-16" aria-labelledby="histoire">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow mb-5">Notre histoire</p>
          <h2 id="histoire" className="text-h2 max-w-xl">
            Née d’un constat : acheter un terrain doit être simple et sûr
          </h2>
          <div className="mt-8 max-w-xl space-y-5 text-[17px] leading-[1.7] text-ink-600">
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
        <Reveal delay={0.1} className="lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand-100 sm:aspect-[4/3] lg:aspect-[4/5]">
            <Image src="/images/apropos.webp" alt="Lotissement aménagé vu du ciel" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </section>

      <section className="bg-ink-950 text-white" aria-label="Mission et vision">
        <div className="container-page section-y grid gap-14 md:grid-cols-2 md:gap-10 lg:gap-20">
          <Reveal>
            <Target className="size-6 text-brand-300" strokeWidth={1.6} aria-hidden="true" />
            <h2 className="text-h3 mt-8 text-white">Notre mission</h2>
            <p className="mt-5 max-w-md text-lead text-white/65">
              Rendre l’accès à la propriété foncière sûr et accessible, en proposant des terrains vérifiés, des prix
              transparents et des modalités de paiement adaptées aux réalités de chacun.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="border-t border-white/10 pt-14 md:border-t-0 md:border-l md:pt-0 md:pl-10 lg:pl-20">
            <Eye className="size-6 text-accent-400" strokeWidth={1.6} aria-hidden="true" />
            <h2 className="text-h3 mt-8 text-white">Notre vision</h2>
            <p className="mt-5 max-w-md text-lead text-white/65">
              Devenir l’acteur de référence du foncier et de la construction au Burkina Faso, en contribuant à des quartiers
              mieux planifiés, viabilisés et agréables à vivre.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page section-y" aria-labelledby="valeurs">
        <SectionHeading id="valeurs" eyebrow="Nos valeurs" title="Ce qui guide notre travail" />
        <ul className="mt-14 grid gap-x-10 gap-y-12 border-t border-ink-950/[0.08] pt-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.06}>
              <Icon className="size-6 text-brand-700" strokeWidth={1.6} aria-hidden="true" />
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink-950">{title}</h3>
              <p className="mt-3 leading-relaxed text-ink-500">{text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-t border-ink-950/[0.06] bg-white" aria-labelledby="equipe">
        <div className="container-page section-y grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-5">L’équipe</p>
            <h2 id="equipe" className="text-h2 max-w-xl">
              Des conseillers fonciers et des ingénieurs BTP
            </h2>
            <p className="mt-8 max-w-xl text-[17px] leading-[1.7] text-ink-600">
              Notre équipe réunit des conseillers commerciaux, un service administratif dédié au suivi des dossiers
              fonciers et des techniciens du bâtiment et du génie civil. Chaque client est suivi par un conseiller unique,
              du premier contact à la remise des documents.
            </p>
            <Button asChild className="mt-10">
              <Link href="/contact">Rencontrer un conseiller</Link>
            </Button>
          </div>
          <div className="self-start rounded-3xl bg-sand-100 p-8 sm:p-10 lg:col-span-5 lg:col-start-8">
            <Compass className="size-6 text-brand-700" strokeWidth={1.6} aria-hidden="true" />
            <h3 className="text-h3 mt-8">Documents administratifs et agréments</h3>
            <p className="mt-4 leading-relaxed text-ink-600">
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
