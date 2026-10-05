import Link from 'next/link';
import { LeadsManager } from '@/components/admin/leads-manager';
import { AdminPageHeader } from '@/components/admin/ui';
import { getAdminContext } from '@/lib/auth';
import { leadSourceLabels, leadStatusLabels } from '@/lib/labels';
import { cn } from '@/lib/utils';
import { listLeads, listPropertyOptions } from '@/services/admin';
import { LEAD_SOURCES, LEAD_STATUSES, type LeadSource, type LeadStatus } from '@/types';

export const metadata = { title: 'Demandes clients' };

type SP = Promise<{ statut?: string; source?: string; q?: string; relance?: string }>;

export default async function LeadsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const status = LEAD_STATUSES.includes(sp.statut as LeadStatus) ? (sp.statut as LeadStatus) : undefined;
  const source = LEAD_SOURCES.includes(sp.source as LeadSource) ? (sp.source as LeadSource) : undefined;
  const relance = sp.relance === '1';
  const ctx = await getAdminContext();
  const supabase = ctx.mode === 'live' ? ctx.supabase : null;
  const [leads, properties] = await Promise.all([
    listLeads(supabase, { status, source, q: sp.q?.slice(0, 60), relance }),
    listPropertyOptions(supabase),
  ]);

  const link = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { statut: status, source, q: sp.q, relance: relance ? '1' : undefined, ...patch };
    Object.entries(merged).forEach(([k, v]) => v && params.set(k, v));
    return `/admin/demandes${params.size ? `?${params}` : ''}`;
  };
  const chip = (active: boolean) =>
    cn('rounded-full px-3 py-1.5 text-sm font-medium transition', active ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:text-ink-900');

  return (
    <>
      <AdminPageHeader title="Demandes clients" description="Suivez vos prospects : statut, notes et relances." />

      <div className="mb-6 space-y-3">
        <nav aria-label="Filtrer par statut" className="flex flex-wrap gap-1.5">
          <Link href={link({ statut: undefined, relance: undefined })} className={chip(!status && !relance)}>
            Toutes
          </Link>
          {LEAD_STATUSES.map((s) => (
            <Link key={s} href={link({ statut: s, relance: undefined })} className={chip(status === s)}>
              {leadStatusLabels[s]}
            </Link>
          ))}
          <Link href={link({ relance: '1', statut: undefined })} className={chip(relance)}>
            Relances dues
          </Link>
        </nav>
        <form className="flex flex-wrap gap-2" role="search">
          {status && <input type="hidden" name="statut" value={status} />}
          <label htmlFor="lead-q" className="sr-only">
            Rechercher
          </label>
          <input
            id="lead-q"
            name="q"
            defaultValue={sp.q}
            placeholder="Nom, téléphone, e-mail…"
            className="h-10 w-64 rounded-xl border border-ink-200 bg-white px-3.5 text-sm focus:border-brand-500 focus:outline-none"
          />
          <label htmlFor="lead-source" className="sr-only">
            Source
          </label>
          <select
            id="lead-source"
            name="source"
            defaultValue={source ?? ''}
            className="h-10 rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none"
          >
            <option value="">Toutes les sources</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>
                {leadSourceLabels[s]}
              </option>
            ))}
          </select>
          <button type="submit" className="h-10 cursor-pointer rounded-xl bg-ink-900 px-4 text-sm font-semibold text-white">
            Filtrer
          </button>
        </form>
      </div>

      <LeadsManager leads={leads} properties={properties} />
    </>
  );
}
