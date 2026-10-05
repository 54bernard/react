import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroSearch } from '@/components/home/hero-search';
import { HeroMotion } from '@/components/home/hero-motion';
import { WhatsAppIcon } from '@/components/layout/whatsapp-icon';
import { Button } from '@/components/ui/button';
import { whatsappLink } from '@/lib/whatsapp';
import type { Location } from '@/types';

export function Hero({ zones, whatsapp }: { zones: Location[]; whatsapp: string }) {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950" aria-labelledby="hero-title">
      <Image
        src="/images/hero.webp"
        alt="Vue aérienne d’un lotissement de parcelles"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="-z-10 object-cover motion-safe:animate-[hero-zoom_14s_var(--ease-premium)_both]"
      />
      {/* Voile directionnel : lisibilité du texte sans assombrir toute l'image */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/60 to-transparent" />

      <div className="container-page flex flex-1 flex-col justify-end pt-header pb-8 sm:pb-12 lg:pb-16">
        <div className="max-w-4xl">
          <HeroMotion>
            <p className="eyebrow !text-white/70">Ouagadougou · Tenkodogo</p>
          </HeroMotion>
          <HeroMotion delay={0.08}>
            <h1 id="hero-title" className="mt-6 text-display text-white">
              Trouvez le terrain idéal pour construire votre avenir.
            </h1>
          </HeroMotion>
          <HeroMotion delay={0.16}>
            <p className="mt-6 max-w-xl text-lead text-white/75">
              Des terrains vérifiés et sélectionnés dans les zones à fort potentiel, avec documents officiels et paiement
              échelonné.
            </p>
          </HeroMotion>
          <HeroMotion delay={0.24}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="light">
                <Link href="/terrains">
                  Découvrir les terrains <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <a
                  href={whatsappLink(whatsapp, 'Bonjour, je souhaite parler à un conseiller Progrès Habitat.')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon /> Parler à un conseiller
                </a>
              </Button>
            </div>
          </HeroMotion>
        </div>

        <HeroMotion delay={0.36} className="mt-12 lg:mt-20">
          <HeroSearch zones={zones.map((z) => ({ slug: z.slug, name: z.name, city: z.city }))} />
        </HeroMotion>
      </div>
    </section>
  );
}
