import Link from 'next/link';
import { FileText, Globe2, Wallet } from 'lucide-react';
import { CtaSection, PurchaseProcess } from '@/components/home/sections';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
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

      <section className="container-page py-16 lg:py-24" aria-labelledby="documents">
        <p className="eyebrow mb-3">Les documents fonciers</p>
        <h2 id="documents" className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Comprendre le statut juridique d’un terrain
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {LEGAL_STATUSES.map((status) => (
            <li key={status} className="rounded-3xl border border-ink-100 bg-white p-7">
              <FileText className="size-6 text-brand-600" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold">{legalLabels[status]}</h3>
              <p className="mt-2 leading-relaxed text-ink-500">{legalExplanations[status]}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-ink-100 bg-white py-16 lg:py-24" aria-label="Paiement et diaspora">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-sand-100 p-8 sm:p-10">
            <Wallet className="size-8 text-brand-700" aria-hidden="true" />
            <h2 className="mt-6 font-display text-2xl font-medium">Paiement comptant ou échelonné</h2>
            <p className="mt-4 leading-relaxed text-ink-600">
              Après un acompte, le solde peut être réparti en mensualités selon le terrain. Chaque versement donne lieu à
              un reçu. Paiement par Orange Money, Moov Money, virement bancaire ou en agence.
            </p>
          </div>
          <div className="rounded-3xl bg-brand-800 p-8 text-white sm:p-10">
            <Globe2 className="size-8 text-brand-200" aria-hidden="true" />
            <h2 className="mt-6 font-display text-2xl font-medium text-white">Vous vivez à l’étranger ?</h2>
            <p className="mt-4 leading-relaxed text-white/80">
              Visite en vidéo, échanges sur WhatsApp, signature à distance et envoi des documents : la diaspora peut
              acheter en toute sérénité.
            </p>
            <Button asChild variant="light" className="mt-6">
              <Link href="/contact">Parler à un conseiller</Link>
            </Button>
          </div>
        </div>
      </section>

      <CtaSection whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}
