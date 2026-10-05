import 'server-only';
import { cache } from 'react';
import { isSupabaseConfigured } from '@/lib/env';
import { siteConfig } from '@/lib/site-config';
import { createSupabasePublicClient } from '@/lib/supabase/server';
import { demoLocations, demoProperties } from '@/lib/data/demo';
import { filterProperties, paginate, sortProperties } from '@/lib/data/filtering';
import type {
  Location,
  LocationWithStats,
  Paginated,
  PropertyFilters,
  PropertyImage,
  PropertyWithRelations,
} from '@/types';

export const PROPERTY_SELECT =
  '*, images:property_images(*), documents:property_documents(*), location:locations(*)';

/** Normalise une ligne Supabase (tri des images, valeurs nulles). */
export function normalizeProperty(row: Record<string, unknown>): PropertyWithRelations {
  const p = row as unknown as PropertyWithRelations;
  const images = [...((p.images as PropertyImage[] | null) ?? [])].sort(
    (a, b) => Number(b.is_main) - Number(a.is_main) || a.position - b.position,
  );
  return {
    ...p,
    price: Number(p.price),
    nearby: Array.isArray(p.nearby) ? p.nearby : [],
    amenities: p.amenities ?? [],
    payment_options: p.payment_options ?? [],
    images,
    documents: p.documents ?? [],
    location: p.location ?? null,
  };
}

/** Échappe les caractères spéciaux des motifs ILIKE / filtres PostgREST. */
function escapeLike(value: string): string {
  return value.replace(/[%_\\,()."']/g, ' ').trim();
}

async function querySupabase(filters: PropertyFilters, range?: { from: number; to: number }) {
  const supabase = createSupabasePublicClient();
  let query = supabase
    .from('properties')
    .select(PROPERTY_SELECT, { count: 'exact' })
    .eq('is_published', true);

  if (filters.q) {
    const words = escapeLike(filters.q).split(/\s+/).filter(Boolean);
    for (const word of words) {
      query = query.or(
        `title.ilike.%${word}%,description.ilike.%${word}%,district.ilike.%${word}%,city.ilike.%${word}%,reference.ilike.%${word}%`,
      );
    }
  }
  if (filters.ville) query = query.ilike('city', escapeLike(filters.ville));
  if (filters.quartier) query = query.ilike('district', `%${escapeLike(filters.quartier)}%`);
  if (filters.zone) {
    const { data: zone } = await supabase.from('locations').select('id').eq('slug', filters.zone).maybeSingle();
    query = query.eq('location_id', zone?.id ?? '00000000-0000-0000-0000-000000000000');
  }
  if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);
  if (filters.minSurface !== undefined) query = query.gte('surface', filters.minSurface);
  if (filters.maxSurface !== undefined) query = query.lte('surface', filters.maxSurface);
  if (filters.type) query = query.eq('type', filters.type);
  if (filters.statut) query = query.eq('status', filters.statut);
  if (filters.paiement) query = query.contains('payment_options', [filters.paiement]);

  switch (filters.sort) {
    case 'prix-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'prix-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'surface-desc':
      query = query.order('surface', { ascending: false });
      break;
    case 'surface-asc':
      query = query.order('surface', { ascending: true });
      break;
    default:
      // L'énumération est ordonnée : disponible < reserve < vendu
      query = query.order('status', { ascending: true }).order('created_at', { ascending: false });
  }

  if (range) query = query.range(range.from, range.to);

  const { data, error, count } = await query;
  if (error) throw new Error(`Impossible de charger les terrains : ${error.message}`);
  return { items: (data ?? []).map(normalizeProperty), total: count ?? 0 };
}

export async function listProperties(
  filters: PropertyFilters,
  pageSize: number = siteConfig.pageSize,
): Promise<Paginated<PropertyWithRelations>> {
  const page = filters.page ?? 1;
  if (!isSupabaseConfigured) {
    return paginate(sortProperties(filterProperties(demoProperties, filters), filters.sort), page, pageSize);
  }
  const from = (page - 1) * pageSize;
  const { items, total } = await querySupabase(filters, { from, to: from + pageSize - 1 });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return { items, total, page, pageSize, pageCount };
}

/** Tous les résultats (sans pagination) — utilisé par la vue carte. */
export async function listAllMatching(filters: PropertyFilters): Promise<PropertyWithRelations[]> {
  if (!isSupabaseConfigured) return sortProperties(filterProperties(demoProperties, filters), filters.sort);
  const { items } = await querySupabase(filters, { from: 0, to: 499 });
  return items;
}

export const getPropertyBySlug = cache(async (slug: string): Promise<PropertyWithRelations | null> => {
  if (!isSupabaseConfigured) return demoProperties.find((p) => p.slug === slug && p.is_published) ?? null;
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_SELECT)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (error) throw new Error(`Impossible de charger le terrain : ${error.message}`);
  return data ? normalizeProperty(data) : null;
});

