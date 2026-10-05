import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { createClient as createPlainClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { isSupabaseConfigured, publicEnv } from '@/lib/env';

/** Client lié à la session de l'utilisateur (cookies) — pour l'administration et les Server Actions. */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured) throw new Error('Supabase n’est pas configuré.');
  const cookieStore = await cookies();
  return createServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Appel depuis un Server Component : le middleware se charge de rafraîchir la session.
        }
      },
    },
  });
}

/**
 * Client anonyme sans cookies — pour les lectures publiques mises en cache
 * (pages statiques/ISR, sitemap). Soumis aux règles RLS publiques.
 */
export function createSupabasePublicClient() {
  if (!isSupabaseConfigured) throw new Error('Supabase n’est pas configuré.');
  return createPlainClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
