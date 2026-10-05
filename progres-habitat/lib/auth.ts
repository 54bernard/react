import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/lib/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AdminContext =
  | { mode: 'demo' }
  | { mode: 'live'; supabase: SupabaseClient; user: User; role: 'admin' | 'editor' };

/**
 * Vérifie côté serveur que l'utilisateur connecté est administrateur.
 * Le middleware redirige déjà les visiteurs non connectés ; cette vérification
 * protège chaque page et chaque Server Action (défense en profondeur, en plus des règles RLS).
 */
export const getAdminContext = cache(async (): Promise<AdminContext | { mode: 'forbidden'; email: string | null }> => {
  if (!isSupabaseConfigured) return { mode: 'demo' };
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/connexion');
  const { data: admin } = await supabase.from('admins').select('role').eq('user_id', user.id).maybeSingle();
  if (!admin) return { mode: 'forbidden', email: user.email ?? null };
  return { mode: 'live', supabase, user, role: admin.role as 'admin' | 'editor' };
});

/** Pour les Server Actions : renvoie le client Supabase ou un message d'erreur. */
export async function requireAdminForAction(): Promise<{ supabase: SupabaseClient } | { error: string }> {
  const ctx = await getAdminContext();
  if (ctx.mode === 'demo') return { error: 'Mode démonstration : connectez Supabase pour enregistrer des modifications.' };
  if (ctx.mode === 'forbidden') return { error: 'Accès refusé : votre compte n’est pas administrateur.' };
  return { supabase: ctx.supabase };
}
