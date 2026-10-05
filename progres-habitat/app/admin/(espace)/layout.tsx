import { ShieldX } from 'lucide-react';
import { signOut } from '@/app/admin/actions';
import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { getAdminContext } from '@/lib/auth';
import { getDashboardStats } from '@/services/admin';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getAdminContext();

  if (ctx.mode === 'forbidden') {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-red-50 text-red-600">
          <ShieldX className="size-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold">Accès refusé</h1>
        <p className="mt-2 max-w-md text-ink-500">
          Le compte {ctx.email} n’a pas les droits d’administration. Demandez à un administrateur de l’ajouter dans la table{' '}
          <code className="rounded bg-ink-100 px-1">admins</code>.
        </p>
        <form action={signOut} className="mt-8">
          <Button type="submit" variant="outline">
            Se déconnecter
          </Button>
        </form>
      </main>
    );
  }

  const supabase = ctx.mode === 'live' ? ctx.supabase : null;
  const stats = await getDashboardStats(supabase);

  return (
    <AdminShell
      email={ctx.mode === 'live' ? (ctx.user.email ?? null) : null}
      isDemo={ctx.mode === 'demo'}
      badges={{ '/admin/demandes': stats.newLeads, '/admin/rendez-vous': stats.pendingAppointments }}
    >
      {children}
    </AdminShell>
  );
}
