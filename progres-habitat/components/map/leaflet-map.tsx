'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { MarkerPopup } from '@/components/map/marker-popup';
import type { MapMarker, MapViewProps } from '@/components/map/types';
import { siteConfig } from '@/lib/site-config';
import { cn, formatPriceShort } from '@/lib/utils';

function priceIcon(marker: MapMarker, active: boolean) {
  const sold = marker.status !== 'disponible';
  const bg = active ? '#f07a0a' : sold ? '#7d8c91' : '#176b5a';
  return L.divIcon({
    className: 'price-marker',
    iconSize: [0, 0],
    html: `<div style="transform:translate(-50%,-100%);display:inline-flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 8px rgba(15,25,29,.25))">
      <span style="background:${bg};color:#fff;font:600 12px/1 var(--font-sans),system-ui;padding:7px 10px;border-radius:999px;white-space:nowrap;transition:transform .2s;${active ? 'transform:scale(1.12)' : ''}">${formatPriceShort(marker.price)}</span>
      <span style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid ${bg};margin-top:-1px"></span>
    </div>`,
  });
}

function FitBounds({ markers, singleZoom }: { markers: MapMarker[]; singleZoom: number }) {
  const map = useMap();
  const key = markers.map((m) => m.id).join(',');
  useEffect(() => {
    if (markers.length === 0) return;
    if (markers.length === 1) {
      const only = markers[0]!;
      map.setView([only.latitude, only.longitude], singleZoom);
      return;
    }
    map.fitBounds(L.latLngBounds(markers.map((m) => [m.latitude, m.longitude] as [number, number])), {
      padding: [48, 48],
      maxZoom: 14,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map, singleZoom]);
  return null;
}

export default function LeafletMap({
  markers,
  activeId,
  onActiveChange,
  singleZoom = 15,
  className,
  interactivePopups = true,
}: MapViewProps) {
  const center = useMemo<[number, number]>(
    () => (markers[0] ? [markers[0].latitude, markers[0].longitude] : [siteConfig.mapCenter.latitude, siteConfig.mapCenter.longitude]),
    [markers],
  );

  return (
    <MapContainer
      center={center}
      zoom={markers.length === 1 ? singleZoom : 11}
      scrollWheelZoom={false}
      className={cn('h-full w-full', className)}
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds markers={markers} singleZoom={singleZoom} />
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={[m.latitude, m.longitude]}
          icon={priceIcon(m, activeId === m.id)}
          zIndexOffset={activeId === m.id ? 1000 : 0}
          keyboard
          title={`${m.title} — ${formatPriceShort(m.price)} FCFA`}
          eventHandlers={{
            mouseover: () => onActiveChange?.(m.id),
            mouseout: () => onActiveChange?.(null),
          }}
        >
          {interactivePopups && (
            <Popup closeButton={false} offset={[0, -36]}>
              <MarkerPopup marker={m} />
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}
