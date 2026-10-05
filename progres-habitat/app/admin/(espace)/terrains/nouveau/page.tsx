import { PropertyForm } from '@/components/admin/property-form';
import { AdminPageHeader } from '@/components/admin/ui';
import { getAdminContext } from '@/lib/auth';
import { getLocations } from '@/services/properties';

export const metadata = { title: 'Nouveau terrain' };

export default async function NewPropertyPage() {
  const [ctx, locations] = await Promise.all([getAdminContext(), getLocations()]);
  return (
    <>
      <AdminPageHeader title="Nouveau terrain" description="Renseignez les informations puis enregistrez. Vous pourrez prévisualiser avant de publier." />
      <PropertyForm locations={locations} isDemo={ctx.mode !== 'live'} />
    </>
  );
}
