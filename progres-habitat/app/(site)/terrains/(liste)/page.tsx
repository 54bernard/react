import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { toMarker } from '@/components/map/types';
import {
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
      <div className="border-b border-ink-100 bg-white">
        <div className="container-page py-10 lg:py-14">
          <Breadcrumbs items={[{ name: 'Terrains', path: '/terrains' }]} />
          <h1 className="mt-5 font-display text-4xl font-medium tracking-tight sm:text-5xl">Terrains à vendre</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-500">
            Parcelles vérifiées à Ouagadougou et Tenkodogo — filtrez par zone, budget, surface ou mode de paiement.
          </p>
        </div>
      </div>

      <CatalogProvider filters={filters} view={view}>
        <div className="container-page py-8 lg:py-12">
          <div className={cn('grid gap-10', view !== 'carte' && 'lg:grid-cols-[17rem_1fr]')}>
            {view !== 'carte' && (
              <aside aria-label="Filtres" className="hidden lg:block">
                <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 pb-8">
                  <FiltersForm cities={options.cities} districts={options.districts} />
                </div>
              </aside>
            )}

            <div className="min-w-0">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-ink-600" aria-live="polite">
                  <strong className="font-semibold text-ink-900">{result.total}</strong> terrain{result.total > 1 ? 's' : ''}{' '}
                  trouvé{result.total > 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <MobileFilters
                    cities={options.cities}
                    districts={options.districts}
                    total={result.total}
                    alwaysVisible={view === 'carte'}
                  />
                  {view !== 'carte' && <SortSelect />}
                  <ViewToggle />
                </div>
              </div>

              <h2 className="sr-only">Résultats de la recherche</h2>
              <PendingOverlay>
                {result.items.length === 0 ? (
                  <EmptyState
                    icon={<SearchX className="size-6" />}
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
                  <ul className={cn('grid gap-6', view === 'grille' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
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
