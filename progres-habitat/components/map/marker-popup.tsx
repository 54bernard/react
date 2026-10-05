import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { statusLabels } from '@/lib/labels';
import { formatPrice, formatSurface } from '@/lib/utils';
import type { MapMarker } from '@/components/map/types';

/** Contenu de l'info-bulle d'un marqueur : photo, prix, surface, localisation, lien. */
export function MarkerPopup({ marker }: { marker: MapMarker }) {
  return (
    <div className="w-60 font-sans">
      <div className="relative aspect-[16/10] bg-sand-100">
        {marker.image && (
          <Image src={marker.image} alt={marker.title} fill sizes="240px" className="object-cover" />
        )}
        {marker.status !== 'disponible' && (
          <span className="absolute top-2 left-2 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ink-800">
            {statusLabels[marker.status]}
          </span>
        )}
      </div>
      <div className="space-y-1 p-3">
        <p className="text-base font-semibold text-ink-900">{formatPrice(marker.price)}</p>
        <p className="text-xs text-ink-600">{formatSurface(marker.surface)} · Réf. {marker.reference}</p>
        <p className="flex items-center gap-1 text-xs text-ink-500">
          <MapPin className="size-3" aria-hidden="true" /> {marker.district}, {marker.city}
        </p>
        <Link
          href={`/terrains/${marker.slug}`}
          className="mt-2 block rounded-lg bg-brand-600 px-3 py-2 text-center text-xs font-semibold !text-white hover:bg-brand-700"
        >
          Voir les détails
        </Link>
      </div>
    </div>
  );
}
