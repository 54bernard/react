import { PropertyForm } from '@/components/admin/property-form';
import { AdminPageHeader } from '@/components/admin/ui';
import { requireAdminPage } from '@/lib/auth';
import { publicEnv } from '@/lib/env';
import { listAdminLocations } from '@/services/admin';

export const metadata = { title: 'Nouveau terrain' };

export default async function NewPropertyPage() {
  const { supabase, isDemo } = await requireAdminPage();
  const locations = await listAdminLocations(supabase);
  return (
    <>
      <AdminPageHeader
        title="Nouveau terrain"
        description="Enregistrez d’abord en brouillon, prévisualisez, puis publiez."
        back={{ href: '/admin/terrains', label: 'Terrains' }}
      />
      <PropertyForm locations={locations} isDemo={isDemo} siteUrl={publicEnv.siteUrl} />
    </>
  );
}
