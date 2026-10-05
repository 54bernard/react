import Link from 'next/link';
import { ArrowUpRight, CalendarClock, FileCheck2, MapPin, Maximize2 } from 'lucide-react';
import { FavoriteButton } from '@/components/property/favorite-button';
import { PropertyImage } from '@/components/property/property-image';
import { StatusBadge } from '@/components/property/status-badge';
import { Badge } from '@/components/ui/badge';
import { legalShortLabels, typeLabels } from '@/lib/labels';
import { cn, formatPrice, formatSurface } from '@/lib/utils';
import type { PropertyWithRelations } from '@/types';

interface Props {
  property: PropertyWithRelations;
  layout?: 'grid' | 'list';
  priority?: boolean;
  className?: string;
}

export function PropertyCard({ property: p, layout = 'grid', priority = false, className }: Props) {
  const image = p.images[0];
  const installments = p.payment_options.includes('echelonne');
  const unavailable = p.status !== 'disponible';
  const href = `/terrains/${p.slug}`;

  return (
    <article
      className={cn(
        'group relative flex overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift',
        layout === 'grid' ? 'flex-col' : 'flex-col sm:flex-row',
        className,
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-sand-100',
          layout === 'grid' ? 'aspect-[4/3]' : 'aspect-[4/3] sm:aspect-auto sm:w-[42%] sm:shrink-0',
        )}
      >
        <PropertyImage
          src={image?.url}
          alt={image?.alt ?? p.title}
          fill
          priority={priority}
          sizes={layout === 'grid' ? '(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw' : '(min-width: 640px) 40vw, 100vw'}
          className={cn(
            'object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]',
            unavailable && 'grayscale-[35%]',
          )}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-950/25 to-transparent" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <StatusBadge status={p.status} className="bg-white/95 ring-0 shadow-soft" />
          {installments && p.status === 'disponible' && (
            <Badge variant="solid">
              <CalendarClock aria-hidden="true" /> Échelonné
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton propertyId={p.id} title={p.title} />
        </div>
        <span className="absolute bottom-3 left-4 rounded-md bg-ink-950/60 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur">
          Réf. {p.reference}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex items-center gap-1.5 text-sm text-ink-500">
          <MapPin className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
          <span className="truncate">
            {p.district}, {p.city}
          </span>
        </p>
        <h3 className="mt-2 line-clamp-2 text-lg leading-snug font-semibold text-ink-900">
          <Link href={href} className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none">
            {p.title}
          </Link>
        </h3>

        {layout === 'list' && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-500">{p.description}</p>}

        <dl className="mt-4 mb-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600">
          <div>
            <dt className="sr-only">Superficie</dt>
            <dd className="flex items-center gap-1.5 font-medium text-ink-800">
              <Maximize2 className="size-4 text-ink-400" aria-hidden="true" />
              {formatSurface(p.surface)}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Document</dt>
            <dd className="flex items-center gap-1.5">
              <FileCheck2 className="size-4 text-ink-400" aria-hidden="true" />
              {legalShortLabels[p.legal_status]}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Type</dt>
            <dd className="rounded-md bg-sand-100 px-2 py-0.5 text-xs font-medium text-ink-600">{typeLabels[p.type]}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-ink-100 pt-5">
          <div>
            <p className="text-xs font-medium text-ink-400">{p.status === 'vendu' ? 'Vendu' : 'Prix'}</p>
            <p className={cn('text-xl font-semibold tracking-tight text-ink-900', p.status === 'vendu' && 'text-ink-400 line-through decoration-1')}>
              {formatPrice(p.price)}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-full border border-ink-200 text-ink-700 transition-all duration-300 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white"
          >
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton({ layout = 'grid' }: { layout?: 'grid' | 'list' }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-3xl border border-ink-100 bg-white',
        layout === 'list' && 'sm:flex',
      )}
    >
      <div className={cn('skeleton aspect-[4/3]', layout === 'list' && 'sm:aspect-auto sm:w-[42%]')} />
      <div className="flex-1 space-y-3 p-6">
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-5 w-5/6 rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton mt-6 h-7 w-1/3 rounded" />
      </div>
    </div>
  );
}
