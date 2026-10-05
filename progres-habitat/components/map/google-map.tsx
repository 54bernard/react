'use client';

import { useEffect, useState } from 'react';
import { AdvancedMarker, APIProvider, InfoWindow, Map, useMap } from '@vis.gl/react-google-maps';
import { MarkerPopup } from '@/components/map/marker-popup';
import type { MapMarker, MapViewProps } from '@/components/map/types';
import { publicEnv } from '@/lib/env';
import { siteConfig } from '@/lib/site-config';
import { cn, formatPriceShort } from '@/lib/utils';

function FitBounds({ markers, singleZoom }: { markers: MapMarker[]; singleZoom: number }) {
  const map = useMap();
  const key = markers.map((m) => m.id).join(',');
  useEffect(() => {
    if (!map || markers.length === 0) return;
    if (markers.length === 1) {
      const only = markers[0]!;
      map.setCenter({ lat: only.latitude, lng: only.longitude });
      map.setZoom(singleZoom);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    markers.forEach((m) => bounds.extend({ lat: m.latitude, lng: m.longitude }));
    map.fitBounds(bounds, 56);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key, singleZoom]);
  return null;
}

export default function GoogleMapView({
  markers,
  activeId,
  onActiveChange,
  singleZoom = 15,
  className,
  interactivePopups = true,
}: MapViewProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = markers.find((m) => m.id === openId);

  return (
    <APIProvider apiKey={publicEnv.googleMapsKey} language="fr" region="BF">
      <Map
        className={cn('h-full w-full', className)}
        mapId={publicEnv.googleMapsMapId || 'DEMO_MAP_ID'}
        defaultCenter={{ lat: siteConfig.mapCenter.latitude, lng: siteConfig.mapCenter.longitude }}
        defaultZoom={11}
        gestureHandling="cooperative"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        clickableIcons={false}
      >
        <FitBounds markers={markers} singleZoom={singleZoom} />
        {markers.map((m) => {
          const active = activeId === m.id || openId === m.id;
          const bg = active ? '#f07a0a' : m.status !== 'disponible' ? '#7d8c91' : '#176b5a';
          return (
            <AdvancedMarker
              key={m.id}
              position={{ lat: m.latitude, lng: m.longitude }}
              title={`${m.title} — ${formatPriceShort(m.price)} FCFA`}
              zIndex={active ? 1000 : undefined}
              onClick={() => interactivePopups && setOpenId(m.id)}
              onMouseEnter={() => onActiveChange?.(m.id)}
              onMouseLeave={() => onActiveChange?.(null)}
            >
              <span
                className="block rounded-full px-2.5 py-1.5 text-xs font-semibold text-white shadow-lift transition-transform"
                style={{ background: bg, transform: active ? 'scale(1.12)' : undefined }}
              >
                {formatPriceShort(m.price)}
              </span>
            </AdvancedMarker>
          );
        })}
        {open && (
          <InfoWindow
            position={{ lat: open.latitude, lng: open.longitude }}
            pixelOffset={[0, -36]}
            onCloseClick={() => setOpenId(null)}
            headerDisabled
          >
            <MarkerPopup marker={open} />
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
