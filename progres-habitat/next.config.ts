import type { NextConfig } from 'next';

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Le projet peut vivre dans un sous-dossier d'un dépôt plus large : on fixe la racine de traçage.
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  // Métadonnées rendues dans <head> pour tous les agents (pas de « streaming metadata »)
  htmlLimitedBots: /.*/,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 768, 1024, 1280, 1536, 1920],
    remotePatterns: [
      ...(supabaseHost ? [{ protocol: 'https' as const, hostname: supabaseHost }] : []),
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async redirects() {
    return [
      { source: '/admin/demandes', destination: '/admin/clients', permanent: true },
      { source: '/admin/rendez-vous', destination: '/admin/visites', permanent: true },
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
