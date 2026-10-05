import type { PropertyStatus, PropertyWithRelations } from '@/types';

/** Données minimales envoyées au navigateur pour chaque marqueur. */
export interface MapMarker {
  id: string;
  slug: string;
  title: string;
  reference: string;
  price: number;
  surface: number;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  status: PropertyStatus;
  image: string | null;
}

export function toMarker(p: PropertyWithRelations): MapMarker {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    reference: p.reference,
    price: p.price,
    surface: p.surface,
    district: p.district,
    city: p.city,
    latitude: p.latitude,
    longitude: p.longitude,
    status: p.status,
    image: p.images[0]?.url ?? null,
  };
}

export interface MapViewProps {
  markers: MapMarker[];
  activeId?: string | null;
  onActiveChange?: (id: string | null) => void;
  /** Zoom initial lorsqu'il n'y a qu'un seul marqueur (fiche terrain). */
  singleZoom?: number;
  className?: string;
  interactivePopups?: boolean;
}
