import { ZoneCard } from '@/components/home/sections';
import { PageHeader } from '@/components/layout/page-header';
import { Reveal } from '@/components/ui/reveal';
import { pageMetadata } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';
import { getLocationsWithStats } from '@/services/properties';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Nos zones : terrains à Ouagadougou et Tenkodogo',
  description:
    'Ouaga 2000, Saaba, Komsilga, Dassasgho, Pabré, Tenkodogo : découvrez nos zones, le nombre de terrains disponibles et les prix moyens.',
  path: '/zones',
});

export default async function ZonesPage() {
  const zones = await getLocationsWithStats();
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Nos zones', path: '/zones' }]}
        eyebrow="Nos zones"
        title="Des quartiers choisis pour leur potentiel"
        description="Nous sélectionnons des zones en développement, bien desservies et aux documents vérifiables. Choisissez une zone pour voir ses terrains."
      />
      <section className="container-page py-14 lg:py-20" aria-labelledby="liste-zones">
        <h2 id="liste-zones" className="sr-only">
          Liste des zones
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone, i) => (
            <Reveal as="li" key={zone.id} delay={(i % 3) * 0.08}>
              <ZoneCard zone={zone} />
              {zone.description && <p className="mt-4 px-1 text-ink-500">{zone.description}</p>}
            </Reveal>
          ))}
        </ul>

        <div className="relative mt-16 overflow-x-auto rounded-3xl border border-ink-100 bg-white">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="px-6 pt-6 text-left font-display text-xl font-medium text-ink-900">Récapitulatif par zone</caption>
            <thead>
              <tr className="border-b border-ink-100 text-ink-500">
                <th scope="col" className="px-6 py-4 font-medium">Zone</th>
                <th scope="col" className="px-6 py-4 font-medium">Ville</th>
                <th scope="col" className="px-6 py-4 font-medium">Disponibles</th>
                <th scope="col" className="px-6 py-4 font-medium">Prix moyen</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z.id} className="border-b border-ink-100 last:border-0">
                  <th scope="row" className="px-6 py-4 font-semibold text-ink-900">{z.name}</th>
                  <td className="px-6 py-4 text-ink-600">{z.city}</td>
                  <td className="px-6 py-4 text-ink-600">
                    {z.available_count} / {z.property_count}
                  </td>
                  <td className="px-6 py-4 font-medium text-ink-900">{z.average_price ? formatPrice(z.average_price) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
