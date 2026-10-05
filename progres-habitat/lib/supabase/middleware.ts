import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isDemoAdminAllowed, isSupabaseConfigured, publicEnv } from '@/lib/env';

const LOGIN_PATH = '/admin/connexion';

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = '';
  if (request.nextUrl.pathname !== '/admin') url.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

/**
 * Protège toutes les routes /admin (hors page de connexion) et rafraîchit la session Supabase.
 * Les pages et Server Actions revérifient ensuite le rôle administrateur côté serveur.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith('/admin') && pathname !== LOGIN_PATH;
  let response = NextResponse.next({ request });
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');

  if (!isSupabaseConfigured) {
    return isProtected && !isDemoAdminAllowed() ? redirectToLogin(request) : response;
  }

  const supabase = createServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() vérifie le jeton auprès de Supabase (contrairement à getSession()).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtected && !user) return redirectToLogin(request);
  return response;
}
