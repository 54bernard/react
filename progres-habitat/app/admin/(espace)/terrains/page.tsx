import Image from 'next/image';
import Link from 'next/link';
import { Eye, MapPinned, Plus, Search, Star } from 'lucide-react';
import { PropertyRowActions, PropertyStatusSelect } from '@/components/admin/property-row-actions';
import { AdminPageHeader } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-controls';
import { EmptyState } from '@/components/ui/misc';
import { getAdminContext } from '@/lib/auth';
import { statusLabels } from '@/lib/labels';
import { cn, formatNumber, formatPrice, formatSurface } from '@/lib/utils';
import { listAdminProperties } from '@/services/admin';
import { PROPERTY_STATUSES, type PropertyStatus } from '@/types';

export const metadata = { title: 'Terrains' };

type Filter = PropertyStatus | 'brouillon' | undefined;

export default async function AdminPropertiesPage({ searchParams }: { searchParams: Promise<{ q?: string; statut?: string }> }) {
  const { q, statut } = await searchParams;
  const status: Filter = statut === 'brouillon' || PROPERTY_STATUSES.includes(statut as PropertyStatus) ? (statut as Filter) : undefined;
  const ctx = await getAdminContext();
  const properties = await listAdminProperties(ctx.mode === 'live' ? ctx.supabase : null, { q: q?.slice(0, 60), status });

  const tabs: { value: Filter; label: string }[] = [
    { value: undefined, label: 'Tous' },
    ...PROPERTY_STATUSES.map((s) => ({ value: s, label: statusLabels[s] })),
    { value: 'brouillon', label: 'Brouillons' },
  ];

  return (
    <>
      <AdminPageHeader
        title="Terrains"
        description={`${properties.length} terrain${properties.length > 1 ? 's' : ''}`}
        actions={
          <Button asChild>
            <Link href="/admin/terrains/nouveau">
              <Plus /> Ajouter un terrain
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filtrer par statut" className="flex flex-wrap gap-1.5">
          {tabs.map((t) => {
            const active = status === t.value;
            const params = new URLSearchParams();
            if (t.value) params.set('statut', t.value);
            if (q) params.set('q', q);
            return (
              <Link
                key={t.label}
                href={`/admin/terrains${params.size ? `?${params}` : ''}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition',
                  active ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:text-ink-900',
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
        <form className="relative w-full lg:w-80" role="search">
          {status && <input type="hidden" name="statut" value={status} />}
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <label htmlFor="admin-q" className="sr-only">
            Rechercher un terrain
          </label>
          <Input id="admin-q" name="q" defaultValue={q} placeholder="Titre, référence, quartier…" className="pl-10" />
        </form>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          icon={<MapPinned className="size-6" />}
          title="Aucun terrain"
          description="Ajoutez votre premier terrain pour le publier sur le site."
          action={
            <Button asChild>
              <Link href="/admin/terrains/nouveau">
                <Plus /> Ajouter un terrain
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="border-b border-ink-100 bg-ink-50/60 text-xs tracking-wide text-ink-500 uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Terrain</th>
                  <th scope="col" className="px-5 py-3 font-medium">Prix</th>
                  <th scope="col" className="px-5 py-3 font-medium">Surface</th>
                  <th scope="col" className="px-5 py-3 font-medium">Statut</th>
                  <th scope="col" className="px-5 py-3 font-medium">Vues</th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-ink-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                          {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="56px" className="object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/admin/terrains/${p.id}`} className="block max-w-sm truncate font-semibold text-ink-900 hover:text-brand-700">
                            {p.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-ink-500">
                            <span>{p.reference}</span>·<span>{p.district}</span>
                            {!p.is_published && <Badge variant="neutral">Brouillon</Badge>}
                            {p.is_featured && (
                              <Badge variant="accent">
                                <Star aria-hidden="true" /> À la une
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium whitespace-nowrap text-ink-900">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-ink-600">{formatSurface(p.surface)}</td>
                    <td className="px-5 py-3">
                      <PropertyStatusSelect id={p.id} status={p.status} />
                    </td>
                    <td className="px-5 py-3 text-ink-600 tabular-nums">
                      <span className="inline-flex items-center gap-1.5">
                        <Eye className="size-4 text-ink-400" aria-hidden="true" /> {formatNumber(p.views_count)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <PropertyRowActions id={p.id} title={p.title} published={p.is_published} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
