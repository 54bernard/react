import { statusLabels } from '@/lib/labels';
import { cn } from '@/lib/utils';
import type { PropertyStatus } from '@/types';

const dot: Record<PropertyStatus, string> = {
  disponible: 'bg-emerald-500',
  reserve: 'bg-amber-500',
  vendu: 'bg-red-500',
};

/** Statut commercial : pastille colorée + libellé (jamais la couleur seule). */
export function StatusBadge({ status, className }: { status: PropertyStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] leading-none font-semibold tracking-wide whitespace-nowrap text-ink-800',
        className,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', dot[status])} />
      {statusLabels[status]}
    </span>
  );
}
