'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Heart, Menu, Phone } from 'lucide-react';
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
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));
  const waHref = whatsappLink(whatsapp, 'Bonjour Progrès Habitat, je souhaite des informations sur vos terrains.');
  const navItems = siteConfig.nav.filter((item) => item.href !== '/');

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-premium)]',
        transparent ? 'border-b border-white/10 bg-transparent' : 'border-b border-ink-950/[0.06] bg-sand-50/85 backdrop-blur-xl backdrop-saturate-150',
      )}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lift"
      >
        Aller au contenu
      </a>
      {isDemo && (
        <p className="flex h-8 items-center justify-center bg-ink-950 px-4 text-center text-[11px] text-white/75 sm:text-xs">
          Mode démonstration — terrains, chiffres et témoignages d’exemple.
        </p>
      )}
      <div className="container-page flex h-[4.25rem] items-center justify-between gap-6 lg:h-20">
        <Logo priority tone={transparent ? 'light' : 'dark'} />

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative py-2 text-[14px] font-medium tracking-[-0.005em] transition-colors duration-300',
                      transparent ? 'text-white/75 hover:text-white' : 'text-ink-600 hover:text-ink-950',
                      active && (transparent ? 'text-white' : 'text-ink-950'),
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-500 ease-[var(--ease-premium)]',
                        transparent ? 'bg-white' : 'bg-ink-950',
                        active ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/favoris"
            className={cn(
              'relative hidden size-10 place-items-center rounded-full transition-colors sm:grid',
              transparent ? 'text-white hover:bg-white/10' : 'text-ink-700 hover:bg-ink-950/5',
            )}
            aria-label={`Mes favoris (${favorites.length})`}
          >
            <Heart className="size-[18px]" />
            {favorites.length > 0 && (
              <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[10px] leading-4 font-bold text-ink-950">
                {favorites.length}
              </span>
            )}
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Écrire sur WhatsApp"
            className={cn(
              'hidden size-10 place-items-center rounded-full transition-colors md:grid',
              transparent ? 'text-white hover:bg-white/10' : 'text-ink-700 hover:bg-ink-950/5',
            )}
          >
            <WhatsAppIcon className="size-[18px]" />
          </a>
          <Button asChild variant={transparent ? 'light' : 'primary'} size="sm" className="ml-1 hidden h-10 px-5 lg:inline-flex">
            <Link href="/terrains">
              Voir les terrains <ArrowRight />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className={cn(
                  'grid size-11 cursor-pointer place-items-center rounded-full transition-colors xl:hidden',
                  transparent ? 'text-white hover:bg-white/10' : 'text-ink-950 hover:bg-ink-950/5',
                )}
                aria-label="Ouvrir le menu"
              >
                <Menu className="size-[22px]" />
              </button>
            </SheetTrigger>
            <SheetContent title="Menu" description="Progrès Habitat — terrains au Burkina Faso">
              <nav aria-label="Navigation mobile" className="px-5 py-6">
                <ul>
                  {[...siteConfig.nav, { href: '/favoris', label: `Mes favoris${favorites.length ? ` (${favorites.length})` : ''}` }].map((item) => (
                    <li key={item.href} className="border-b border-ink-100 last:border-0">
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          aria-current={isActive(item.href) ? 'page' : undefined}
                          className={cn(
                            'flex items-center justify-between py-4 font-display text-[1.375rem] tracking-tight transition-colors',
                            isActive(item.href) ? 'text-ink-950' : 'text-ink-600 hover:text-ink-950',
                          )}
                        >
                          {item.label}
                          <ArrowRight className="size-4 text-ink-300" aria-hidden="true" />
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
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
