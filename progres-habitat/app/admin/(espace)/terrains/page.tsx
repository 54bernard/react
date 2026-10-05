import Image from 'next/image';
import Link from 'next/link';
import { Eye, MapPinned, Plus, Star } from 'lucide-react';
import { PropertyRowActions, PropertyStatusSelect } from '@/components/admin/property-row-actions';
import { PublicationBadge } from '@/components/admin/publication-badge';
import {
  AdminPageHeader,
  AdminPagination,
  SearchForm,
  TabLinks,
  TableCard,
  Toolbar,
  listHref,
  pageParam,
  td,
  th,
} from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/misc';
import { requireAdminPage } from '@/lib/auth';
import { formatDate, formatNumber, formatPrice, formatSurface } from '@/lib/utils';
import { listAdminLocations, listAdminProperties, type PropertySort, type PropertyTab } from '@/services/admin';

export const metadata = { title: 'Terrains' };

const TABS: { value: PropertyTab; label: string }[] = [
  { value: 'tous', label: 'Tous' },
  { value: 'disponible', label: 'Disponibles' },
  { value: 'reserve', label: 'Réservés' },
  { value: 'vendu', label: 'Vendus' },
  { value: 'brouillon', label: 'Brouillons' },
  { value: 'archive', label: 'Archivés' },
];
const SORTS: { value: PropertySort; label: string }[] = [
  { value: 'recent', label: 'Modifiés récemment' },
  { value: 'ancien', label: 'Modifiés il y a longtemps' },
  { value: 'prix-desc', label: 'Prix décroissant' },
  { value: 'prix-asc', label: 'Prix croissant' },
  { value: 'vues', label: 'Plus consultés' },
];

type SP = Promise<{ q?: string; onglet?: string; zone?: string; tri?: string; page?: string }>;

