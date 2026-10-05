import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FaqList } from '@/components/home/faq-list';
import { Hero } from '@/components/home/hero';
import { HomeMap } from '@/components/home/home-map';
import { KeyFigures } from '@/components/home/key-figures';
import {
  CtaSection,
  FeaturedProperties,
  PopularProperties,
  PurchaseProcess,
  Testimonials,
  WhyUs,
  ZonesSection,
} from '@/components/home/sections';
import { toMarker } from '@/components/map/types';
import { JsonLd } from '@/components/seo/json-ld';
import { SectionHeading } from '@/components/ui/misc';
import { faqJsonLd, pageMetadata } from '@/lib/seo';
import { getFaq, getKeyFigures, getSettings, getTestimonials } from '@/services/content';
import {
  getFeaturedProperties,
  getLocationsWithStats,
  getPopularProperties,
  listAllMatching,
} from '@/services/properties';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Progrès Habitat — Terrains à vendre à Ouagadougou et Tenkodogo',
  description:
    'Trouvez le terrain idéal pour construire votre avenir : parcelles vérifiées à Ouagadougou et Tenkodogo, documents officiels, visites accompagnées et paiement échelonné.',
  path: '/',
});

export default async function HomePage() {
  const [settings, featured, popular, zones, figures, testimonials, faq, all] = await Promise.all([
    getSettings(),
    getFeaturedProperties(6),
    getPopularProperties(4),
    getLocationsWithStats(),
    getKeyFigures(),
    getTestimonials(),
    getFaq(),
    listAllMatching({}),
  ]);

  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <Hero zones={zones} whatsapp={settings.whatsapp} />
      <KeyFigures figures={figures} />
      <FeaturedProperties properties={featured} />
      <PopularProperties properties={popular} />
      <ZonesSection zones={zones.slice(0, 5)} />
      <WhyUs />
      <PurchaseProcess />

      <section className="section-y" aria-labelledby="map-title">
        <div className="container-page">
          <SectionHeading
            id="map-title"
            eyebrow="Carte interactive"
            title="Tous nos terrains, sur la carte."
            description="Survolez un terrain pour le repérer, touchez un prix pour voir le détail."
            action={
              <Link href="/terrains?vue=carte" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ink-950">
                <span className="link-underline">Ouvrir la carte complète</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-12 lg:mt-16">
            <HomeMap markers={all.map(toMarker)} />
          </div>
        </div>
      </section>

      <Testimonials items={testimonials.items} isExample={testimonials.isExample} />

      <section className="section-y border-t border-ink-950/[0.06] bg-white" aria-labelledby="faq-title">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <SectionHeading
            id="faq-title"
            eyebrow="Questions fréquentes"
            title="Vos questions, nos réponses."
            description={
              <>
                Une autre question ?{' '}
                <Link href="/contact" className="font-medium text-ink-950 underline decoration-ink-300 underline-offset-4 hover:decoration-ink-950">
                  Contactez-nous
                </Link>
                , un conseiller vous répond rapidement.
              </>
            }
          />
          <FaqList items={faq} />
        </div>
      </section>

      <div className="bg-white pt-4">
        <CtaSection whatsapp={settings.whatsapp} phone={settings.phone} />
      </div>
    </>
  );
}
