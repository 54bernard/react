import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { isDemoAdminAllowed, isSupabaseConfigured } from '@/lib/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AdminRole = 'admin' | 'editor';

export type AdminContext =
  | { mode: 'demo' }
  | { mode: 'live'; supabase: SupabaseClient; user: User; role: AdminRole }
  | { mode: 'forbidden'; email: string | null };

/**
 * Vérifie côté serveur que l'utilisateur connecté est administrateur.
 * Trois couches de protection : middleware (session), cette vérification sur chaque
 * page et chaque Server Action, puis les règles RLS de Supabase.
 *
 * Sans Supabase, l'administration n'est consultable (lecture seule, données d'exemple)
 * qu'en développement ou si ALLOW_DEMO_ADMIN=true ; sinon elle est fermée.
 */
export const getAdminContext = cache(async (): Promise<AdminContext> => {
  if (!isSupabaseConfigured) {
    if (isDemoAdminAllowed()) return { mode: 'demo' };
    redirect('/admin/connexion');
  }
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/connexion');
  const { data: admin } = await supabase.from('admins').select('role').eq('user_id', user.id).maybeSingle();
  if (!admin) return { mode: 'forbidden', email: user.email ?? null };
  return { mode: 'live', supabase, user, role: admin.role as AdminRole };
});

/** Pour les pages : client Supabase (ou null en démo) et rôle. Les comptes non autorisés sont renvoyés à la connexion. */
export async function requireAdminPage(): Promise<{ supabase: SupabaseClient | null; role: AdminRole; isDemo: boolean }> {
  const ctx = await getAdminContext();
  if (ctx.mode === 'forbidden') redirect('/admin/connexion?erreur=acces');
  if (ctx.mode === 'demo') return { supabase: null, role: 'admin', isDemo: true };
  return { supabase: ctx.supabase, role: ctx.role, isDemo: false };
}

/** Pour les Server Actions : renvoie le client Supabase ou un message d'erreur. */
export async function requireAdminForAction(): Promise<{ supabase: SupabaseClient; role: AdminRole } | { error: string }> {
  const ctx = await getAdminContext();
  if (ctx.mode === 'demo') return { error: 'Mode démonstration : connectez Supabase pour enregistrer des modifications.' };
  if (ctx.mode === 'forbidden') return { error: 'Accès refusé : votre compte n’est pas administrateur.' };
  return { supabase: ctx.supabase, role: ctx.role };
}
