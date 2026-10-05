import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Progrès Habitat — Terrains au Burkina Faso',
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#fbfaf7',
    theme_color: siteConfig.themeColor,
    lang: 'fr',
    categories: ['business', 'lifestyle'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Voir les terrains', url: '/terrains' },
      { name: 'Carte des terrains', url: '/terrains?vue=carte' },
      { name: 'Contact', url: '/contact' },
    ],
  };
}
