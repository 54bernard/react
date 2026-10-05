import { LegalPage } from '@/components/layout/legal-page';
import { pageMetadata } from '@/lib/seo';
import { getSettings } from '@/services/content';

export const metadata = pageMetadata({
  title: 'Politique de confidentialité',
  description: 'Comment Progrès Habitat collecte, utilise et protège vos données personnelles.',
  path: '/confidentialite',
});

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <LegalPage
      title="Politique de confidentialité"
      path="/confidentialite"
      updated="1er octobre 2026"
      sections={[
        {
          title: 'Données collectées',
          body: (
            <p>
              Lorsque vous remplissez un formulaire (contact, demande de visite), nous collectons votre nom, votre numéro de
              téléphone, votre adresse e-mail (facultative), le terrain concerné et votre message. Vos terrains favoris sont
              enregistrés sur votre appareil ; un identifiant anonyme peut être utilisé pour établir des statistiques.
            </p>
          ),
        },
        {
          title: 'Utilisation',
          body: (
            <p>
              Ces données servent uniquement à répondre à votre demande, organiser vos visites et assurer le suivi de votre
              projet. Elles ne sont ni vendues ni cédées à des tiers.
            </p>
          ),
        },
        {
          title: 'Conservation et sécurité',
          body: (
            <p>
              Les données sont conservées au maximum trois ans après notre dernier échange. Elles sont stockées de manière
              sécurisée et ne sont accessibles qu’aux membres habilités de notre équipe.
            </p>
          ),
        },
        {
          title: 'Mesure d’audience',
          body: (
            <p>
              Le site peut utiliser Google Analytics et le pixel Meta afin de mesurer sa fréquentation et l’efficacité de nos
              campagnes. Ces outils déposent des traceurs ; vous pouvez les bloquer depuis les réglages de votre navigateur.
            </p>
          ),
        },
        {
          title: 'Vos droits',
          body: (
            <p>
              Conformément à la loi n° 001-2021/AN portant protection des personnes à l’égard du traitement des données à
              caractère personnel au Burkina Faso, vous pouvez demander l’accès, la rectification ou la suppression de vos
              données en nous contactant au {s.phone}
              {s.email ? ` ou à ${s.email}` : ''}.
            </p>
          ),
        },
      ]}
    />
  );
}
