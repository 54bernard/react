import 'server-only';
import { cache } from 'react';
import { isSupabaseConfigured } from '@/lib/env';
import { defaultSettings } from '@/lib/site-config';
import { createSupabasePublicClient } from '@/lib/supabase/server';
import { demoFaq, demoTestimonials } from '@/lib/data/demo';
import { listAllMatching, getLocations } from '@/services/properties';
import type { FaqItem, KeyFigure, SiteSettings, Testimonial } from '@/types';

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured) return defaultSettings;
  try {
    const supabase = createSupabasePublicClient();
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    if (!data) return defaultSettings;
    const merged = { ...defaultSettings } as SiteSettings;
    (Object.keys(defaultSettings) as (keyof SiteSettings)[]).forEach((key) => {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined && value !== null) (merged as unknown as Record<string, unknown>)[key] = value;
    });
    return merged;
  } catch {
    return defaultSettings;
  }
});

export const getFaq = cache(async (): Promise<FaqItem[]> => {
  if (!isSupabaseConfigured) return demoFaq;
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase.from('faq').select('*').eq('is_published', true).order('position');
  if (error) throw new Error(error.message);
  return (data ?? []) as FaqItem[];
});

/** Témoignages publiés. En mode démo, renvoie des exemples clairement identifiés comme tels. */
export async function getTestimonials(): Promise<{ items: Testimonial[]; isExample: boolean }> {
  if (!isSupabaseConfigured) return { items: demoTestimonials, isExample: true };
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(9);
  if (error) throw new Error(error.message);
  return { items: (data ?? []) as Testimonial[], isExample: false };
}

/**
 * Chiffres clés : ceux saisis par l'administration (table settings.key_figures)
 * sont affichés en priorité ; sinon, les chiffres sont calculés à partir des données réelles.
 */
export async function getKeyFigures(): Promise<KeyFigure[]> {
  const settings = await getSettings();
  if (settings.key_figures.length > 0) return settings.key_figures.slice(0, 4);

  const [all, locations] = await Promise.all([listAllMatching({}), getLocations()]);
  const available = all.filter((p) => p.status === 'disponible');
  const cities = new Set(all.map((p) => p.city));
  const withInstallments = available.filter((p) => p.payment_options.includes('echelonne'));
  const maxMonths = Math.max(0, ...available.map((p) => p.installment_months ?? 0));

  return [
    { label: 'Terrains disponibles', value: available.length },
    { label: 'Zones couvertes', value: locations.length },
    { label: cities.size > 1 ? 'Villes' : 'Ville', value: cities.size },
    maxMonths > 0
      ? { label: 'Mois de paiement échelonné', value: maxMonths, prefix: "jusqu'à " }
      : { label: 'Terrains payables en plusieurs fois', value: withInstallments.length },
  ];
}
