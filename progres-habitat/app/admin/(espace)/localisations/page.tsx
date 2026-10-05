import { LocationsManager } from '@/components/admin/locations-manager';
import { AdminPageHeader } from '@/components/admin/ui';
import { requireAdminPage } from '@/lib/auth';
import { listAdminLocations } from '@/services/admin';

export const metadata = { title: 'Localisations' };

export default async function LocationsPage() {
  const { supabase } = await requireAdminPage();
  const items = await listAdminLocations(supabase);
  return (
    <>
      <AdminPageHeader title="Localisations" description="Zones utilisées dans le catalogue, les filtres et la page « Nos zones »." />
      <LocationsManager items={items} />
    </>
  );
}
