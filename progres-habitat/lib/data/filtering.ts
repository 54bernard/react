import type { Paginated, PropertyFilters, PropertyWithRelations, SortOption } from '@/types';

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Filtrage en mémoire (mode démonstration) — même sémantique que la requête Supabase. */
export function filterProperties(list: PropertyWithRelations[], f: PropertyFilters): PropertyWithRelations[] {
  const q = f.q ? normalize(f.q) : undefined;
  return list.filter((p) => {
    if (!p.is_published) return false;
    if (q) {
      const haystack = normalize(`${p.title} ${p.description} ${p.district} ${p.city} ${p.reference}`);
      if (!q.split(/\s+/).every((word) => haystack.includes(word))) return false;
    }
    if (f.ville && normalize(p.city) !== normalize(f.ville)) return false;
    if (f.quartier && !normalize(p.district).includes(normalize(f.quartier))) return false;
    if (f.zone && p.location?.slug !== f.zone) return false;
    if (f.minPrice !== undefined && p.price < f.minPrice) return false;
    if (f.maxPrice !== undefined && p.price > f.maxPrice) return false;
    if (f.minSurface !== undefined && p.surface < f.minSurface) return false;
    if (f.maxSurface !== undefined && p.surface > f.maxSurface) return false;
    if (f.type && p.type !== f.type) return false;
    if (f.statut && p.status !== f.statut) return false;
    if (f.paiement && !p.payment_options.includes(f.paiement)) return false;
    return true;
  });
}

const statusRank = { disponible: 0, reserve: 1, vendu: 2 } as const;

export function sortProperties(list: PropertyWithRelations[], sort: SortOption = 'recent'): PropertyWithRelations[] {
  const sorted = [...list];
  sorted.sort((a, b) => {
    switch (sort) {
      case 'prix-asc':
        return a.price - b.price;
      case 'prix-desc':
        return b.price - a.price;
      case 'surface-desc':
        return b.surface - a.surface;
      case 'surface-asc':
        return a.surface - b.surface;
      default:
        // Les terrains disponibles d'abord, puis les plus récents
        return statusRank[a.status] - statusRank[b.status] || b.created_at.localeCompare(a.created_at);
    }
  });
  return sorted;
}

export function paginate<T>(items: T[], page: number, pageSize: number): Paginated<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  return {
    items: items.slice((current - 1) * pageSize, current * pageSize),
    total,
    page: current,
    pageSize,
    pageCount,
  };
}
