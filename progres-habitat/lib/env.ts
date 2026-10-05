/**
 * URL publique du site : variable explicite, sinon domaine de production Vercel,
 * sinon URL du déploiement Vercel, sinon localhost (développement).
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const vercel = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`;
  return 'http://localhost:3000';
}

/** Variables publiques (exposées au navigateur). Ne jamais y placer de secret. */
export const publicEnv = {
  siteUrl: resolveSiteUrl(),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  googleMapsMapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || '',
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
} as const;

/** Vrai lorsque Supabase est configuré ; sinon le site tourne sur les données de démonstration. */
export const isSupabaseConfigured = Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
export const isDemoMode = !isSupabaseConfigured;

/**
 * Administration de démonstration (lecture seule, sans authentification possible) :
 * autorisée en développement, ou explicitement via ALLOW_DEMO_ADMIN=true. Lu à l'exécution, côté serveur.
 */
export function isDemoAdminAllowed(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEMO_ADMIN === 'true';
}
