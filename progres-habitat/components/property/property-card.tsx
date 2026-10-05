import Link from 'next/link';
import { FavoriteButton } from '@/components/property/favorite-button';
import { PropertyImage } from '@/components/property/property-image';
import { legalShortLabels, statusLabels, typeLabels } from '@/lib/labels';
import { cn, formatPrice, formatSurface } from '@/lib/utils';
import type { PropertyWithRelations } from '@/types';

interface Props {
  property: PropertyWithRelations;
  layout?: 'grid' | 'list';
  priority?: boolean;
  className?: string;
}

const statusChip = {
  disponible: 'bg-white/95 text-ink-950',
  reserve: 'bg-amber-100/95 text-amber-950',
  vendu: 'bg-ink-950/85 text-white',
} as const;

/** Carte de terrain : visuel généreux, informations hiérarchisées sous l'image, survol discret. */
export function PropertyCard({ property: p, layout = 'grid', priority = false, className }: Props) {
  const image = p.images[0];
  const installments = p.payment_options.includes('echelonne') && p.status === 'disponible';
  const href = `/terrains/${p.slug}`;
  const meta = [formatSurface(p.surface), legalShortLabels[p.legal_status], typeLabels[p.type]];

  return (
    <article className={cn('group relative flex', layout === 'grid' ? 'flex-col' : 'flex-col gap-5 sm:flex-row sm:gap-8', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl bg-sand-100',
          layout === 'grid' ? 'aspect-[4/3]' : 'aspect-[4/3] sm:w-[44%] sm:shrink-0',
        )}
      >
        <PropertyImage
          src={image?.url}
          alt={image?.alt ?? p.title}
          fill
          priority={priority}
          sizes={layout === 'grid' ? '(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw' : '(min-width: 640px) 40vw, 100vw'}
          className={cn(
            'object-cover transition-transform duration-[900ms] ease-[var(--ease-premium)] group-hover:scale-[1.035]',
            p.status === 'vendu' && 'grayscale-[40%]',
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/25 via-transparent to-transparent opacity-80" />
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
          <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide backdrop-blur', statusChip[p.status])}>
            {statusLabels[p.status]}
          </span>
          {installments && (
            <span className="rounded-full bg-ink-950/55 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur">
              Paiement échelonné
            </span>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5 z-10">
          <FavoriteButton propertyId={p.id} title={p.title} />
        </div>
      </div>

      <div className={cn('flex flex-1 flex-col', layout === 'grid' ? 'pt-5' : 'sm:py-2')}>
        <p className="text-[12px] font-medium tracking-[0.06em] text-ink-500 uppercase">
          {p.district} · {p.city}
        </p>
        <h3 className="mt-2 line-clamp-2 text-[17px] leading-snug font-semibold tracking-[-0.01em] text-ink-950">
          <Link
            href={href}
            className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-[var(--ease-premium)] group-hover:bg-[length:100%_1px] after:absolute after:inset-0 after:z-0 focus-visible:outline-none"
          >
            {p.title}
          </Link>
        </h3>
        {layout === 'list' && <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-ink-500">{p.description}</p>}
        <p className="mt-2.5 text-sm text-ink-500">
          {meta.map((m, i) => (
            <span key={m}>
              {i > 0 && (
                <span className="mx-2 text-ink-300" aria-hidden="true">
                  ·
                </span>
              )}
              {m}
            </span>
          ))}
        </p>
        <div className={cn('flex items-baseline justify-between gap-3', layout === 'grid' ? 'mt-4' : 'mt-auto pt-5')}>
          <p className={cn('text-lg font-semibold tracking-[-0.01em] tabular-nums', p.status === 'vendu' ? 'text-ink-400 line-through decoration-1' : 'text-ink-950')}>
            {formatPrice(p.price)}
          </p>
          <span className="text-xs text-ink-400">Réf. {p.reference}</span>
        </div>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton({ layout = 'grid' }: { layout?: 'grid' | 'list' }) {
  return (
    <div className={cn(layout === 'list' && 'sm:flex sm:gap-8')}>
      <div className={cn('skeleton aspect-[4/3] rounded-2xl', layout === 'list' && 'sm:w-[44%]')} />
      <div className="flex-1 space-y-3 pt-5">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-5 w-5/6 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton mt-4 h-6 w-1/3 rounded" />
      </div>
    </div>
  );
}
