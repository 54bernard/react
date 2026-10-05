'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  MessageSquareQuote,
  Settings,
  Users,
} from 'lucide-react';
import { signOut } from '@/app/admin/actions';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/terrains', label: 'Terrains', icon: MapPinned },
  { href: '/admin/demandes', label: 'Demandes clients', icon: Users },
  { href: '/admin/rendez-vous', label: 'Rendez-vous', icon: CalendarDays },
  { href: '/admin/temoignages', label: 'Témoignages', icon: MessageSquareQuote },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
];

function NavLinks({ onNavigate, badges }: { onNavigate?: boolean; badges: Record<string, number> }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {nav.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        const link = (
          <Link
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              active ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-600 hover:bg-white/70 hover:text-ink-900',
            )}
          >
            <Icon className={cn('size-[18px]', active ? 'text-brand-600' : 'text-ink-400')} aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {badges[href] ? (
              <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[11px] font-bold text-white">{badges[href]}</span>
            ) : null}
          </Link>
        );
        return <li key={href}>{onNavigate ? <SheetClose asChild>{link}</SheetClose> : link}</li>;
      })}
    </ul>
  );
}

export function AdminShell({
  children,
  email,
  isDemo,
  badges,
}: {
  children: React.ReactNode;
  email: string | null;
  isDemo: boolean;
  badges: Record<string, number>;
}) {
  const footer = (
    <div className="space-y-1 border-t border-ink-200/70 pt-4">
      <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-white/70">
        <ExternalLink className="size-[18px] text-ink-400" aria-hidden="true" /> Voir le site
      </Link>
      {!isDemo && (
        <form action={signOut}>
          <button type="submit" className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-white/70">
            <LogOut className="size-[18px] text-ink-400" aria-hidden="true" /> Se déconnecter
          </button>
        </form>
      )}
      <p className="truncate px-3 pt-2 text-xs text-ink-400">{isDemo ? 'Mode démonstration' : email}</p>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 border-r border-ink-200/70 bg-ink-50 p-5 lg:flex">
        <Link href="/admin" className="px-2">
          <Image src="/logo.png" alt="Progrès Habitat" width={570} height={245} className="h-10 w-auto" />
        </Link>
        <nav aria-label="Administration" className="flex-1">
          <NavLinks badges={badges} />
        </nav>
        {footer}
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-200/70 bg-white/90 px-4 backdrop-blur lg:hidden">
          <Image src="/logo.png" alt="Progrès Habitat" width={570} height={245} className="h-9 w-auto" />
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" aria-label="Ouvrir le menu" className="grid size-10 cursor-pointer place-items-center rounded-full hover:bg-ink-100">
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" title="Administration">
              <div className="flex h-full flex-col gap-6 p-4">
                <nav aria-label="Administration (mobile)" className="flex-1">
                  <NavLinks onNavigate badges={badges} />
                </nav>
                {footer}
              </div>
            </SheetContent>
          </Sheet>
        </header>
        {isDemo && (
          <p className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-900">
            Mode démonstration — consultation uniquement. Configurez Supabase pour ajouter, modifier ou supprimer des données.
          </p>
        )}
        <main id="contenu" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
