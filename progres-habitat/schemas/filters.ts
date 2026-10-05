import { z } from 'zod';
import { PAYMENT_OPTIONS, PROPERTY_STATUSES, PROPERTY_TYPES, type PropertyFilters, type ViewMode } from '@/types';

const optionalNumber = z
  .string()
  .optional()
  .transform((v) => (v === undefined || v === '' ? undefined : Number(v.replace(/\s/g, ''))))
  .pipe(z.number().int().nonnegative().max(100_000_000_000).optional());

const optionalText = z
  .string()
  .optional()
  .transform((v) => (v ? v.trim().slice(0, 80) : undefined))
  .transform((v) => (v ? v : undefined));

export const filtersSchema = z.object({
  q: optionalText,
  ville: optionalText,
  quartier: optionalText,
  zone: optionalText,
  minPrice: optionalNumber,
  maxPrice: optionalNumber,
  minSurface: optionalNumber,
  maxSurface: optionalNumber,
  type: z.enum(PROPERTY_TYPES).optional().catch(undefined),
  statut: z.enum(PROPERTY_STATUSES).optional().catch(undefined),
  paiement: z.enum(PAYMENT_OPTIONS).optional().catch(undefined),
  sort: z.enum(['recent', 'prix-asc', 'prix-desc', 'surface-desc', 'surface-asc']).optional().catch(undefined),
  page: optionalNumber,
});

type RawParams = Record<string, string | string[] | undefined>;

function firstValues(params: RawParams): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(params).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
}

/** Lit et valide les paramètres d'URL de la page /terrains (valeurs invalides ignorées). */
export function parseFilters(params: RawParams): PropertyFilters {
  const parsed = filtersSchema.safeParse(firstValues(params));
  if (!parsed.success) return {};
  const data = parsed.data;
  return {
    ...data,
    page: data.page && data.page > 0 ? data.page : 1,
  };
}

export function parseView(params: RawParams): ViewMode {
  const v = firstValues(params).vue;
  return v === 'liste' || v === 'carte' ? v : 'grille';
}

/** Sérialise des filtres en query string (clés vides omises). */
export function filtersToSearchParams(filters: PropertyFilters & { vue?: ViewMode }): URLSearchParams {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (key === 'page' && value === 1) return;
    if (key === 'vue' && value === 'grille') return;
    if (key === 'sort' && value === 'recent') return;
    params.set(key, String(value));
  });
  return params;
}

export function countActiveFilters(filters: PropertyFilters): number {
  const keys: (keyof PropertyFilters)[] = [
    'q', 'ville', 'quartier', 'zone', 'minPrice', 'maxPrice', 'minSurface', 'maxSurface', 'type', 'statut', 'paiement',
  ];
  return keys.filter((k) => filters[k] !== undefined).length;
}
