import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
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
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 via-ink-950/45 to-ink-950/80" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_40%,rgb(15_25_29/0.55),transparent_60%)]" />

      <div className="container-page flex flex-1 flex-col justify-center pt-header pb-10">
        <HeroMotion>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md sm:text-sm">
            <ShieldCheck className="size-4 text-brand-300" aria-hidden="true" />
            Terrains vérifiés · Ouagadougou &amp; Tenkodogo
          </p>
          <h1
            id="hero-title"
            className="mt-6 max-w-4xl font-display text-[2.6rem] leading-[1.05] font-medium tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Trouvez le terrain idéal pour construire <em className="text-accent-400 not-italic">votre avenir</em>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Découvrez des terrains vérifiés et sélectionnés dans les zones à fort potentiel, avec documents officiels,
            visites accompagnées et paiement échelonné.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="accent">
              <Link href="/terrains">Découvrir les terrains</Link>
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

        <HeroMotion delay={0.25} className="mt-12 lg:mt-16">
          <HeroSearch zones={zones.map((z) => ({ slug: z.slug, name: z.name, city: z.city }))} />
        </HeroMotion>
      </div>
    </section>
  );
}
