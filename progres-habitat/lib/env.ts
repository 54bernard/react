/** Variables publiques (exposées au navigateur). Ne jamais y placer de secret. */
export const publicEnv = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
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
