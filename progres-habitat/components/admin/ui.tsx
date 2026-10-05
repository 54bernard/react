import { cn } from '@/lib/utils';

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'neutral',
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ReactNode;
  tone?: 'neutral' | 'brand' | 'accent' | 'success' | 'warning' | 'danger';
}) {
  const tones = {
    neutral: 'bg-ink-100 text-ink-700',
    brand: 'bg-brand-50 text-brand-700',
    accent: 'bg-accent-50 text-accent-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
  };
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">{label}</p>
        <span className={cn('grid size-9 place-items-center rounded-xl', tones[tone])}>{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('min-w-0 rounded-2xl border border-ink-100 bg-white shadow-soft', className)}>
      <div className="flex items-center justify-between gap-4 border-b border-ink-100 px-5 py-4">
        <h2 className="font-semibold text-ink-900">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