export async function getFeaturedProperties(limit = 6): Promise<PropertyWithRelations[]> {
  if (!isSupabaseConfigured) {
    return sortProperties(demoProperties.filter((p) => p.is_featured && p.is_published)).slice(0, limit);
  }
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_SELECT)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('status', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalizeProperty);
}

export async function getPopularProperties(limit = 4): Promise<PropertyWithRelations[]> {
  if (!isSupabaseConfigured) {
    return [...demoProperties]
      .filter((p) => p.is_published && p.status === 'disponible')
      .sort((a, b) => b.views_count - a.views_count)
      .slice(0, limit);
  }
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_SELECT)
    .eq('is_published', true)
    .eq('status', 'disponible')
    .order('views_count', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalizeProperty);
}

export async function getSimilarProperties(property: PropertyWithRelations, limit = 3) {
  const candidates = await listAllMatching({ statut: 'disponible' });
  return candidates
    .filter((p) => p.id !== property.id)
    .map((p) => {
      let score = 0;
      if (p.location_id && p.location_id === property.location_id) score += 3;
      if (p.city === property.city) score += 2;
      if (p.type === property.type) score += 2;
      const priceGap = Math.abs(p.price - property.price) / Math.max(property.price, 1);
      score += Math.max(0, 2 - priceGap * 2);
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => p);
}

export const getLocations = cache(async (): Promise<Location[]> => {
  if (!isSupabaseConfigured) return demoLocations;
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase.from('locations').select('*').order('name');
  if (error) throw new Error(error.message);
  return (data ?? []) as Location[];
});

export const getLocationsWithStats = cache(async (): Promise<LocationWithStats[]> => {
  const [locations, all] = await Promise.all([getLocations(), listAllMatching({})]);
  return locations
    .map((location) => {
      const inZone = all.filter((p) => p.location_id === location.id);
      const available = inZone.filter((p) => p.status === 'disponible');
      const average =
        available.length > 0 ? Math.round(available.reduce((s, p) => s + p.price, 0) / available.length) : null;
      return { ...location, property_count: inZone.length, available_count: available.length, average_price: average };
    })
    .sort((a, b) => b.available_count - a.available_count);
});

export interface FilterOptions {
  cities: string[];
  districts: string[];
  zones: { slug: string; name: string }[];
}

export const getFilterOptions = cache(async (): Promise<FilterOptions> => {
  const [all, locations] = await Promise.all([listAllMatching({}), getLocations()]);
  const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b, 'fr'));
  return {
    cities: unique(all.map((p) => p.city)),
    districts: unique(all.map((p) => p.district)),
    zones: locations.map((l) => ({ slug: l.slug, name: l.name })),
  };
});

export async function getAllPublishedSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  if (!isSupabaseConfigured) return demoProperties.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase.from('properties').select('slug, updated_at').eq('is_published', true);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function recordPropertyView(slug: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createSupabasePublicClient();
  await supabase.rpc('increment_property_view', { p_slug: slug });
}
