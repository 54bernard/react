import { TestimonialsManager } from '@/components/admin/testimonials-manager';
import { AdminPageHeader } from '@/components/admin/ui';
import { getAdminContext } from '@/lib/auth';
import { listAdminTestimonials } from '@/services/admin';

export const metadata = { title: 'Témoignages' };

export default async function TestimonialsPage() {
  const ctx = await getAdminContext();
  const items = await listAdminTestimonials(ctx.mode === 'live' ? ctx.supabase : null);
  return (
    <>
      <AdminPageHeader title="Témoignages" description="Avis clients affichés sur la page d’accueil (uniquement ceux marqués « publiés »)." />
      <TestimonialsManager items={items} />
    </>
  );
}
