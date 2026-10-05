'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, LayoutGrid, List, Map as MapIcon, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/form-controls';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { paymentLabels, statusLabels, typeLabels } from '@/lib/labels';
import { cn, formatNumber } from '@/lib/utils';
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
export function CatalogProvider({ filters, view, children }: { filters: PropertyFilters; view: ViewMode; children: React.ReactNode }) {
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
    <div aria-busy={pending} className={cn('transition-opacity duration-300', pending && 'pointer-events-none opacity-40')}>
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
  useEffect(() => () => clearTimeout(timer.current), []);

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
        className="h-10 pr-12 text-sm"
      />
      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-ink-400">{suffix}</span>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-ink-950/[0.07] py-6 first:pt-0 last:border-0">
      <legend className="mb-4 text-[12px] font-semibold tracking-[0.1em] text-ink-500 uppercase">{title}</legend>
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
              'h-9 cursor-pointer rounded-full border px-3.5 text-[13px] font-medium transition-colors duration-200',
              active ? 'border-ink-950 bg-ink-950 text-white' : 'border-ink-200 bg-white text-ink-700 hover:border-ink-950',
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
  useEffect(() => () => clearTimeout(timer.current), []);

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
            placeholder="Quartier, référence…"
            className="h-10 pl-10 text-sm"
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
            <Label htmlFor="f-ville" className="text-[13px] font-normal text-ink-600">
              Ville
            </Label>
            <Select id="f-ville" className="h-10 text-sm" value={filters.ville ?? ''} onChange={(e) => update({ ville: e.target.value || undefined, quartier: undefined })}>
              <option value="">Toutes les villes</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="f-quartier" className="text-[13px] font-normal text-ink-600">
              Quartier
            </Label>
            <Select id="f-quartier" className="h-10 text-sm" value={filters.quartier ?? ''} onChange={(e) => update({ quartier: e.target.value || undefined })}>
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

      <FilterGroup title="Prix">
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

      <FilterGroup title="Paiement">
        <Chips name="Mode de paiement" options={PAYMENT_OPTIONS} labels={paymentLabels} value={filters.paiement} onChange={(v) => update({ paiement: v })} />
      </FilterGroup>

      {countActiveFilters(filters) > 0 && (
        <button type="button" onClick={reset} className="mt-2 cursor-pointer text-sm font-medium text-ink-950 underline decoration-ink-300 underline-offset-4 hover:decoration-ink-950">
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}

/** Filtres actifs sous forme de puces supprimables. */
export function ActiveFilters({ zones }: { zones: { slug: string; name: string }[] }) {
  const { filters, update, reset } = useCatalog();
  const chips: { key: string; label: string; clear: Partial<PropertyFilters> }[] = [];
  if (filters.q) chips.push({ key: 'q', label: `« ${filters.q} »`, clear: { q: undefined } });
  if (filters.zone) chips.push({ key: 'zone', label: zones.find((z) => z.slug === filters.zone)?.name ?? filters.zone, clear: { zone: undefined } });
  if (filters.ville) chips.push({ key: 'ville', label: filters.ville, clear: { ville: undefined } });
  if (filters.quartier) chips.push({ key: 'quartier', label: filters.quartier, clear: { quartier: undefined } });
  if (filters.minPrice !== undefined) chips.push({ key: 'minPrice', label: `Dès ${formatNumber(filters.minPrice)} FCFA`, clear: { minPrice: undefined } });
  if (filters.maxPrice !== undefined) chips.push({ key: 'maxPrice', label: `Jusqu’à ${formatNumber(filters.maxPrice)} FCFA`, clear: { maxPrice: undefined } });
  if (filters.minSurface !== undefined) chips.push({ key: 'minSurface', label: `Dès ${formatNumber(filters.minSurface)} m²`, clear: { minSurface: undefined } });
  if (filters.maxSurface !== undefined) chips.push({ key: 'maxSurface', label: `Jusqu’à ${formatNumber(filters.maxSurface)} m²`, clear: { maxSurface: undefined } });
  if (filters.type) chips.push({ key: 'type', label: typeLabels[filters.type], clear: { type: undefined } });
  if (filters.statut) chips.push({ key: 'statut', label: statusLabels[filters.statut], clear: { statut: undefined } });
  if (filters.paiement) chips.push({ key: 'paiement', label: paymentLabels[filters.paiement], clear: { paiement: undefined } });
  if (chips.length === 0) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2" aria-label="Filtres actifs">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => update(c.clear)}
          className="group inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-ink-950/[0.05] pr-2 pl-3 text-[13px] font-medium text-ink-800 transition-colors hover:bg-ink-950/10"
          aria-label={`Retirer le filtre ${c.label}`}
        >
          {c.label}
          <X className="size-3.5 text-ink-500 group-hover:text-ink-950" aria-hidden="true" />
        </button>
      ))}
      {chips.length > 1 && (
        <button type="button" onClick={reset} className="ml-1 cursor-pointer text-[13px] font-medium text-ink-500 underline-offset-4 hover:text-ink-950 hover:underline">
          Tout effacer
        </button>
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
        <Button variant="outline" size="sm" className={cn('h-10', !alwaysVisible && 'lg:hidden')}>
          <SlidersHorizontal /> Filtres
          {active > 0 && <span className="grid size-5 place-items-center rounded-full bg-ink-950 text-[11px] text-white">{active}</span>}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" title="Filtrer les terrains">
        <div className="px-5 py-6">
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
  'surface-desc': 'Surface décroissante',
  'surface-asc': 'Surface croissante',
};

export function SortSelect() {
  const { filters, update } = useCatalog();
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort" className="sr-only mb-0 text-sm whitespace-nowrap text-ink-500">
        Trier par
      </Label>
      <Select id="sort" value={filters.sort ?? 'recent'} onChange={(e) => update({ sort: e.target.value as SortOption })} className="h-10 min-w-44 rounded-full pl-4 text-sm">
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
    <div role="radiogroup" aria-label="Mode d’affichage" className="inline-flex h-10 rounded-full border border-ink-200 bg-white p-1">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={view === value}
          aria-label={label}
          onClick={() => update({ vue: value }, { resetPage: false })}
          className={cn(
            'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors duration-200',
            view === value ? 'bg-ink-950 text-white' : 'text-ink-600 hover:text-ink-950',
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const { update } = useCatalog();
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter((p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1);
  const go = (p: number) => {
    update({ page: p }, { resetPage: false });
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const arrow = 'grid size-10 cursor-pointer place-items-center rounded-full border border-ink-200 text-ink-800 transition-colors hover:border-ink-950 disabled:pointer-events-none disabled:opacity-35';
  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
      <button type="button" className={arrow} disabled={page <= 1} onClick={() => go(page - 1)} aria-label="Page précédente">
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && pages[i - 1]! < p - 1 && <span className="px-1 text-ink-400">…</span>}
          <button
            type="button"
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${p}`}
            className={cn(
              'grid size-10 cursor-pointer place-items-center rounded-full text-sm font-medium tabular-nums transition-colors',
              p === page ? 'bg-ink-950 text-white' : 'text-ink-700 hover:bg-ink-950/5',
            )}
          >
            {p}
          </button>
        </span>
      ))}
      <button type="button" className={arrow} disabled={page >= pageCount} onClick={() => go(page + 1)} aria-label="Page suivante">
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
