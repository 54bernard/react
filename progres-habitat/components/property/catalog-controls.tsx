'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, List, Map as MapIcon, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/form-controls';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { paymentLabels, statusLabels, typeLabels } from '@/lib/labels';
import { cn } from '@/lib/utils';
import { countActiveFilters, filtersToSearchParams } from '@/schemas/filters';
import {
  PAYMENT_OPTIONS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type PropertyFilters,
  type SortOption,
  type ViewMode,
} from '@/types';

interface CatalogState {
  filters: PropertyFilters;
  view: ViewMode;
  pending: boolean;
  update: (patch: Partial<PropertyFilters> & { vue?: ViewMode }, options?: { resetPage?: boolean }) => void;
  reset: () => void;
}

const CatalogContext = createContext<CatalogState | null>(null);

function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog doit être utilisé dans <CatalogProvider>.');
  return ctx;
}

/** Synchronise les filtres avec l'URL (/terrains?ville=…&minPrice=…). */
export function CatalogProvider({
  filters,
  view,
  children,
}: {
  filters: PropertyFilters;
  view: ViewMode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const update = useCallback<CatalogState['update']>(
    (patch, options = { resetPage: true }) => {
      const next = { ...filters, vue: view, ...patch };
      if (options.resetPage && !('page' in patch)) next.page = 1;
      const qs = filtersToSearchParams(next).toString();
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [filters, view, pathname, router],
  );

  const reset = useCallback(() => {
    const qs = view !== 'grille' ? `?vue=${view}` : '';
    startTransition(() => router.push(`${pathname}${qs}`, { scroll: false }));
  }, [pathname, router, view]);

  return <CatalogContext.Provider value={{ filters, view, pending, update, reset }}>{children}</CatalogContext.Provider>;
}

export function PendingOverlay({ children }: { children: React.ReactNode }) {
  const { pending } = useCatalog();
  return (
    <div aria-busy={pending} className={cn('transition-opacity duration-200', pending && 'pointer-events-none opacity-50')}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ Filtres */
function NumberField({
  id,
  label,
  value,
  onCommit,
  placeholder,
  suffix,
}: {
  id: string;
  label: string;
  value?: number;
  onCommit: (v: number | undefined) => void;
  placeholder: string;
  suffix: string;
}) {
  const [text, setText] = useState(value !== undefined ? String(value) : '');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => setText(value !== undefined ? String(value) : ''), [value]);

  const commit = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    onCommit(digits ? Number(digits) : undefined);
  };

  return (
    <div className="relative">
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <Input
        id={id}
        inputMode="numeric"
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          const v = e.target.value;
          setText(v);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => commit(v), 700);
        }}
        onBlur={(e) => {
          clearTimeout(timer.current);
          if ((value !== undefined ? String(value) : '') !== e.target.value.replace(/\D/g, '')) commit(e.target.value);
        }}
        className="pr-14"
      />
      <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs text-ink-400">{suffix}</span>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-ink-100 py-5 first:pt-0 last:border-0">
      <legend className="mb-3 text-sm font-semibold text-ink-900">{title}</legend>
      {children}
    </fieldset>
  );
}

function Chips<T extends string>({
  name,
  options,
  value,
  labels,
  onChange,
}: {
  name: string;
  options: readonly T[];
  value?: T;
  labels: Record<T, string>;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {[undefined, ...options].map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt ?? 'tous'}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={cn(
              'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
              active ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400',
            )}
          >
            {opt ? labels[opt] : 'Tous'}
          </button>
        );
      })}
    </div>
  );
}

