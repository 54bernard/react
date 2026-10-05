import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ En-tête */
export function AdminPageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-500 transition hover:text-ink-950">
            <ChevronLeft className="size-4" aria-hidden="true" /> {back.label}
          </Link>
        )}
        <h1 className="truncate text-2xl font-semibold tracking-tight text-ink-950 sm:text-[1.75rem]">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ Indicateurs */
export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
  emphasis = false,
}: {
  label: string;
  value: number | string;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  emphasis?: boolean;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className={cn('text-[13px] font-medium', emphasis ? 'text-white/70' : 'text-ink-500')}>{label}</p>
        {icon && (
          <span className={cn('[&_svg]:size-4', emphasis ? 'text-white/60' : 'text-ink-400')} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <p className={cn('mt-4 text-[2rem] leading-none font-semibold tracking-tight tabular-nums', emphasis ? 'text-white' : 'text-ink-950')}>
        {value}
      </p>
      {hint && <p className={cn('mt-2 text-xs', emphasis ? 'text-white/60' : 'text-ink-500')}>{hint}</p>}
    </>
  );
  const cls = cn(
    'block rounded-2xl border p-5 transition',
    emphasis ? 'border-ink-950 bg-ink-950' : 'border-ink-100 bg-white',
    href && !emphasis && 'hover:border-ink-300',
  );
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  flush = false,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <section className={cn('min-w-0 rounded-2xl border border-ink-100 bg-white', className)}>
      <div className="flex items-start justify-between gap-4 px-5 pt-5">
        <div>
          <h2 className="text-[15px] font-semibold text-ink-950">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-ink-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className={flush ? 'mt-4' : 'p-5'}>{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ Barre d'outils */
/** Recherche en GET : conserve les autres paramètres et revient à la page 1. */
export function SearchForm({
  action,
  defaultValue,
  placeholder,
  hidden,
}: {
  action: string;
  defaultValue?: string;
  placeholder: string;
  hidden?: Record<string, string | undefined>;
}) {
  return (
    <form action={action} role="search" className="relative w-full sm:w-72">
      {Object.entries(hidden ?? {}).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
      <label htmlFor="admin-search" className="sr-only">
        {placeholder}
      </label>
      <input
        id="admin-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-ink-200 bg-white pr-3 pl-9 text-sm text-ink-950 transition placeholder:text-ink-400 hover:border-ink-300 focus:border-ink-900 focus:ring-4 focus:ring-ink-900/[0.06] focus:outline-none"
      />
    </form>
  );
}

export function TabLinks({ tabs, label }: { tabs: { href: string; label: string; active: boolean; count?: number }[]; label: string }) {
  return (
    <nav aria-label={label} className="-mx-1 overflow-x-auto px-1">
      <ul className="flex w-max gap-1 rounded-xl bg-ink-100/70 p-1">
        {tabs.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              aria-current={t.active ? 'page' : undefined}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium whitespace-nowrap transition',
                t.active ? 'bg-white text-ink-950 shadow-soft' : 'text-ink-500 hover:text-ink-950',
              )}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={cn('rounded-md px-1.5 text-[11px] tabular-nums', t.active ? 'bg-ink-100 text-ink-700' : 'text-ink-400')}>{t.count}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">{children}</div>;
}

/* ------------------------------------------------------------------ Tableaux */
export function TableCard({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
      <div className="relative overflow-x-auto">{children}</div>
      {footer}
    </div>
  );
}

export const th = 'px-4 py-3 text-left text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-ink-500 uppercase first:pl-5 last:pr-5';
export const td = 'px-4 py-3.5 align-middle first:pl-5 last:pr-5';

/** Pagination par liens (URL partageable, fonctionne sans JavaScript). */
export function AdminPagination({
  page,
  pageCount,
  total,
  pageSize,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  hrefFor: (page: number) => string;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const btn = 'inline-flex h-8 items-center gap-1 rounded-lg border border-ink-200 bg-white px-2.5 text-[13px] font-medium text-ink-700 transition hover:border-ink-400';
  const disabled = 'pointer-events-none opacity-40';
  return (
    <div className="flex flex-col gap-3 border-t border-ink-100 px-5 py-3 text-[13px] text-ink-500 sm:flex-row sm:items-center sm:justify-between">
      <p className="tabular-nums">
        {from}–{to} sur {total}
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-2">
        <Link href={hrefFor(page - 1)} aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined} className={cn(btn, page <= 1 && disabled)}>
          <ChevronLeft className="size-4" aria-hidden="true" /> Précédent
        </Link>
        <span className="px-1 tabular-nums">
          Page {page} / {pageCount}
        </span>
        <Link
          href={hrefFor(page + 1)}
          aria-disabled={page >= pageCount}
          tabIndex={page >= pageCount ? -1 : undefined}
          className={cn(btn, page >= pageCount && disabled)}
        >
          Suivant <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </nav>
    </div>
  );
}

/** Construit une URL de liste en conservant les paramètres non vides. */
export function listHref(base: string, params: Record<string, string | number | undefined | null>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '' || (k === 'page' && Number(v) <= 1)) return;
    sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export function pageParam(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/* ------------------------------------------------------------------ Chargement */
export function AdminSkeleton({ rows = 8, stats = false }: { rows?: number; stats?: boolean }) {
  return (
    <div aria-busy="true" aria-label="Chargement">
      <div className="mb-8 space-y-2">
        <div className="skeleton h-8 w-56 rounded-lg" />
        <div className="skeleton h-4 w-80 max-w-full rounded" />
      </div>
      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      )}
      <div className="mb-5 flex gap-3">
        <div className="skeleton h-10 w-72 rounded-xl" />
        <div className="skeleton h-10 w-40 rounded-xl" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-ink-100 px-5 py-4 last:border-0">
            <div className="skeleton size-11 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-1/2 rounded" />
              <div className="skeleton h-3 w-1/3 rounded" />
            </div>
            <div className="skeleton hidden h-6 w-20 rounded-full sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
