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
      <section className="container-page py-14 lg:py-24" aria-labelledby="liste-zones">
        <h2 id="liste-zones" className="sr-only">
          Liste des zones
        </h2>
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone, i) => (
            <Reveal as="li" key={zone.id} delay={(i % 3) * 0.08}>
              <ZoneCard zone={zone} />
              {zone.description && <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-500">{zone.description}</p>}
            </Reveal>
          ))}
        </ul>

        <div className="relative mt-20 overflow-x-auto lg:mt-28">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="text-h3 pb-8 text-left">Récapitulatif par zone</caption>
            <thead>
              <tr className="border-y border-ink-950/[0.08] text-xs tracking-[0.08em] text-ink-500 uppercase">
                <th scope="col" className="px-4 py-4 font-semibold first:pl-0">Zone</th>
                <th scope="col" className="px-4 py-4 font-semibold first:pl-0">Ville</th>
                <th scope="col" className="px-4 py-4 font-semibold first:pl-0">Disponibles</th>
                <th scope="col" className="px-4 py-4 font-semibold first:pl-0">Prix moyen</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z.id} className="border-b border-ink-950/[0.08] transition-colors hover:bg-white">
                  <th scope="row" className="py-5 pr-4 font-semibold text-ink-950">{z.name}</th>
                  <td className="px-4 py-5 text-ink-600">{z.city}</td>
                  <td className="px-4 py-5 text-ink-600 tabular-nums">
                    {z.available_count} / {z.property_count}
                  </td>
                  <td className="px-4 py-5 font-medium text-ink-950 tabular-nums">{z.average_price ? formatPrice(z.average_price) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
