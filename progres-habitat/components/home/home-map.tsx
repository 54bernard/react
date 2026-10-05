'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapView } from '@/components/map/map-view';
import { LazyMount } from '@/components/ui/lazy-mount';
import type { MapMarker } from '@/components/map/types';
import { cn, formatPrice, formatSurface } from '@/lib/utils';

/** Carte interactive de la page d'accueil, synchronisée avec la liste des terrains. */
export function HomeMap({ markers }: { markers: MapMarker[] }) {
  const [active, setActive] = useState<string | null>(null);
  const available = markers.filter((m) => m.status === 'disponible');

  return (
    <div className="grid overflow-hidden rounded-3xl border border-ink-950/[0.07] bg-white lg:grid-cols-[22rem_1fr]">
      <ul className="max-h-80 divide-y divide-ink-100 overflow-y-auto lg:max-h-[34rem]" aria-label="Terrains sur la carte">
        {available.map((m) => (
          <li key={m.id}>
            <Link
              href={`/terrains/${m.slug}`}
              onMouseEnter={() => setActive(m.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(m.id)}
              onBlur={() => setActive(null)}
              className={cn('block border-l-2 px-5 py-4 transition-colors', active === m.id ? 'border-ink-950 bg-sand-50' : 'border-transparent hover:bg-sand-50')}
            >
              <p className="text-sm font-semibold text-ink-900">{formatPrice(m.price)}</p>
              <p className="mt-0.5 line-clamp-1 text-sm text-ink-600">{m.title}</p>
              <p className="mt-1 text-xs text-ink-400">
                {m.district} · {formatSurface(m.surface)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <LazyMount className="h-[24rem] bg-sand-100 lg:h-[34rem]">
        <MapView markers={available} activeId={active} onActiveChange={setActive} />
      </LazyMount>
    </div>
  );
}
