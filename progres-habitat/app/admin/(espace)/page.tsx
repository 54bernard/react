import Link from 'next/link';
import { ArrowUpRight, CalendarClock, Eye, FileClock, Plus, Users } from 'lucide-react';
import { MonthlyChart } from '@/components/admin/monthly-chart';
import { AdminPageHeader, Panel, StatCard } from '@/components/admin/ui';
import { StatusBadge } from '@/components/property/status-badge';
import { Button } from '@/components/ui/button';
import { requireAdminPage } from '@/lib/auth';
import { appointmentStatusLabels, leadSourceLabels, leadStatusLabels } from '@/lib/labels';
import { APP_TIME_ZONE, formatDate, formatNumber } from '@/lib/utils';
import { getDashboardStats, listAppointments, listRecentLeads } from '@/services/admin';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const { supabase } = await requireAdminPage();
  const [stats, leads, appointments] = await Promise.all([
    getDashboardStats(supabase),
    listRecentLeads(supabase, 6),
    listAppointments(supabase, { periode: 'a-venir' }),
  ]);
  const upcoming = appointments.items.filter((a) => a.status !== 'annule').slice(0, 5);
  const maxSource = Math.max(1, ...stats.leadsBySource.map((s) => s.count));
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: APP_TIME_ZONE });

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description={<span className="capitalize">{today}</span>}
        actions={
          <Button asChild size="sm">
            <Link href="/admin/terrains/nouveau">
              <Plus /> Nouveau terrain
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard emphasis label="Terrains au catalogue" value={stats.total} hint={`${stats.archived} archivé(s)`} href="/admin/terrains" />
        <StatCard label="Disponibles" value={stats.available} hint="Publiés et à vendre" href="/admin/terrains?onglet=disponible" />
        <StatCard label="Réservés" value={stats.reserved} hint="Acompte versé" href="/admin/terrains?onglet=reserve" />
        <StatCard label="Vendus" value={stats.sold} hint="Ventes finalisées" href="/admin/terrains?onglet=vendu" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:mt-4 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Clients cette semaine" value={stats.leadsThisWeek} hint={`${stats.newLeads} à traiter`} icon={<Users />} href="/admin/clients" />
        <StatCard
          label="Demandes de visite"
          value={stats.appointments}
          hint={`${stats.pendingAppointments} en attente de confirmation`}
          icon={<CalendarClock />}
          href="/admin/visites"
        />
        <StatCard label="Vues des annonces" value={formatNumber(stats.totalViews)} hint="Depuis la mise en ligne" icon={<Eye />} />
        <StatCard
          label="Relances dues"
          value={stats.followUpsDue}
          hint={stats.unpublished ? `${stats.unpublished} brouillon(s) à publier` : 'Aucun brouillon'}
          icon={<FileClock />}
          href="/admin/clients?relance=1"
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr] lg:mt-8">
        <Panel title="Activité mensuelle" description="Nouveaux clients et demandes de visite, 6 derniers mois">
          <MonthlyChart data={stats.monthly} />
        </Panel>

        <Panel title="Annonces les plus consultées" flush>
          <ol className="divide-y divide-ink-100 border-t border-ink-100">
            {stats.topProperties.map((p, i) => (
              <li key={p.id}>
                <Link href={`/admin/terrains/${p.id}`} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-ink-50">
                  <span className="w-4 text-sm font-semibold text-ink-300 tabular-nums">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink-950">{p.title}</span>
                    <span className="mt-1 flex items-center gap-2 text-xs text-ink-500">
                      {p.reference} <StatusBadge status={p.status} />
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 tabular-nums">
                    <Eye className="size-3.5 text-ink-400" aria-hidden="true" /> {formatNumber(p.views_count)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel
          title="Derniers clients"
          flush
          action={
            <Link href="/admin/clients" className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-600 hover:text-ink-950">
              Tout voir <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        >
          {leads.length === 0 ? (
            <p className="border-t border-ink-100 px-5 py-10 text-center text-sm text-ink-500">Aucune demande pour le moment.</p>
          ) : (
            <ul className="divide-y divide-ink-100 border-t border-ink-100">
              {leads.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-950">{l.name}</p>
                    <p className="truncate text-xs text-ink-500">
                      {l.property?.reference ?? 'Sans terrain'} · {leadSourceLabels[l.source]} · {formatDate(l.created_at, { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold text-ink-700">{leadStatusLabels[l.status]}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Prochaines visites"
          flush
          action={
            <Link href="/admin/visites" className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-600 hover:text-ink-950">
              Agenda <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        >
          {upcoming.length === 0 ? (
            <p className="border-t border-ink-100 px-5 py-10 text-center text-sm text-ink-500">Aucune visite programmée.</p>
          ) : (
            <ul className="divide-y divide-ink-100 border-t border-ink-100">
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-12 shrink-0 rounded-lg border border-ink-100 py-1 text-center">
                    <p className="text-base leading-tight font-semibold text-ink-950">{new Date(`${a.preferred_date}T00:00:00Z`).getUTCDate()}</p>
                    <p className="text-[10px] font-medium text-ink-500 uppercase">{formatDate(`${a.preferred_date}T00:00:00Z`, { month: 'short', timeZone: 'UTC' })}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-950">{a.name}</p>
                    <p className="truncate text-xs text-ink-500">
                      {a.preferred_time} · {a.property?.reference ?? '—'}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-ink-500">{appointmentStatusLabels[a.status]}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Origine des clients" className="xl:col-span-2">
          {stats.leadsBySource.length === 0 ? (
            <p className="py-4 text-center text-sm text-ink-500">Pas encore de données.</p>
          ) : (
            <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.leadsBySource.map((s) => (
                <li key={s.source}>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-ink-600">{leadSourceLabels[s.source]}</span>
                    <span className="font-semibold text-ink-950 tabular-nums">{s.count}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100" role="presentation">
                    <div className="h-full rounded-full bg-ink-900" style={{ width: `${(s.count / maxSource) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
