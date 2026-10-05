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
import { Button } from '@/components/ui/button';
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

      <section className="py-20 lg:py-28" aria-labelledby="map-title">
        <div className="container-page">
          <SectionHeading
            eyebrow="Carte interactive"
            title={<span id="map-title">Tous nos terrains, sur la carte</span>}
            description="Survolez un terrain pour le repérer, cliquez sur un prix pour voir le détail."
            action={
              <Button asChild variant="outline">
                <Link href="/terrains?vue=carte">
                  Ouvrir la carte complète <ArrowRight />
                </Link>
              </Button>
            }
          />
          <div className="mt-12">
            <HomeMap markers={all.map(toMarker)} />
          </div>
        </div>
      </section>

      <Testimonials items={testimonials.items} isExample={testimonials.isExample} />
      <CtaSection whatsapp={settings.whatsapp} phone={settings.phone} />

      <section className="py-20 lg:py-28" aria-labelledby="faq-title">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Questions fréquentes"
            title={<span id="faq-title">Vos questions, nos réponses</span>}
            description={
              <>
                Une autre question ?{' '}
                <Link href="/contact" className="font-medium text-brand-700 underline-offset-4 hover:underline">
                  Contactez-nous
                </Link>
                , un conseiller vous répond rapidement.
              </>
            }
          />
          <FaqList items={faq} />
        </div>
      </section>
    </>
  );
}
