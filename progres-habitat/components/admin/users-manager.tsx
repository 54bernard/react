'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { grantAdminAccess, revokeAdminAccess } from '@/app/admin/actions';
import { td, th } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { Field, Input, Select } from '@/components/ui/form-controls';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { formatDate } from '@/lib/utils';
import { grantAdminSchema, type GrantAdminValues } from '@/schemas/property';
import type { AdminUser } from '@/types';

function GrantForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GrantAdminValues>({ resolver: zodResolver(grantAdminSchema), defaultValues: { role: 'editor' } });

  const onSubmit = handleSubmit(async (values) => {
    const res = await grantAdminAccess(values);
    if (!res.ok) return void toast.error(res.error);
    toast.success(res.message);
    router.refresh();
    onDone();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 p-5">
      <p className="rounded-xl bg-ink-50 p-3 text-sm text-ink-600">
        Le compte doit d’abord exister dans Supabase (<em>Authentication → Users → Add user</em>). Indiquez ensuite son e-mail pour lui donner accès.
      </p>
      <Field label="E-mail du compte" htmlFor="u-email" error={errors.email?.message}>
        <Input id="u-email" type="email" autoComplete="off" {...register('email')} />
      </Field>
      <Field label="Rôle" htmlFor="u-role" hint="Un éditeur gère le contenu ; seul un administrateur gère les accès.">
        <Select id="u-role" {...register('role')}>
          <option value="editor">Éditeur</option>
          <option value="admin">Administrateur</option>
        </Select>
      </Field>
      <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <UserPlus />} Donner l’accès
      </Button>
    </form>
  );
}

export function UsersManager({ users, canManage, currentUserId }: { users: AdminUser[]; canManage: boolean; currentUserId: string | null }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [adding, setAdding] = useState(false);
  const [pending, start] = useTransition();

  return (
    <>
      {canManage && (
        <div className="mb-4 flex justify-end">
          <Button size="sm" className="rounded-xl" onClick={() => setAdding(true)}>
            <UserPlus /> Ajouter un utilisateur
          </Button>
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead className="border-b border-ink-100">
              <tr>
                <th scope="col" className={th}>Utilisateur</th>
                <th scope="col" className={th}>Rôle</th>
                <th scope="col" className={th}>Dernière connexion</th>
                <th scope="col" className={th}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-full bg-sand-100 text-sm font-semibold text-ink-700" aria-hidden="true">
                        {u.email.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium text-ink-950">
                        {u.email}
                        {u.user_id === currentUserId && <span className="ml-2 text-xs font-normal text-ink-500">(vous)</span>}
                      </span>
                    </div>
                  </td>
                  <td className={td}>
                    <Badge variant={u.role === 'admin' ? 'brand' : 'outline'}>
                      {u.role === 'admin' && <ShieldCheck aria-hidden="true" />}
                      {u.role === 'admin' ? 'Administrateur' : 'Éditeur'}
                    </Badge>
                  </td>
                  <td className={`${td} text-ink-500`}>
                    {u.last_sign_in_at ? formatDate(u.last_sign_in_at, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Jamais'}
                  </td>
                  <td className={`${td} text-right`}>
                    {canManage && u.user_id !== currentUserId && (
                      <Button
                        variant="danger-ghost"
                        size="sm"
                        className="rounded-lg"
                        disabled={pending}
                        onClick={async () => {
                          const ok = await confirm({
                            title: `Retirer l’accès de ${u.email} ?`,
                            description: 'Le compte ne pourra plus accéder à l’administration. Il n’est pas supprimé de Supabase.',
                            confirmLabel: 'Retirer l’accès',
                          });
                          if (!ok) return;
                          start(async () => {
                            const res = await revokeAdminAccess(u.user_id);
                            if (res.ok) toast.success(res.message);
                            else toast.error(res.error);
                            router.refresh();
                          });
                        }}
                      >
                        <Trash2 /> Retirer
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Sheet open={adding} onOpenChange={setAdding}>
        {adding && (
          <SheetContent title="Ajouter un utilisateur" description="Accès au back-office">
            <GrantForm onDone={() => setAdding(false)} />
          </SheetContent>
        )}
      </Sheet>
    </>
  );
}
