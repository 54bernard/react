import type { Metadata } from 'next';
import { publicEnv } from '@/lib/env';
import { legalLabels, typeLabels } from '@/lib/labels';
import { siteConfig } from '@/lib/site-config';
import { absoluteUrl, formatSurface } from '@/lib/utils';
import type { FaqItem, PropertyWithRelations, SiteSettings } from '@/types';

const base = publicEnv.siteUrl;

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

export function pageMetadata({ title, description, path, image, noIndex }: PageMetaInput): Metadata {
  const url = absoluteUrl(path, base);
  const ogImage = image ? absoluteUrl(image, base) : absoluteUrl('/opengraph-image.jpg', base);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function propertyTitle(p: PropertyWithRelations): string {
  return `Terrain à vendre à ${p.district} – ${formatSurface(p.surface)}`;
}

export function organizationJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'RealEstateAgent'],
    '@id': `${base}/#organisation`,
    name: settings.company_name,
    slogan: settings.tagline,
    url: base,
    logo: absoluteUrl('/logo.png', base),
    image: absoluteUrl('/opengraph-image.jpg', base),
    telephone: settings.phone,
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.founded_year ? { foundingDate: String(settings.founded_year) } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.split(',')[0],
      addressLocality: settings.city,
      addressCountry: siteConfig.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.office.latitude,
      longitude: siteConfig.office.longitude,
    },
    areaServed: ['Ouagadougou', 'Tenkodogo', 'Burkina Faso'],
    sameAs: [settings.facebook_url, settings.instagram_url, settings.tiktok_url, settings.linkedin_url].filter(Boolean),
  };
}

export function propertyJsonLd(p: PropertyWithRelations, settings: SiteSettings) {
  const url = absoluteUrl(`/terrains/${p.slug}`, base);
  const availability =
    p.status === 'disponible'
      ? 'https://schema.org/InStock'
      : p.status === 'reserve'
        ? 'https://schema.org/LimitedAvailability'
        : 'https://schema.org/SoldOut';
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#annonce`,
    name: p.title,
    description: p.description,
    url,
    datePosted: p.created_at,
    dateModified: p.updated_at,
    image: p.images.map((img) => absoluteUrl(img.url, base)),
    about: {
      '@type': 'Place',
      name: `${p.district}, ${p.city}`,
      additionalType: `Terrain ${typeLabels[p.type].toLowerCase()}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: p.city,
        addressRegion: p.district,
        addressCountry: siteConfig.countryCode,
      },
      geo: { '@type': 'GeoCoordinates', latitude: p.latitude, longitude: p.longitude },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Superficie', value: p.surface, unitCode: 'MTK' },
        { '@type': 'PropertyValue', name: 'Statut juridique', value: legalLabels[p.legal_status] },
      ],
    },
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: siteConfig.currency,
      availability,
      url,
      seller: { '@id': `${base}/#organisation`, name: settings.company_name },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path, base),
    })),
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };
}

export function itemListJsonLd(properties: PropertyWithRelations[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: properties.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/terrains/${p.slug}`, base),
      name: p.title,
    })),
  };
}
