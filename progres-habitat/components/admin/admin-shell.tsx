'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import {
  CalendarDays,
  ExternalLink,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MapPin,
  MapPinned,
  Menu,
  MessageSquareQuote,
  Plus,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { signOut } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { ConfirmProvider } from '@/components/ui/confirm-dialog';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const groups = [
  {
    label: 'Pilotage',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true }],
  },
  {
    label: 'Catalogue',
    items: [
      { href: '/admin/terrains', label: 'Terrains', icon: MapPinned },
      { href: '/admin/localisations', label: 'Localisations', icon: MapPin },
    ],
  },
  {
    label: 'Relation client',
    items: [
      { href: '/admin/clients', label: 'Clients', icon: Users, badge: 'newLeads' as const },
      { href: '/admin/visites', label: 'Demandes de visite', icon: CalendarDays, badge: 'pendingVisits' as const },
      { href: '/admin/temoignages', label: 'Témoignages', icon: MessageSquareQuote },
    ],
  },
  {
    label: 'Contenu & réglages',
    items: [
      { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
      { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: ShieldCheck },
      { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
    ],
  },
];

type Badges = { newLeads: number; pendingVisits: number };

function NavLinks({ inSheet, badges }: { inSheet?: boolean; badges: Badges }) {
  const pathname = usePathname();
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-[0.1em] text-ink-400 uppercase">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map(({ href, label, icon: Icon, ...rest }) => {
              const active = 'exact' in rest && rest.exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
              const count = 'badge' in rest && rest.badge ? badges[rest.badge] : 0;
              const link = (
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group flex h-9 items-center gap-3 rounded-lg px-3 text-[13.5px] font-medium transition-colors',
                    active ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-950',
                  )}
                >
                  <Icon className={cn('size-4', active ? 'text-white' : 'text-ink-400 group-hover:text-ink-700')} aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {count > 0 && (
                    <span
                      className={cn(
                        'min-w-5 rounded-full px-1.5 text-center text-[11px] leading-5 font-semibold tabular-nums',
                        active ? 'bg-white/15 text-white' : 'bg-accent-100 text-accent-700',
                      )}
                      aria-label={`${count} en attente`}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
              return <li key={href}>{inSheet ? <SheetClose asChild>{link}</SheetClose> : link}</li>;
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function UserMenu({ email, isDemo, role }: { email: string | null; isDemo: boolean; role: string }) {
  const initial = (email ?? 'A').charAt(0).toUpperCase();
  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition hover:bg-ink-100"
        aria-label="Menu du compte"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">{initial}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-ink-950">{isDemo ? 'Mode démonstration' : email}</span>
          <span className="block text-xs text-ink-500">{role === 'admin' ? 'Administrateur' : 'Éditeur'}</span>
        </span>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content side="top" align="start" sideOffset={8} className="z-50 w-56 rounded-xl border border-ink-100 bg-white p-1.5 shadow-lift">
          <Dropdown.Item asChild>
            <Link href="/" target="_blank" className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-700 outline-none data-[highlighted]:bg-ink-100">
              <ExternalLink className="size-4" aria-hidden="true" /> Voir le site
            </Link>
          </Dropdown.Item>
          {!isDemo && (
            <Dropdown.Item
              onSelect={() => void signOut()}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-700 outline-none data-[highlighted]:bg-ink-100"
            >
              <LogOut className="size-4" aria-hidden="true" /> Se déconnecter
            </Dropdown.Item>
          )}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

export function AdminShell({
  children,
  email,
  role,
  isDemo,
  badges,
}: {
  children: React.ReactNode;
  email: string | null;
  role: string;
  isDemo: boolean;
  badges: Badges;
}) {
  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5 px-2">
      <Image src="/logo.png" alt="Progrès Habitat" width={570} height={245} className="h-8 w-auto" />
      <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-ink-600 uppercase">Admin</span>
    </Link>
  );

  return (
    <ConfirmProvider>
      <div className="min-h-dvh bg-[#f7f7f5] lg:grid lg:grid-cols-[15.5rem_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col border-r border-ink-200/70 bg-white lg:flex">
          <div className="flex h-16 items-center border-b border-ink-100 px-3">{brand}</div>
          <div className="px-3 pt-4">
            <Button asChild size="sm" className="w-full rounded-lg">
              <Link href="/admin/terrains/nouveau">
                <Plus /> Nouveau terrain
              </Link>
            </Button>
          </div>
          <nav aria-label="Administration" className="flex-1 overflow-y-auto px-3 py-5">
            <NavLinks badges={badges} />
          </nav>
          <div className="border-t border-ink-100 p-3">
            <UserMenu email={email} isDemo={isDemo} role={role} />
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-200/70 bg-white/90 px-4 backdrop-blur lg:hidden">
            {brand}
            <Sheet>
              <SheetTrigger asChild>
                <button type="button" aria-label="Ouvrir le menu" className="grid size-10 cursor-pointer place-items-center rounded-full hover:bg-ink-100">
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" title="Administration">
                <div className="flex h-full flex-col">
                  <div className="p-4">
                    <SheetClose asChild>
                      <Button asChild size="sm" className="w-full rounded-lg">
                        <Link href="/admin/terrains/nouveau">
                          <Plus /> Nouveau terrain
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                  <nav aria-label="Administration (mobile)" className="flex-1 px-3 pb-4">
                    <NavLinks inSheet badges={badges} />
                  </nav>
                  <div className="border-t border-ink-100 p-3">
                    <UserMenu email={email} isDemo={isDemo} role={role} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </header>
          {isDemo && (
            <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-[13px] text-amber-900">
              Mode démonstration — données d’exemple en lecture seule. Configurez Supabase pour gérer vos vraies données.
            </p>
          )}
          <main id="contenu" className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </ConfirmProvider>
  );
}
