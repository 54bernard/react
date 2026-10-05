import { Badge } from '@/components/ui/badge';
import { statusLabels } from '@/lib/labels';
import type { PropertyStatus } from '@/types';

const variants = { disponible: 'success', reserve: 'warning', vendu: 'danger' } as const;

export function StatusBadge({ status, className }: { status: PropertyStatus; className?: string }) {
  return (
    <Badge variant={variants[status]} className={className}>
      <span
        aria-hidden="true"
        className={
          status === 'disponible'
            ? 'size-1.5 rounded-full bg-emerald-500'
            : status === 'reserve'
              ? 'size-1.5 rounded-full bg-amber-500'
              : 'size-1.5 rounded-full bg-red-500'
        }
      />
      {statusLabels[status]}
    </Badge>
  );
}
