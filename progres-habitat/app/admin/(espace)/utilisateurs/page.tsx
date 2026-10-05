import { UsersManager } from '@/components/admin/users-manager';
import { AdminPageHeader } from '@/components/admin/ui';
import { getAdminContext, requireAdminPage } from '@/lib/auth';
import { listAdminUsers } from '@/services/admin';

export const metadata = { title: 'Utilisateurs' };

export default async function UsersPage() {
  const { supabase, role, isDemo } = await requireAdminPage();
  const ctx = await getAdminContext();
  const users = await listAdminUsers(supabase);
  return (
    <>
      <AdminPageHeader
        title="Utilisateurs"
        description={role === 'admin' ? 'Comptes ayant accès au back-office et leur rôle.' : 'Seuls les administrateurs peuvent gérer les accès.'}
      />
      <UsersManager users={users} canManage={role === 'admin' && !isDemo} currentUserId={ctx.mode === 'live' ? ctx.user.id : null} />
    </>
  );
}
