import { LeadsManager } from '@/components/admin/leads-manager';
import { AdminPageHeader, AdminPagination, SearchForm, TabLinks, Toolbar, listHref, pageParam } from '@/components/admin/ui';
import { requireAdminPage } from '@/lib/auth';
import { leadSourceLabels, leadStatusLabels } from '@/lib/labels';
import { listLeads, listPropertyOptions } from '@/services/admin';
import { LEAD_SOURCES, LEAD_STATUSES, type LeadSource, type LeadStatus } from '@/types';

export const metadata = { title: 'Clients' };

type SP = Promise<{ statut?: string; source?: string; q?: string; relance?: string; page?: string }>;

export default async function ClientsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const status = LEAD_STATUSES.includes(sp.statut as LeadStatus) ? (sp.statut as LeadStatus) : undefined;
  const source = LEAD_SOURCES.includes(sp.source as LeadSource) ? (sp.source as LeadSource) : undefined;
  const relance = sp.relance === '1';
  const q = sp.q?.slice(0, 60);
  const page = pageParam(sp.page);

  const { supabase } = await requireAdminPage();
  const [result, properties] = await Promise.all([
    listLeads(supabase, { status, source, q, relance, page }),
    listPropertyOptions(supabase),
  ]);

  const base = { statut: status, source, q, relance: relance ? '1' : undefined };

  return (
    <>
      <AdminPageHeader title="Clients" description="Prospects et demandes : statut, notes, relances et origine." />

      <Toolbar>
        <TabLinks
          label="Filtrer par statut"
          tabs={[
            { label: 'Tous', href: listHref('/admin/clients', { ...base, statut: undefined, relance: undefined }), active: !status && !relance },
            ...LEAD_STATUSES.map((s) => ({
              label: leadStatusLabels[s],
              href: listHref('/admin/clients', { ...base, statut: s, relance: undefined }),
              active: status === s,
            })),
            { label: 'Relances dues', href: listHref('/admin/clients', { ...base, statut: undefined, relance: '1' }), active: relance },
          ]}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchForm action="/admin/clients" defaultValue={q} placeholder="Nom, téléphone, e-mail…" hidden={{ statut: status, source, relance: base.relance }} />
          <form action="/admin/clients" className="flex gap-2">
            {q && <input type="hidden" name="q" value={q} />}
            {status && <input type="hidden" name="statut" value={status} />}
            <label htmlFor="f-source" className="sr-only">
              Source
            </label>
            <select
              id="f-source"
              name="source"
              defaultValue={source ?? ''}
              className="h-10 min-w-0 flex-1 cursor-pointer rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-ink-900 focus:outline-none sm:w-48"
            >
              <option value="">Toutes les sources</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {leadSourceLabels[s]}
                </option>
              ))}
            </select>
            <button type="submit" className="h-10 cursor-pointer rounded-xl border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-900 transition hover:border-ink-900">
              Filtrer
            </button>
          </form>
        </div>
      </Toolbar>

      <LeadsManager
        leads={result.items}
        properties={properties}
        exportHref={listHref('/admin/clients/export', base)}
        footer={
          <AdminPagination
            page={result.page}
            pageCount={result.pageCount}
            total={result.total}
            pageSize={result.pageSize}
            hrefFor={(p) => listHref('/admin/clients', { ...base, page: p })}
          />
        }
      />
    </>
  );
}
