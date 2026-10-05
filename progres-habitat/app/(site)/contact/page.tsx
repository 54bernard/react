import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/forms/contact-form';
import { PageHeader } from '@/components/layout/page-header';
import { FacebookIcon, WhatsAppIcon } from '@/components/layout/whatsapp-icon';
import { pageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';
import { phoneHref, whatsappLink } from '@/lib/whatsapp';
import { getSettings } from '@/services/content';
import { listAllMatching } from '@/services/properties';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Contact — parlez à un conseiller',
  description:
    'Contactez Progrès Habitat à Dassasgho, Ouagadougou : téléphone, WhatsApp, formulaire. Un conseiller vous répond rapidement pour organiser votre visite.',
  path: '/contact',
});

export default async function ContactPage() {
  const [settings, available] = await Promise.all([getSettings(), listAllMatching({ statut: 'disponible' })]);
  const { latitude, longitude } = siteConfig.office;
  const mapSrc = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&hl=fr&output=embed`;

  const channels = [
    { icon: Phone, label: 'Téléphone', value: settings.phone, href: phoneHref(settings.phone) },
    {
      icon: WhatsAppIcon,
      label: 'WhatsApp',
      value: 'Écrire un message',
      href: whatsappLink(settings.whatsapp, 'Bonjour Progrès Habitat !'),
      external: true,
    },
    ...(settings.email ? [{ icon: Mail, label: 'E-mail', value: settings.email, href: `mailto:${settings.email}` }] : []),
    ...(settings.facebook_url
      ? [{ icon: FacebookIcon, label: 'Facebook', value: settings.company_name, href: settings.facebook_url, external: true }]
      : []),
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Contact', path: '/contact' }]}
        eyebrow="Contact"
        title="Parlons de votre projet"
        description="Une question, une visite à organiser, un devis de construction ? Nous vous répondons rapidement."
      />
      <section className="container-page grid gap-10 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-20">
        <div className="space-y-6">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex h-full items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 transition hover:border-brand-300 hover:shadow-soft"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-ink-500">{label}</span>
                    <span className="block truncate font-semibold text-ink-900">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-ink-100 bg-white p-5">
            <p className="flex items-start gap-3 text-ink-700">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
              <span>
                <strong className="block font-semibold text-ink-900">Bureau</strong>
                {settings.address}
              </span>
            </p>
            <p className="mt-4 flex items-start gap-3 text-ink-700">
              <Clock className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
              <span>
                <strong className="block font-semibold text-ink-900">Horaires</strong>
                {settings.opening_hours ?? 'Sur rendez-vous — contactez-nous par téléphone ou WhatsApp.'}
              </span>
            </p>
          </div>

          <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-ink-100 bg-sand-100">
            <iframe
              title={`Plan d’accès — ${settings.company_name}`}
              src={mapSrc}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div>
          <h2 className="sr-only">Formulaire de contact</h2>
          <ContactForm properties={available.map((p) => ({ id: p.id, label: `${p.reference} — ${p.title}` }))} />
        </div>
      </section>
    </>
  );
}
