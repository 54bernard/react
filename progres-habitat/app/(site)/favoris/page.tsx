import { FavoritesList } from '@/components/property/favorites-list';
import { PageHeader } from '@/components/layout/page-header';
import { pageMetadata } from '@/lib/seo';
import { listAllMatching } from '@/services/properties';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Mes terrains favoris',
  description: 'Retrouvez les terrains que vous avez enregistrés.',
  path: '/favoris',
  noIndex: true,
});

export default async function FavoritesPage() {
  const all = await listAllMatching({});
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Mes favoris', path: '/favoris' }]}
        title="Mes terrains favoris"
        description="Vos favoris sont enregistrés sur cet appareil."
      />
      <section className="container-page py-14 lg:py-24">
        <FavoritesList properties={all} />
      </section>
    </>
  );
}
