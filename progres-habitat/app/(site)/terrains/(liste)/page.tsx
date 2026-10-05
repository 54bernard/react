import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { toMarker } from '@/components/map/types';
import {
  ActiveFilters,
  CatalogProvider,
  FiltersForm,
  MobileFilters,
  Pagination,
  PendingOverlay,
  SortSelect,
  ViewToggle,
} from '@/components/property/catalog-controls';
import { PropertyCard } from '@/components/property/property-card';
import { ResultsMap } from '@/components/property/results-map';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/misc';
import { itemListJsonLd, pageMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';
import { countActiveFilters, parseFilters, parseView } from '@/schemas/filters';
import { getFilterOptions, listAllMatching, listProperties } from '@/services/properties';
import type { Paginated, PropertyWithRelations } from '@/types';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const where = filters.ville ?? filters.quartier ?? (filters.zone ? filters.zone.replace(/-/g, ' ') : null);
  const meta = pageMetadata({
    title: where ? `Terrains à vendre à ${where}` : 'Terrains et parcelles à vendre',
    description: `Parcourez nos terrains à vendre${where ? ` à ${where}` : ' à Ouagadougou et Tenkodogo'} : prix, superficie, documents officiels, paiement comptant ou échelonné.`,
    path: '/terrains',
    // Les combinaisons de filtres ne sont pas indexées pour éviter le contenu dupliqué
    noIndex: countActiveFilters(filters) > 1,
  });
  return meta;
}

export default async function TerrainsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const view = parseView(params);

  const [options, result] = await Promise.all([
    getFilterOptions(),
    view === 'carte'
      ? listAllMatching(filters).then<Paginated<PropertyWithRelations>>((items) => ({
          items,
          total: items.length,
          page: 1,
          pageSize: items.length,
          pageCount: 1,
        }))
      : listProperties(filters),
  ]);

  return (
    <div className="pt-header">
      <JsonLd data={itemListJsonLd(result.items)} />
      <div className="border-b border-ink-950/[0.06]">
        <div className="container-page pt-8 pb-10 lg:pt-12 lg:pb-14">
          <Breadcrumbs items={[{ name: 'Terrains', path: '/terrains' }]} />
          <div className="mt-10 flex flex-col gap-6 lg:mt-14 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-h1">Terrains à vendre</h1>
              <p className="mt-4 max-w-xl text-lead text-ink-500">
                Parcelles vérifiées à Ouagadougou et Tenkodogo, avec documents officiels.
              </p>
            </div>
            <p className="text-sm text-ink-500" aria-live="polite">
              <strong className="font-display text-3xl font-normal text-ink-950 tabular-nums">{result.total}</strong>{' '}
              terrain{result.total > 1 ? 's' : ''} trouvé{result.total > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <CatalogProvider filters={filters} view={view}>
        <div className="container-page py-8 lg:py-12">
          <div className={cn('grid gap-12', view !== 'carte' && 'lg:grid-cols-[16rem_1fr] xl:gap-16')}>
            {view !== 'carte' && (
              <aside aria-label="Filtres" className="hidden lg:block">
                <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-3 pb-8">
                  <FiltersForm cities={options.cities} districts={options.districts} />
                </div>
              </aside>
            )}

            <div className="min-w-0">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MobileFilters cities={options.cities} districts={options.districts} total={result.total} alwaysVisible={view === 'carte'} />
                  {view !== 'carte' && <SortSelect />}
                </div>
                <ViewToggle />
              </div>
              <ActiveFilters zones={options.zones} />

              <h2 className="sr-only">Résultats de la recherche</h2>
              <PendingOverlay>
                {result.items.length === 0 ? (
                  <EmptyState
                    icon={<SearchX />}
                    title="Aucun terrain ne correspond à votre recherche"
                    description="Élargissez vos critères ou laissez-nous votre demande : nous vous prévenons dès qu’un terrain correspondant est disponible."
                    action={
                      <div className="flex flex-wrap justify-center gap-3">
                        <Button asChild variant="outline">
                          <Link href="/terrains">Voir tous les terrains</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/contact">Être alerté</Link>
                        </Button>
                      </div>
                    }
                  />
                ) : view === 'carte' ? (
                  <ResultsMap markers={result.items.map(toMarker)} />
                ) : (
                  <ul
                    className={cn(
                      'grid',
                      view === 'grille' ? 'gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8' : 'grid-cols-1 divide-y divide-ink-950/[0.07] [&>li]:py-8 [&>li:first-child]:pt-0',
                    )}
                  >
                    {result.items.map((p, i) => (
                      <li key={p.id}>
                        <PropertyCard property={p} layout={view === 'liste' ? 'list' : 'grid'} priority={i < 3} />
                      </li>
                    ))}
                  </ul>
                )}
              </PendingOverlay>

              {view !== 'carte' && <Pagination page={result.page} pageCount={result.pageCount} />}
            </div>
          </div>
        </div>
      </CatalogProvider>
    </div>
  );
}
