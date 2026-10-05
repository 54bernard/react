import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
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
      <section className="container-page grid gap-14 py-14 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-5">
          <h2 className="eyebrow mb-6">Nous joindre</h2>
          <ul className="divide-y divide-ink-950/[0.08] border-y border-ink-950/[0.08]">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-4 py-5"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-800 transition-colors duration-300 group-hover:border-ink-950 group-hover:bg-ink-950 group-hover:text-white">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] text-ink-500">{label}</span>
                    <span className="block truncate font-semibold text-ink-950">{value}</span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-ink-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-950"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>

          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-[18px] shrink-0 text-brand-700" aria-hidden="true" />
              <div>
                <dt className="font-semibold text-ink-950">Bureau</dt>
                <dd className="mt-1 leading-relaxed text-ink-600">{settings.address}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-[18px] shrink-0 text-brand-700" aria-hidden="true" />
              <div>
                <dt className="font-semibold text-ink-950">Horaires</dt>
                <dd className="mt-1 leading-relaxed text-ink-600">
                  {settings.opening_hours ?? 'Sur rendez-vous — contactez-nous par téléphone ou WhatsApp.'}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-10 aspect-[4/3] overflow-hidden rounded-3xl bg-sand-100">
            <iframe
              title={`Plan d’accès — ${settings.company_name}`}
              src={mapSrc}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white p-6 shadow-soft sm:p-10 lg:sticky lg:top-[calc(var(--header-offset)+2rem)]">
            <h2 className="text-h3">Écrivez-nous</h2>
            <p className="mt-2 mb-8 text-ink-500">Réponse sous 24 h ouvrées, souvent bien plus vite.</p>
          <ContactForm properties={available.map((p) => ({ id: p.id, label: `${p.reference} — ${p.title}` }))} />
          </div>
        </div>
      </section>
    </>
  );
}
