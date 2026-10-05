import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyDetail } from '@/components/property/property-detail';
import { JsonLd } from '@/components/seo/json-ld';
import { publicEnv } from '@/lib/env';
import { pageMetadata, propertyJsonLd, propertyTitle } from '@/lib/seo';
import { formatPrice, formatSurface } from '@/lib/utils';
import { getSettings } from '@/services/content';
import { getAllPublishedSlugs, getPropertyBySlug, getSimilarProperties } from '@/services/properties';

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: 'Terrain introuvable', robots: { index: false } };
  return pageMetadata({
    title: property.seo_title || propertyTitle(property),
    description:
      property.seo_description ||
      `${property.title} : ${formatSurface(property.surface)} à ${property.district}, ${property.city}, au prix de ${formatPrice(property.price)}. ${property.description.slice(0, 110)}…`,
    path: `/terrains/${property.slug}`,
    image: property.images[0]?.url,
  });
}

export default async function PropertyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const [settings, similar] = await Promise.all([getSettings(), getSimilarProperties(property, 3)]);
  const pageUrl = `${publicEnv.siteUrl}/terrains/${property.slug}`;

  return (
    <>
      <JsonLd data={propertyJsonLd(property, settings)} />
      <PropertyDetail property={property} settings={settings} similar={similar} pageUrl={pageUrl} />
    </>
  );
}
