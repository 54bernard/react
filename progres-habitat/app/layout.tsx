import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';
import { Analytics } from '@/components/analytics/analytics';
import { isDemoMode, publicEnv } from '@/lib/env';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

const jakarta = localFont({
  src: [
    { path: './fonts/jakarta.woff2', weight: '200 800', style: 'normal' },
    { path: './fonts/jakarta-ext.woff2', weight: '200 800', style: 'normal' },
  ],
  variable: '--font-jakarta',
  display: 'swap',
});

const fraunces = localFont({
  src: './fonts/fraunces.woff2',
  weight: '100 900',
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: {
    default: 'Progrès Habitat — Terrains à vendre à Ouagadougou et Tenkodogo',
    template: '%s | Progrès Habitat',
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'terrain à vendre Ouagadougou',
    'parcelle à vendre Burkina Faso',
    'terrain Tenkodogo',
    'parcelle Saaba',
    'terrain Ouaga 2000',
    'ACD',
    'titre foncier',
    'paiement échelonné',
  ],
  authors: [{ name: siteConfig.name }],
  formatDetection: { telephone: true, address: false, email: false },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    images: [{ url: '/opengraph-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: [{ url: '/favicon-48.png', sizes: '48x48', type: 'image/png' }], apple: '/apple-icon.png' },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${fraunces.variable}`} data-demo={isDemoMode ? '' : undefined}>
      <body>
        {children}
        <Toaster position="top-center" richColors closeButton />
        <Analytics />
      </body>
    </html>
  );
}