export function FiltersForm({ cities, districts }: { cities: string[]; districts: string[] }) {
  const { filters, update, reset } = useCatalog();
  const [q, setQ] = useState(filters.q ?? '');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => setQ(filters.q ?? ''), [filters.q]);

  return (
    <div>
      <FilterGroup title="Recherche">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <Label htmlFor="f-q" className="sr-only">
            Mot-clé, quartier ou référence
          </Label>
          <Input
            id="f-q"
            type="search"
            value={q}
            placeholder="Quartier, référence, mot-clé…"
            className="pl-10"
            onChange={(e) => {
              const v = e.target.value;
              setQ(v);
              clearTimeout(timer.current);
              timer.current = setTimeout(() => update({ q: v.trim() || undefined }), 450);
            }}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Localisation">
        <div className="space-y-3">
          <div>
            <Label htmlFor="f-ville" className="text-xs text-ink-500">
              Ville
            </Label>
            <Select id="f-ville" value={filters.ville ?? ''} onChange={(e) => update({ ville: e.target.value || undefined, quartier: undefined })}>
              <option value="">Toutes les villes</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="f-quartier" className="text-xs text-ink-500">
              Quartier
            </Label>
            <Select id="f-quartier" value={filters.quartier ?? ''} onChange={(e) => update({ quartier: e.target.value || undefined })}>
              <option value="">Tous les quartiers</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Prix (FCFA)">
        <div className="grid grid-cols-2 gap-2">
          <NumberField id="f-minp" label="Prix minimum" placeholder="Min" suffix="FCFA" value={filters.minPrice} onCommit={(v) => update({ minPrice: v })} />
          <NumberField id="f-maxp" label="Prix maximum" placeholder="Max" suffix="FCFA" value={filters.maxPrice} onCommit={(v) => update({ maxPrice: v })} />
        </div>
      </FilterGroup>

      <FilterGroup title="Superficie">
        <div className="grid grid-cols-2 gap-2">
          <NumberField id="f-mins" label="Surface minimum" placeholder="Min" suffix="m²" value={filters.minSurface} onCommit={(v) => update({ minSurface: v })} />
          <NumberField id="f-maxs" label="Surface maximum" placeholder="Max" suffix="m²" value={filters.maxSurface} onCommit={(v) => update({ maxSurface: v })} />
        </div>
      </FilterGroup>

      <FilterGroup title="Type de terrain">
        <Chips name="Type de terrain" options={PROPERTY_TYPES} labels={typeLabels} value={filters.type} onChange={(v) => update({ type: v })} />
      </FilterGroup>

      <FilterGroup title="Disponibilité">
        <Chips name="Statut" options={PROPERTY_STATUSES} labels={statusLabels} value={filters.statut} onChange={(v) => update({ statut: v })} />
      </FilterGroup>

      <FilterGroup title="Mode de paiement">
        <Chips name="Mode de paiement" options={PAYMENT_OPTIONS} labels={paymentLabels} value={filters.paiement} onChange={(v) => update({ paiement: v })} />
      </FilterGroup>

      {countActiveFilters(filters) > 0 && (
        <Button type="button" variant="ghost" size="sm" onClick={reset} className="mt-4">
          <RotateCcw /> Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
}

export function MobileFilters({
  cities,
  districts,
  total,
  alwaysVisible = false,
}: {
  cities: string[];
  districts: string[];
  total: number;
  alwaysVisible?: boolean;
}) {
  const { filters } = useCatalog();
  const active = countActiveFilters(filters);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className={cn(!alwaysVisible && 'lg:hidden')}>
          <SlidersHorizontal /> Filtres
          {active > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[11px] text-white">{active}</span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" title="Filtrer les terrains">
        <div className="px-5 py-5">
          <FiltersForm cities={cities} districts={districts} />
        </div>
        <div className="sticky bottom-0 border-t border-ink-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <SheetClose asChild>
            <Button size="lg" className="w-full">
              Voir {total} résultat{total > 1 ? 's' : ''}
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------------------ Tri & vues */
const sortLabels: Record<SortOption, string> = {
  recent: 'Plus récents',
  'prix-asc': 'Prix croissant',
  'prix-desc': 'Prix décroissant',
  'surface-desc': 'Surface (plus grande)',
  'surface-asc': 'Surface (plus petite)',
};

export function SortSelect() {
  const { filters, update } = useCatalog();
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort" className="sr-only mb-0 text-sm whitespace-nowrap text-ink-500 sm:not-sr-only">
        Trier par
      </Label>
      <Select
        id="sort"
        value={filters.sort ?? 'recent'}
        onChange={(e) => update({ sort: e.target.value as SortOption })}
        className="h-10 min-w-44 text-sm"
      >
        {(Object.keys(sortLabels) as SortOption[]).map((s) => (
          <option key={s} value={s}>
            {sortLabels[s]}
          </option>
        ))}
      </Select>
    </div>
  );
}

export function ViewToggle() {
  const { view, update } = useCatalog();
  const options: { value: ViewMode; label: string; Icon: typeof LayoutGrid }[] = [
    { value: 'grille', label: 'Grille', Icon: LayoutGrid },
    { value: 'liste', label: 'Liste', Icon: List },
    { value: 'carte', label: 'Carte', Icon: MapIcon },
  ];
  return (
    <div role="radiogroup" aria-label="Mode d’affichage" className="inline-flex rounded-xl border border-ink-200 bg-white p-1">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={view === value}
          onClick={() => update({ vue: value }, { resetPage: false })}
          className={cn(
            'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition',
            view === value ? 'bg-ink-900 text-white' : 'text-ink-600 hover:text-ink-900',
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{label}</span>
          <span className="sr-only sm:hidden">{label}</span>
        </button>
      ))}
    </div>
  );
}

export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const { update } = useCatalog();
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );
  const go = (p: number) => {
    update({ page: p }, { resetPage: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => go(page - 1)}>
        Précédent
      </Button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1]! < p - 1 && <span className="px-1 text-ink-400">…</span>}
          <button
            type="button"
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'grid size-9 cursor-pointer place-items-center rounded-lg text-sm font-medium transition',
              p === page ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-100',
            )}
          >
            {p}
          </button>
        </span>
      ))}
      <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => go(page + 1)}>
        Suivant
      </Button>
    </nav>
  );
}
