import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { FacebookIcon, InstagramIcon, LinkedinIcon, TiktokIcon, WhatsAppIcon } from '@/components/layout/whatsapp-icon';
import { siteConfig } from '@/lib/site-config';
import { phoneHref, whatsappLink } from '@/lib/whatsapp';
import type { Location, SiteSettings } from '@/types';

export function Footer({ settings, zones }: { settings: SiteSettings; zones: Location[] }) {
  const socials = [
    { href: settings.facebook_url, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.instagram_url, label: 'Instagram', Icon: InstagramIcon },
    { href: settings.tiktok_url, label: 'TikTok', Icon: TiktokIcon },
    { href: settings.linkedin_url, label: 'LinkedIn', Icon: LinkedinIcon },
  ].filter((s): s is { href: string; label: string; Icon: typeof FacebookIcon } => Boolean(s.href));

  return (
    <footer className="border-t border-ink-100 bg-white" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Pied de page
      </h2>
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:py-20">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 leading-relaxed text-ink-500">
            {settings.tagline}. Terrains vérifiés à {zones.length > 0 ? 'Ouagadougou et Tenkodogo' : settings.city},
            accompagnement juridique et construction par nos équipes BTP.
          </p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2" aria-label="Réseaux sociaux">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-ink-200 text-ink-600 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Navigation du pied de page">
          <h3 className="text-sm font-semibold tracking-wide text-ink-900">Navigation</h3>
          <ul className="mt-5 space-y-3">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-500 transition hover:text-brand-700">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-ink-900">Nos zones</h3>
          <ul className="mt-5 space-y-3">
            {zones.slice(0, 6).map((zone) => (
              <li key={zone.id}>
                <Link href={`/terrains?zone=${zone.slug}`} className="text-ink-500 transition hover:text-brand-700">
                  Terrains à {zone.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <address className="not-italic">
          <h3 className="text-sm font-semibold tracking-wide text-ink-900">Contact</h3>
          <ul className="mt-5 space-y-4 text-ink-600">
            <li>
              <a href={phoneHref(settings.phone)} className="flex items-start gap-3 transition hover:text-brand-700">
                <Phone className="mt-0.5 size-4.5 shrink-0 text-brand-600" aria-hidden="true" />
                {settings.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(settings.whatsapp, 'Bonjour Progrès Habitat !')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition hover:text-brand-700"
              >
                <WhatsAppIcon className="mt-0.5 size-4.5 shrink-0 text-brand-600" />
                WhatsApp
              </a>
            </li>
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-start gap-3 break-all transition hover:text-brand-700">
                  <Mail className="mt-0.5 size-4.5 shrink-0 text-brand-600" aria-hidden="true" />
                  {settings.email}
                </a>
              </li>
            )}
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4.5 shrink-0 text-brand-600" aria-hidden="true" />
              {settings.address}
            </li>
            {settings.opening_hours && (
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4.5 shrink-0 text-brand-600" aria-hidden="true" />
                {settings.opening_hours}
              </li>
            )}
          </ul>
        </address>
      </div>

      <div className="border-t border-ink-100">
        <div className="container-page flex flex-col gap-4 py-6 text-sm text-ink-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.company_name}. Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-ink-900">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