export default async function AdminPropertiesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const tab = (TABS.find((t) => t.value === sp.onglet)?.value ?? 'tous') as PropertyTab;
  const sort = (SORTS.find((s) => s.value === sp.tri)?.value ?? 'recent') as PropertySort;
  const q = sp.q?.slice(0, 60);
  const zone = sp.zone?.slice(0, 80);
  const page = pageParam(sp.page);

  const { supabase, isDemo } = await requireAdminPage();
  const [result, zones] = await Promise.all([
    listAdminProperties(supabase, { q, tab, zone, sort, page }),
    listAdminLocations(supabase),
  ]);
  const base = { q, onglet: tab === 'tous' ? undefined : tab, zone, tri: sort === 'recent' ? undefined : sort };
  const hasFilters = Boolean(q || zone);

  return (
    <>
      <AdminPageHeader
        title="Terrains"
        description={`${result.total} terrain${result.total > 1 ? 's' : ''}${tab !== 'tous' ? ` · ${TABS.find((t) => t.value === tab)?.label.toLowerCase()}` : ''}`}
        actions={
          <Button asChild size="sm">
            <Link href="/admin/terrains/nouveau">
              <Plus /> Nouveau terrain
            </Link>
          </Button>
        }
      />

      <Toolbar>
        <TabLinks
          label="Filtrer par statut"
          tabs={TABS.map((t) => ({
            label: t.label,
            href: listHref('/admin/terrains', { ...base, onglet: t.value === 'tous' ? undefined : t.value }),
            active: tab === t.value,
          }))}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchForm action="/admin/terrains" defaultValue={q} placeholder="Titre, référence, quartier…" hidden={{ onglet: base.onglet, zone, tri: base.tri }} />
          <form action="/admin/terrains" className="flex gap-2">
            {q && <input type="hidden" name="q" value={q} />}
            {base.onglet && <input type="hidden" name="onglet" value={base.onglet} />}
            <label htmlFor="f-zone" className="sr-only">
              Zone
            </label>
            <select
              id="f-zone"
              name="zone"
              defaultValue={zone ?? ''}
              className="h-10 min-w-0 flex-1 cursor-pointer rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-ink-900 focus:outline-none sm:w-36"
            >
              <option value="">Toutes zones</option>
              {zones.map((z) => (
                <option key={z.id} value={z.slug}>
                  {z.name}
                </option>
              ))}
            </select>
            <label htmlFor="f-tri" className="sr-only">
              Trier
            </label>
            <select
              id="f-tri"
              name="tri"
              defaultValue={sort}
              className="h-10 min-w-0 flex-1 cursor-pointer rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-ink-900 focus:outline-none sm:w-44"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline" size="sm" className="h-10 rounded-xl">
              Filtrer
            </Button>
          </form>
        </div>
      </Toolbar>

      {result.items.length === 0 ? (
        <EmptyState
          icon={<MapPinned />}
          title={hasFilters ? 'Aucun terrain ne correspond' : tab === 'archive' ? 'Aucun terrain archivé' : 'Aucun terrain'}
          description={hasFilters ? 'Modifiez la recherche ou les filtres.' : 'Ajoutez un terrain pour le publier sur le site.'}
          action={
            hasFilters ? (
              <Button asChild variant="outline" size="sm">
                <Link href={listHref('/admin/terrains', { onglet: base.onglet })}>Réinitialiser</Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/admin/terrains/nouveau">
                  <Plus /> Nouveau terrain
                </Link>
              </Button>
            )
          }
        />
      ) : (
        <TableCard
          footer={
            <AdminPagination
              page={result.page}
              pageCount={result.pageCount}
              total={result.total}
              pageSize={result.pageSize}
              hrefFor={(p) => listHref('/admin/terrains', { ...base, page: p })}
            />
          }
        >
          {/* Mobile : liste en cartes */}
          <ul className="divide-y divide-ink-100 md:hidden">
            {result.items.map((p) => (
              <li key={p.id} className="flex gap-3 p-4">
                <Link href={`/admin/terrains/${p.id}`} className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                  {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="64px" className="object-cover" />}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/terrains/${p.id}`} className="line-clamp-1 text-sm font-semibold text-ink-950">
                    {p.title}
                  </Link>
                  <p className="text-xs text-ink-500">
                    {p.reference} · {formatPrice(p.price)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <PropertyStatusSelect id={p.id} status={p.status} disabled={isDemo || Boolean(p.archived_at)} />
                    <PublicationBadge property={p} />
                  </div>
                </div>
                <PropertyRowActions id={p.id} title={p.title} published={p.is_published} archived={Boolean(p.archived_at)} />
              </li>
            ))}
          </ul>

          {/* Desktop : tableau */}
          <table className="hidden w-full min-w-[60rem] text-sm md:table">
            <thead className="border-b border-ink-100">
              <tr>
                <th scope="col" className={th}>Terrain</th>
                <th scope="col" className={th}>Prix</th>
                <th scope="col" className={th}>Surface</th>
                <th scope="col" className={th}>Statut</th>
                <th scope="col" className={th}>Publication</th>
                <th scope="col" className={th}>Vues</th>
                <th scope="col" className={th}>Modifié</th>
                <th scope="col" className={th}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {result.items.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-ink-50/60">
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                        {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="44px" className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/terrains/${p.id}`} className="block max-w-xs truncate font-medium text-ink-950 hover:underline">
                          {p.title}
                        </Link>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500">
                          {p.reference} · {p.district}
                          {p.is_featured && <Star className="size-3 fill-accent-500 text-accent-500" aria-label="À la une" />}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={`${td} font-medium whitespace-nowrap text-ink-950 tabular-nums`}>{formatPrice(p.price)}</td>
                  <td className={`${td} whitespace-nowrap text-ink-600 tabular-nums`}>{formatSurface(p.surface)}</td>
                  <td className={td}>
                    <PropertyStatusSelect id={p.id} status={p.status} disabled={isDemo || Boolean(p.archived_at)} />
                  </td>
                  <td className={td}>
                    <PublicationBadge property={p} />
                  </td>
                  <td className={`${td} text-ink-600 tabular-nums`}>
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="size-3.5 text-ink-400" aria-hidden="true" /> {formatNumber(p.views_count)}
                    </span>
                  </td>
                  <td className={`${td} whitespace-nowrap text-ink-500`}>{formatDate(p.updated_at, { day: 'numeric', month: 'short' })}</td>
                  <td className={`${td} text-right`}>
                    <PropertyRowActions id={p.id} title={p.title} published={p.is_published} archived={Boolean(p.archived_at)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}
    </>
  );
}
