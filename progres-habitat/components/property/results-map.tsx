'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapView } from '@/components/map/map-view';
import type { MapMarker } from '@/components/map/types';
import { StatusBadge } from '@/components/property/status-badge';
import { cn, formatPrice, formatSurface } from '@/lib/utils';

/** Vue carte du catalogue : liste et marqueurs synchronisés (survol ⇄ surbrillance). */
export function ResultsMap({ markers }: { markers: MapMarker[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,26rem)_1fr]">
      <ul className="order-2 space-y-3 lg:order-1 lg:max-h-[calc(100dvh-14rem)] lg:overflow-y-auto lg:pr-2" aria-label="Résultats">
        {markers.map((m) => (
          <li key={m.id}>
            <Link
              href={`/terrains/${m.slug}`}
              onMouseEnter={() => setActive(m.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(m.id)}
              onBlur={() => setActive(null)}
              className={cn(
                'flex gap-4 rounded-2xl border bg-white p-3 transition',
                active === m.id ? 'border-brand-400 shadow-soft' : 'border-ink-100 hover:border-ink-200',
              )}
            >
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-sand-100">
                {m.image && <Image src={m.image} alt={m.title} fill sizes="96px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <StatusBadge status={m.status} />
                <p className="mt-2 line-clamp-1 text-sm font-semibold text-ink-900">{m.title}</p>
                <p className="mt-0.5 text-xs text-ink-500">
                  {m.district} · {formatSurface(m.surface)}
                </p>
                <p className="mt-1.5 font-semibold text-ink-900">{formatPrice(m.price)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="order-1 h-[60vh] overflow-hidden rounded-3xl border border-ink-100 lg:sticky lg:top-28 lg:order-2 lg:h-[calc(100dvh-14rem)]">
        <MapView markers={markers} activeId={active} onActiveChange={setActive} />
      </div>
    </div>
  );
}
