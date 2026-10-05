import { LegalPage } from '@/components/layout/legal-page';
import { pageMetadata } from '@/lib/seo';
import { getSettings } from '@/services/content';

export const metadata = pageMetadata({
  title: 'Conditions générales',
  description: 'Conditions générales d’utilisation du site et de réservation des terrains Progrès Habitat.',
  path: '/conditions-generales',
});

export default async function TermsPage() {
  const s = await getSettings();
  return (
    <LegalPage
      title="Conditions générales"
      path="/conditions-generales"
      updated="1er octobre 2026"
      sections={[
        {
          title: 'Objet',
          body: (
            <p>
              Les présentes conditions encadrent l’utilisation du site et les demandes d’information, de visite et de
              réservation des terrains proposés par {s.company_name}.
            </p>
          ),
        },
        {
          title: 'Annonces',
          body: (
            <p>
              Les annonces sont publiées de bonne foi et mises à jour régulièrement. Le statut affiché (disponible, réservé,
              vendu) est indicatif jusqu’à confirmation écrite par un conseiller.
            </p>
          ),
        },
        {
          title: 'Réservation et paiement',
          body: (
            <>
              <p>
                La réservation d’un terrain intervient après visite, vérification des documents et signature d’un contrat de
                réservation, accompagnée du versement d’un acompte dont le montant est précisé au contrat.
              </p>
              <p>
                En cas de paiement échelonné, l’échéancier figure au contrat. Chaque versement donne lieu à un reçu. Les
                modalités en cas de retard ou de désistement sont précisées dans le contrat signé.
              </p>
            </>
          ),
        },
        {
          title: 'Frais annexes',
          body: (
            <p>
              Les frais de mutation, de notaire, de bornage et les taxes administratives ne sont pas inclus dans le prix
              affiché, sauf mention contraire. Une estimation écrite vous est remise avant toute réservation.
            </p>
          ),
        },
        {
          title: 'Responsabilité',
          body: (
            <p>
              {s.company_name} s’efforce d’assurer l’exactitude des informations publiées mais ne saurait être tenue
              responsable d’une erreur matérielle. Seuls le contrat et les documents officiels font foi.
            </p>
          ),
        },
      ]}
    />
  );
}
