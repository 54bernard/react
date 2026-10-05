'use server';

import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { recordPropertyView } from '@/services/properties';

/** Comptabilise une vue d'annonce (une par visiteur et par terrain toutes les 30 minutes). */
export async function trackPropertyView(slug: string): Promise<void> {
  if (!/^[a-z0-9-]{3,120}$/.test(slug)) return;
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnu';
  const ua = h.get('user-agent') ?? '';
  if (/bot|crawl|spider|preview/i.test(ua)) return;
  const { allowed } = rateLimit(`vue:${ip}:${slug}`, 1, 30 * 60 * 1000);
  if (allowed) await recordPropertyView(slug);
}
