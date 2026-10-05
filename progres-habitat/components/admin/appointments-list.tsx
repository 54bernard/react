'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, Clock, Loader2, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { updateAppointment } from '@/app/admin/actions';
import { WhatsAppIcon } from '@/components/layout/whatsapp-icon';
import { EmptyState } from '@/components/ui/misc';
import { appointmentStatusLabels } from '@/lib/labels';
import { cn, formatDate } from '@/lib/utils';
import { phoneHref, whatsappLink } from '@/lib/whatsapp';
import { APPOINTMENT_STATUSES, type AppointmentStatus, type AppointmentWithProperty } from '@/types';

const tone: Record<AppointmentStatus, string> = {
  en_attente: 'border-amber-200 bg-amber-50 text-amber-800',
  confirme: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  effectue: 'border-ink-200 bg-ink-50 text-ink-600',
  annule: 'border-red-200 bg-red-50 text-red-700',
};

function StatusSelect({ appointment }: { appointment: AppointmentWithProperty }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={`rdv-${appointment.id}`} className="sr-only">
        Statut du rendez-vous
      </label>
      <select
        id={`rdv-${appointment.id}`}
        value={appointment.status}
        disabled={pending}
        onChange={(e) =>
          start(async () => {
            const res = await updateAppointment({ id: appointment.id, status: e.target.value });
            if (res.ok) toast.success(res.message);
            else toast.error(res.error);
            router.refresh();
          })
        }
        className={cn('h-9 cursor-pointer rounded-lg border px-2.5 text-sm font-semibold focus:outline-none', tone[appointment.status])}
      >
        {APPOINTMENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {appointmentStatusLabels[s]}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="size-4 animate-spin text-ink-400" aria-hidden="true" />}
    </div>
  );
}

export function AppointmentsList({ appointments, footer }: { appointments: AppointmentWithProperty[]; footer?: React.ReactNode }) {
  if (appointments.length === 0) {
    return <EmptyState icon={<CalendarDays />} title="Aucune demande de visite" description="Les demandes envoyées depuis les fiches terrain apparaîtront ici." />;
  }
  const groups = appointments.reduce<Record<string, AppointmentWithProperty[]>>((acc, a) => {
    (acc[a.preferred_date] ??= []).push(a);
    return acc;
  }, {});
  const today = new Date().toISOString().slice(0, 10);
  // Midi UTC : évite tout décalage de jour lié au fuseau horaire
  const asDate = (d: string) => `${d}T12:00:00Z`;

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([date, items]) => (
        <section key={date} aria-labelledby={`jour-${date}`}>
          <h2 id={`jour-${date}`} className={cn('mb-3 flex items-center gap-2 text-[13px] font-semibold first-letter:uppercase', date < today ? 'text-ink-400' : 'text-ink-800')}>
            {formatDate(asDate(date), { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })}
            {date === today && <span className="rounded-full bg-ink-950 px-2 py-0.5 text-[11px] font-semibold text-white">Aujourd’hui</span>}
          </h2>
          <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
            {items.map((a) => (
              <li key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                <span className="inline-flex w-20 items-center gap-1.5 font-semibold text-ink-950 tabular-nums">
                  <Clock className="size-4 text-ink-400" aria-hidden="true" /> {a.preferred_time}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink-950">{a.name}</p>
                  <p className="text-sm text-ink-500">
                    {a.phone}
                    {a.property && (
                      <>
                        {' · '}
                        <Link href={`/admin/terrains/${a.property.id}`} className="font-medium text-ink-800 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-900">
                          {a.property.reference}
                        </Link>
                      </>
                    )}
                  </p>
                  {a.message && <p className="mt-1 line-clamp-2 text-sm text-ink-600">{a.message}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <a href={phoneHref(a.phone)} aria-label={`Appeler ${a.name}`} className="grid size-9 place-items-center rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50">
                    <Phone className="size-4" />
                  </a>
                  <a
                    href={whatsappLink(a.phone, `Bonjour ${a.name.split(' ')[0]}, c’est Progrès Habitat au sujet de votre visite du ${formatDate(asDate(a.preferred_date), { day: 'numeric', month: 'long', timeZone: 'UTC' })} à ${a.preferred_time}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Écrire à ${a.name} sur WhatsApp`}
                    className="grid size-9 place-items-center rounded-lg border border-ink-200 text-[#1aa851] hover:bg-ink-50"
                  >
                    <WhatsAppIcon className="size-4" />
                  </a>
                  <StatusSelect appointment={a} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {footer && <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white [&>div]:border-t-0">{footer}</div>}
    </div>
  );
}
