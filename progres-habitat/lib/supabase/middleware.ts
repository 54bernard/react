import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured, publicEnv } from '@/lib/env';

/** Rafraîchit la session Supabase et protège les routes /admin. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/connexion');

  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/connexion';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
