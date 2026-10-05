import type { MetadataRoute } from 'next';
import { publicEnv } from '@/lib/env';
import { getAllPublishedSlugs, getLocations } from '@/services/properties';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.siteUrl;
  const [slugs, zones] = await Promise.all([getAllPublishedSlugs(), getLocations()]);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/terrains`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/zones`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/a-propos`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/comment-acheter`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/mentions-legales`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${base}/confidentialite`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${base}/conditions-generales`, changeFrequency: 'yearly', priority: 0.1 },
  ];

  return [
    ...staticPages,
    ...zones.map((z) => ({ url: `${base}/terrains?zone=${z.slug}`, changeFrequency: 'weekly' as const, priority: 0.6 })),
    ...slugs.map((s) => ({
      url: `${base}/terrains/${s.slug}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
