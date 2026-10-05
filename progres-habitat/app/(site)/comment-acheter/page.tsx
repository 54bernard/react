import Link from 'next/link';
import { FileText, Globe2, Wallet } from 'lucide-react';
import { CtaSection, PurchaseProcess } from '@/components/home/sections';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/misc';
import { legalLabels } from '@/lib/labels';
import { pageMetadata } from '@/lib/seo';
import { getSettings } from '@/services/content';
import { LEGAL_STATUSES } from '@/types';

export const metadata = pageMetadata({
  title: 'Comment acheter un terrain au Burkina Faso',
  description:
    'Les étapes pour acheter un terrain avec Progrès Habitat : visite, vérification des documents, réservation, paiement comptant ou échelonné et remise des documents officiels.',
  path: '/comment-acheter',
});

const legalExplanations: Record<(typeof LEGAL_STATUSES)[number], string> = {
  attestation_attribution: 'Document délivré lors de l’attribution d’une parcelle lotie. C’est la première étape vers l’ACD.',
  acd: 'Arrêté de Cession Définitive : il confirme la cession de la parcelle à votre nom et permet d’engager le titre foncier.',
  permis_urbain_habiter: 'Titre administratif d’occupation, à faire évoluer vers un titre foncier selon la zone.',
  titre_foncier: 'Le document le plus sécurisé : il établit un droit de propriété définitif et inattaquable.',
};

export default async function HowToBuyPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Comment acheter', path: '/comment-acheter' }]}
        eyebrow="Guide d’achat"
        title="Acheter un terrain, étape par étape"
        description="Un processus clair, des documents vérifiables et un conseiller à vos côtés du début à la fin."
      />
      <PurchaseProcess compact />

      <section className="container-page section-y" aria-labelledby="documents">
        <SectionHeading
          id="documents"
          eyebrow="Les documents fonciers"
          title="Comprendre le statut juridique d’un terrain"
          description="Du plus provisoire au plus sécurisé : ce que chaque document vous garantit."
        />
        <ol className="mt-14 grid border-t border-ink-950/[0.08] md:grid-cols-2 lg:mt-20">
          {LEGAL_STATUSES.map((status, i) => (
            <li
              key={status}
              className="flex gap-6 border-b border-ink-950/[0.08] py-10 md:odd:border-r md:odd:pr-10 md:even:pl-10 lg:py-12"
            >
              <span className="font-display text-2xl text-ink-300 tabular-nums" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-ink-950">
                  <FileText className="size-[18px] text-brand-700" strokeWidth={1.75} aria-hidden="true" />
                  {legalLabels[status]}
                </h3>
                <p className="mt-3 max-w-md leading-relaxed text-ink-500">{legalExplanations[status]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-ink-950/[0.06] bg-white" aria-label="Paiement et diaspora">
        <div className="container-page section-y grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-sand-100 p-8 sm:p-12">
            <Wallet className="size-6 text-brand-700" strokeWidth={1.6} aria-hidden="true" />
            <h2 className="text-h3 mt-8">Paiement comptant ou échelonné</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-600">
              Après un acompte, le solde peut être réparti en mensualités selon le terrain. Chaque versement donne lieu à
              un reçu. Paiement par Orange Money, Moov Money, virement bancaire ou en agence.
            </p>
          </div>
          <div className="rounded-3xl bg-ink-950 p-8 text-white sm:p-12">
            <Globe2 className="size-6 text-brand-300" strokeWidth={1.6} aria-hidden="true" />
            <h2 className="text-h3 mt-8 text-white">Vous vivez à l’étranger ?</h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/65">
              Visite en vidéo, échanges sur WhatsApp, signature à distance et envoi des documents : la diaspora peut
              acheter en toute sérénité.
            </p>
            <Button asChild variant="light" className="mt-8">
              <Link href="/contact">Parler à un conseiller</Link>
            </Button>
          </div>
        </div>
      </section>

      <CtaSection whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}
