import { SettingsForm } from '@/components/admin/settings-form';
import { AdminPageHeader } from '@/components/admin/ui';
import { getSettings } from '@/services/content';

export const metadata = { title: 'Paramètres' };

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <AdminPageHeader title="Paramètres" description="Coordonnées, réseaux sociaux et chiffres clés affichés sur le site." />
      <SettingsForm settings={settings} />
    </>
  );
}
