import { AppointmentsList } from '@/components/admin/appointments-list';
import { AdminPageHeader, AdminPagination, SearchForm, TabLinks, Toolbar, listHref, pageParam } from '@/components/admin/ui';
import { requireAdminPage } from '@/lib/auth';
import { appointmentStatusLabels } from '@/lib/labels';
import { listAppointments } from '@/services/admin';
import { APPOINTMENT_STATUSES, type AppointmentStatus } from '@/types';

export const metadata = { title: 'Demandes de visite' };

type SP = Promise<{ statut?: string; periode?: string; q?: string; page?: string }>;

export default async function VisitsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const status = APPOINTMENT_STATUSES.includes(sp.statut as AppointmentStatus) ? (sp.statut as AppointmentStatus) : undefined;
  const periode = sp.periode === 'passees' ? 'passees' : 'a-venir';
  const q = sp.q?.slice(0, 60);
  const page = pageParam(sp.page);

  const { supabase } = await requireAdminPage();
  const result = await listAppointments(supabase, { status, periode, q, page });
  const base = { statut: status, periode: periode === 'passees' ? 'passees' : undefined, q };

  return (
    <>
      <AdminPageHeader title="Demandes de visite" description="Confirmez, réalisez ou annulez les visites demandées depuis le site." />
      <Toolbar>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <TabLinks
            label="Période"
            tabs={[
              { label: 'À venir', href: listHref('/admin/visites', { ...base, periode: undefined }), active: periode === 'a-venir' },
              { label: 'Passées', href: listHref('/admin/visites', { ...base, periode: 'passees' }), active: periode === 'passees' },
            ]}
          />
          <TabLinks
            label="Statut"
            tabs={[
              { label: 'Tous', href: listHref('/admin/visites', { ...base, statut: undefined }), active: !status },
              ...APPOINTMENT_STATUSES.map((s) => ({
                label: appointmentStatusLabels[s],
                href: listHref('/admin/visites', { ...base, statut: s }),
                active: status === s,
              })),
            ]}
          />
        </div>
        <SearchForm action="/admin/visites" defaultValue={q} placeholder="Nom ou téléphone…" hidden={{ statut: status, periode: base.periode }} />
      </Toolbar>
      <AppointmentsList
        appointments={result.items}
        footer={
          result.total > result.pageSize ? (
            <AdminPagination
              page={result.page}
              pageCount={result.pageCount}
              total={result.total}
              pageSize={result.pageSize}
              hrefFor={(p) => listHref('/admin/visites', { ...base, page: p })}
            />
          ) : undefined
        }
      />
    </>
  );
}
