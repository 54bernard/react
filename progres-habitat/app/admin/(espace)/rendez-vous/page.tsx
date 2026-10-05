import Link from 'next/link';
import { AppointmentsList } from '@/components/admin/appointments-list';
import { AdminPageHeader } from '@/components/admin/ui';
import { getAdminContext } from '@/lib/auth';
import { appointmentStatusLabels } from '@/lib/labels';
import { cn } from '@/lib/utils';
import { listAppointments } from '@/services/admin';
import { APPOINTMENT_STATUSES, type AppointmentStatus } from '@/types';

export const metadata = { title: 'Rendez-vous' };

export default async function AppointmentsPage({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  const { statut } = await searchParams;
  const status = APPOINTMENT_STATUSES.includes(statut as AppointmentStatus) ? (statut as AppointmentStatus) : undefined;
  const ctx = await getAdminContext();
  const appointments = await listAppointments(ctx.mode === 'live' ? ctx.supabase : null, { status });

  return (
    <>
      <AdminPageHeader title="Rendez-vous" description="Demandes de visite, classées par date." />
      <nav aria-label="Filtrer par statut" className="mb-6 flex flex-wrap gap-1.5">
        {[undefined, ...APPOINTMENT_STATUSES].map((s) => (
          <Link
            key={s ?? 'tous'}
            href={s ? `/admin/rendez-vous?statut=${s}` : '/admin/rendez-vous'}
            aria-current={status === s ? 'page' : undefined}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium transition',
              status === s ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:text-ink-900',
            )}
          >
            {s ? appointmentStatusLabels[s] : 'Tous'}
          </Link>
        ))}
      </nav>
      <AppointmentsList appointments={appointments} />
    </>
  );
}
