import Link from 'next/link';
import { FaqList } from '@/components/home/faq-list';
import { PageHeader } from '@/components/layout/page-header';
import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
import { faqJsonLd, pageMetadata } from '@/lib/seo';
import { getFaq } from '@/services/content';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Questions fréquentes sur l’achat de terrain',
  description:
    'Documents fournis, paiement échelonné, visites, vérification de la propriété, frais à prévoir : toutes les réponses pour acheter votre terrain sereinement.',
  path: '/faq',
});

export default async function FaqPage() {
  const faq = await getFaq();
  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <PageHeader
        breadcrumbs={[{ name: 'FAQ', path: '/faq' }]}
        eyebrow="FAQ"
        title="Questions fréquentes"
        description="Tout ce qu’il faut savoir avant d’acheter votre terrain."
      />
      <section className="container-page max-w-4xl py-14 lg:py-20">
        <FaqList items={faq} />
        <div className="mt-12 rounded-3xl bg-sand-100 p-8 text-center">
          <h2 className="font-display text-2xl font-medium">Vous n’avez pas trouvé votre réponse ?</h2>
          <p className="mt-2 text-ink-500">Un conseiller vous répond rapidement par téléphone ou WhatsApp.</p>
          <Button asChild className="mt-6">
            <Link href="/contact">Poser ma question</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
