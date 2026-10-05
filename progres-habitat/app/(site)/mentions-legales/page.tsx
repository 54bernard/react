import { LegalPage } from '@/components/layout/legal-page';
import { publicEnv } from '@/lib/env';
import { pageMetadata } from '@/lib/seo';
import { getSettings } from '@/services/content';

export const metadata = pageMetadata({
  title: 'Mentions légales',
  description: 'Mentions légales du site Progrès Habitat.',
  path: '/mentions-legales',
});

export default async function LegalNoticePage() {
  const s = await getSettings();
  return (
    <LegalPage
      title="Mentions légales"
      path="/mentions-legales"
      updated="1er octobre 2026"
      sections={[
        {
          title: 'Éditeur du site',
          body: (
            <>
              <p>
                Le site {publicEnv.siteUrl} est édité par <strong>{s.company_name}</strong>, entreprise de BTP, génie civil
                et vente de terrains, dont le siège est situé : {s.address}.
              </p>
              <p>
                Téléphone : {s.phone}
                {s.email ? ` — E-mail : ${s.email}` : ''}. Les numéros d’immatriculation (RCCM) et d’identification
                fiscale (IFU) sont communiqués sur simple demande.
              </p>
            </>
          ),
        },
        {
          title: 'Hébergement',
          body: <p>Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Les données sont stockées par Supabase Inc.</p>,
        },
        {
          title: 'Informations publiées',
          body: (
            <p>
              Les informations relatives aux terrains (prix, superficies, statuts, documents) sont fournies à titre indicatif
              et peuvent évoluer. Seuls le contrat signé et les documents officiels remis lors de la vente font foi. Les
              plans et visuels sont non contractuels.
            </p>
          ),
        },
        {
          title: 'Propriété intellectuelle',
          body: (
            <p>
              L’ensemble des contenus du site (textes, logo, photographies, mise en page) est la propriété de {s.company_name}{' '}
              ou de ses partenaires. Toute reproduction sans autorisation écrite préalable est interdite.
            </p>
          ),
        },
      ]}
    />
  );
}
