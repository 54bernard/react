import { AdminShell } from '@/components/admin/admin-shell';
import { getAdminContext, requireAdminPage } from '@/lib/auth';
import { getMenuBadges } from '@/services/admin';

// Toujours rendu à la demande : contenu privé, jamais mis en cache.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { supabase, role, isDemo } = await requireAdminPage();
  const ctx = await getAdminContext();
  const badges = await getMenuBadges(supabase);

  return (
    <AdminShell email={ctx.mode === 'live' ? (ctx.user.email ?? null) : null} role={role} isDemo={isDemo} badges={badges}>
      {children}
    </AdminShell>
  );
}
