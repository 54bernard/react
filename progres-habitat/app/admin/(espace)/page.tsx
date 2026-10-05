import Link from 'next/link';
import { BellRing, CalendarClock, CheckCircle2, Clock4, Eye, FileClock, MapPinned, Plus, Users } from 'lucide-react';
import { AdminPageHeader, Panel, StatCard } from '@/components/admin/ui';
import { StatusBadge } from '@/components/property/status-badge';
import { Button } from '@/components/ui/button';
import { getAdminContext } from '@/lib/auth';
import { appointmentStatusLabels, leadSourceLabels, leadStatusLabels } from '@/lib/labels';
import { formatDate, formatNumber } from '@/lib/utils';
import { getDashboardStats, listAppointments, listLeads } from '@/services/admin';

export const metadata = { title: 'Tableau de bord' };

export default async function DashboardPage() {
  const ctx = await getAdminContext();
  const supabase = ctx.mode === 'live' ? ctx.supabase : null;
  const [stats, leads, appointments] = await Promise.all([
    getDashboardStats(supabase),
    listLeads(supabase),
    listAppointments(supabase),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appointments.filter((a) => a.preferred_date >= today && a.status !== 'annule').slice(0, 5);
  const maxSource = Math.max(1, ...stats.leadsBySource.map((s) => s.count));

  return (
    <>
      <AdminPageHeader
        title="Tableau de bord"
        description="Vue d’ensemble de vos terrains et de votre activité commerciale."
        actions={
          <Button asChild>
            <Link href="/admin/terrains/nouveau">
              <Plus /> Ajouter un terrain
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Terrains disponibles" value={stats.available} icon={<MapPinned className="size-[18px]" />} tone="success" />
        <StatCard label="Terrains réservés" value={stats.reserved} icon={<Clock4 className="size-[18px]" />} tone="warning" />
        <StatCard label="Terrains vendus" value={stats.sold} icon={<CheckCircle2 className="size-[18px]" />} tone="brand" />
        <StatCard label="Vues des annonces" value={formatNumber(stats.totalViews)} icon={<Eye className="size-[18px]" />} />
        <StatCard label="Demandes clients" value={stats.leads} hint={`${stats.newLeads} nouvelle(s)`} icon={<Users className="size-[18px]" />} tone="accent" />
        <StatCard label="Demandes de visite" value={stats.appointments} hint={`${stats.pendingAppointments} en attente`} icon={<CalendarClock className="size-[18px]" />} />
        <StatCard label="Relances à faire" value={stats.followUpsDue} icon={<BellRing className="size-[18px]" />} tone={stats.followUpsDue > 0 ? 'danger' : 'neutral'} />
        <StatCard label="Brouillons" value={stats.unpublished} icon={<FileClock className="size-[18px]" />} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Dernières demandes"
          action={
            <Link href="/admin/demandes" className="text-sm font-medium text-brand-700 hover:underline">
              Tout voir
            </Link>
          }
        >
          {leads.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500">Aucune demande pour le moment.</p>
          ) : (
            <ul className="-my-3 divide-y divide-ink-100">
              {leads.slice(0, 6).map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">{l.name}</p>
                    <p className="truncate text-sm text-ink-500">
                      {l.property?.reference ?? 'Sans terrain'} · {leadSourceLabels[l.source]} · {formatDate(l.created_at, { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-700">{leadStatusLabels[l.status]}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Prochaines visites"
          action={
            <Link href="/admin/rendez-vous" className="text-sm font-medium text-brand-700 hover:underline">
              Agenda
            </Link>
          }
        >
          {upcoming.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500">Aucune visite programmée.</p>
          ) : (
            <ul className="-my-3 divide-y divide-ink-100">
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center gap-4 py-3">
                  <div className="w-14 shrink-0 rounded-xl bg-brand-50 py-1.5 text-center text-brand-800">
                    <p className="text-lg leading-none font-semibold">{new Date(a.preferred_date).getDate()}</p>
                    <p className="text-[11px] uppercase">{formatDate(a.preferred_date, { month: 'short' })}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink-900">{a.name}</p>
                    <p className="truncate text-sm text-ink-500">
                      {a.preferred_time} · {a.property?.reference ?? '—'}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-ink-500">{appointmentStatusLabels[a.status]}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Annonces les plus consultées">
          <ul className="-my-3 divide-y divide-ink-100">
            {stats.topProperties.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <Link href={`/admin/terrains/${p.id}`} className="block truncate font-medium text-ink-900 hover:text-brand-700">
                    {p.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-ink-400">{p.reference}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink-700 tabular-nums">
                  <Eye className="size-4 text-ink-400" aria-hidden="true" /> {formatNumber(p.views_count)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Origine des demandes">
          {stats.leadsBySource.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500">Pas encore de données.</p>
          ) : (
            <ul className="space-y-4">
              {stats.leadsBySource.map((s) => (
                <li key={s.source}>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-700">{leadSourceLabels[s.source]}</span>
                    <span className="font-semibold tabular-nums">{s.count}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100" role="presentation">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${(s.count / maxSource) * 100}%` }} />
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
