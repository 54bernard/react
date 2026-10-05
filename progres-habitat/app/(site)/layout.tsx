import { FloatingWhatsApp, OfflineBanner } from '@/components/layout/banners';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { JsonLd } from '@/components/seo/json-ld';
import { isDemoMode } from '@/lib/env';
import { organizationJsonLd } from '@/lib/seo';
import { getSettings } from '@/services/content';
import { getLocations } from '@/services/properties';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, zones] = await Promise.all([getSettings(), getLocations()]);
  return (
    <>
      <JsonLd data={organizationJsonLd(settings)} />
      <Header phone={settings.phone} whatsapp={settings.whatsapp} isDemo={isDemoMode} />
      <main id="contenu">{children}</main>
      <Footer settings={settings} zones={zones} />
      <FloatingWhatsApp whatsapp={settings.whatsapp} />
      <OfflineBanner />
    </>
  );
}
