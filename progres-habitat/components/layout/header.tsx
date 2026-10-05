'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, Phone } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { WhatsAppIcon } from '@/components/layout/whatsapp-icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useFavorites } from '@/hooks/use-favorites';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';
import { phoneHref, whatsappLink } from '@/lib/whatsapp';

interface HeaderProps {
  phone: string;
  whatsapp: string;
  isDemo?: boolean;
}

export function Header({ phone, whatsapp, isDemo = false }: HeaderProps) {
  const pathname = usePathname();
  // Header transparent au-dessus du visuel plein écran de la page d'accueil
  const overlay = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const { favorites } = useFavorites();
  const transparent = overlay && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const waHref = whatsappLink(whatsapp, 'Bonjour Progrès Habitat, je souhaite des informations sur vos terrains.');

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300',
        transparent
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-ink-100/80 bg-white/85 shadow-[0_1px_0_rgb(15_25_29/0.02)] backdrop-blur-xl backdrop-saturate-150',
      )}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lift"
      >
        Aller au contenu
      </a>
      {isDemo && (
        <p className="flex h-8 items-center justify-center bg-ink-900 px-4 text-center text-[11px] font-medium text-white/85 sm:text-xs">
          Mode démonstration — terrains, chiffres et témoignages d’exemple. Connectez Supabase pour publier vos offres.
        </p>
      )}
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
        <div className={cn('rounded-xl transition', transparent && 'bg-white/95 px-2.5 py-1 shadow-soft')}>
          <Logo priority />
        </div>

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'relative rounded-lg px-3 py-2 text-[15px] font-medium transition-colors',
                    transparent ? 'text-white/90 hover:text-white' : 'text-ink-600 hover:text-ink-900',
                    isActive(item.href) && (transparent ? 'text-white' : 'text-ink-900'),
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-300',
                      transparent ? 'bg-white' : 'bg-accent-500',
                      isActive(item.href) && 'scale-x-100',
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/favoris"
            className={cn(
              'relative hidden size-10 place-items-center rounded-full transition sm:grid',
              transparent ? 'text-white hover:bg-white/15' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
            )}
            aria-label={`Mes favoris (${favorites.length})`}
          >
            <Heart className="size-5" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 grid min-w-4.5 place-items-center rounded-full bg-accent-500 px-1 text-[10px] leading-4.5 font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>
          <Button asChild variant="whatsapp" size="md" className="hidden md:inline-flex">
            <a href={waHref} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> WhatsApp
            </a>
          </Button>
          <Button asChild variant={transparent ? 'light' : 'primary'} size="md" className="hidden lg:inline-flex">
            <Link href="/terrains">Voir les terrains</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className={cn(
                  'grid size-11 cursor-pointer place-items-center rounded-full transition xl:hidden',
                  transparent ? 'text-white hover:bg-white/15' : 'text-ink-800 hover:bg-ink-100',
                )}
                aria-label="Ouvrir le menu"
              >
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent title="Menu" description="Progrès Habitat — terrains au Burkina Faso">
              <nav aria-label="Navigation mobile" className="px-3 py-4">
                <ul className="space-y-1">
                  {[...siteConfig.nav, { href: '/favoris', label: `Mes favoris${favorites.length ? ` (${favorites.length})` : ''}` }].map(
                    (item) => (
                      <li key={item.href}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            aria-current={isActive(item.href) ? 'page' : undefined}
                            className={cn(
                              'flex items-center justify-between rounded-xl px-4 py-3.5 text-[17px] font-medium transition',
                              isActive(item.href) ? 'bg-brand-50 text-brand-700' : 'text-ink-800 hover:bg-ink-50',
                            )}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
              <div className="space-y-3 border-t border-ink-100 p-5">
                <SheetClose asChild>
                  <Button asChild size="lg" className="w-full">
                    <Link href="/terrains">Voir les terrains</Link>
                  </Button>
                </SheetClose>
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="whatsapp" size="lg">
                    <a href={waHref} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon /> WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href={phoneHref(phone)}>
                      <Phone /> Appeler
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
