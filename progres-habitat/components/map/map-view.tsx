'use client';

import dynamic from 'next/dynamic';
import { MapPinned } from 'lucide-react';
import type { MapViewProps } from '@/components/map/types';
import { publicEnv } from '@/lib/env';
import { cn } from '@/lib/utils';

function MapLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-sand-100 text-ink-400">
      <MapPinned className="size-8 animate-pulse" aria-hidden="true" />
      <span className="text-sm">Chargement de la carte…</span>
    </div>
  );
}

// Les bibliothèques de cartographie ne sont chargées que côté navigateur, à la demande (code splitting).
const GoogleMapView = dynamic(() => import('@/components/map/google-map'), { ssr: false, loading: MapLoading });
const LeafletMap = dynamic(() => import('@/components/map/leaflet-map'), { ssr: false, loading: MapLoading });

/** Carte interactive : Google Maps si une clé est configurée, sinon OpenStreetMap (sans clé). */
export function MapView(props: MapViewProps) {
  if (props.markers.length === 0) {
    return (
      <div className={cn('flex h-full w-full items-center justify-center bg-sand-100 text-sm text-ink-500', props.className)}>
        Aucun terrain à afficher sur la carte.
      </div>
    );
  }
  return publicEnv.googleMapsKey ? <GoogleMapView {...props} /> : <LeafletMap {...props} />;
}
