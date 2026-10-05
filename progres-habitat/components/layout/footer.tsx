import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { FacebookIcon, InstagramIcon, LinkedinIcon, TiktokIcon, WhatsAppIcon } from '@/components/layout/whatsapp-icon';
import { siteConfig } from '@/lib/site-config';
import { phoneHref, whatsappLink } from '@/lib/whatsapp';
import type { Location, SiteSettings } from '@/types';

const linkClass = 'text-[15px] text-white/65 transition-colors duration-300 hover:text-white';

export function Footer({ settings, zones }: { settings: SiteSettings; zones: Location[] }) {
  const socials = [
    { href: settings.facebook_url, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.instagram_url, label: 'Instagram', Icon: InstagramIcon },
    { href: settings.tiktok_url, label: 'TikTok', Icon: TiktokIcon },
    { href: settings.linkedin_url, label: 'LinkedIn', Icon: LinkedinIcon },
  ].filter((s): s is { href: string; label: string; Icon: typeof FacebookIcon } => Boolean(s.href));

  return (
    <footer className="bg-ink-950 text-white" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Pied de page
      </h2>

      <div className="container-page grid gap-10 border-b border-white/10 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:py-24">
        <p className="max-w-xl text-h2 !text-white">{settings.tagline}.</p>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <a
            href={whatsappLink(settings.whatsapp, 'Bonjour Progrès Habitat !')}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-ink-950 transition-colors hover:bg-sand-100"
          >
            <WhatsAppIcon className="size-4" /> Écrire sur WhatsApp
          </a>
          <a
            href={phoneHref(settings.phone)}
            className="inline-flex h-13 items-center justify-center rounded-full border border-white/25 px-7 text-[15px] font-semibold text-white transition-colors hover:border-white"
          >
            {settings.phone}
          </a>
        </div>
      </div>

      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:py-20">
        <div className="max-w-xs">
          <Logo tone="light" />
          <p className="mt-6 text-[15px] leading-relaxed text-white/60">
            Terrains vérifiés à Ouagadougou et Tenkodogo, accompagnement juridique et construction par nos équipes BTP.
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
                    className="grid size-10 place-items-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-white hover:text-white"
                  >
                    <Icon className="size-[17px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Navigation du pied de page">
          <h3 className="text-[12px] font-semibold tracking-[0.12em] text-white/45 uppercase">Navigation</h3>
          <ul className="mt-5 space-y-3">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-[12px] font-semibold tracking-[0.12em] text-white/45 uppercase">Nos zones</h3>
          <ul className="mt-5 space-y-3">
            {zones.slice(0, 6).map((zone) => (
              <li key={zone.id}>
                <Link href={`/terrains?zone=${zone.slug}`} className={linkClass}>
                  Terrains à {zone.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <address className="not-italic">
          <h3 className="text-[12px] font-semibold tracking-[0.12em] text-white/45 uppercase">Contact</h3>
          <ul className="mt-5 space-y-3 text-[15px] text-white/65">
            <li>
              <a href={phoneHref(settings.phone)} className={linkClass}>
                {settings.phone}
              </a>
            </li>
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className={`${linkClass} break-all`}>
                  {settings.email}
                </a>
              </li>
            )}
            <li>{settings.address}</li>
            {settings.opening_hours && <li>{settings.opening_hours}</li>}
            <li>
              <Link href="/contact" className="group inline-flex items-center gap-1 font-medium text-white">
                <span className="link-underline">Nous rendre visite</span>
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-7 text-[13px] text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.company_name}. Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
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
