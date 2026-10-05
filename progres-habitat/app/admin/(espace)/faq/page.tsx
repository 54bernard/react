import { FaqManager } from '@/components/admin/faq-manager';
import { AdminPageHeader } from '@/components/admin/ui';
import { requireAdminPage } from '@/lib/auth';
import { listAdminFaq } from '@/services/admin';

export const metadata = { title: 'FAQ' };

export default async function FaqAdminPage() {
  const { supabase } = await requireAdminPage();
  const items = await listAdminFaq(supabase);
  return (
    <>
      <AdminPageHeader title="FAQ" description="Questions affichées sur l’accueil et la page FAQ (données structurées FAQPage incluses)." />
      <FaqManager items={items} />
    </>
  );
}
