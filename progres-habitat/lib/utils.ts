import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NBSP = /[  ]/g;

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value).replace(NBSP, ' ');
}

export function formatPrice(value: number): string {
  return `${formatNumber(value)} FCFA`;
}

/** Prix compact pour les marqueurs de carte : 7,5 M / 850 k. */
export function formatPriceShort(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${m.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M`;
  }
  if (value >= 1_000) return `${Math.round(value / 1_000)} k`;
  return String(value);
}

export function formatSurface(value: number): string {
  if (value >= 10_000) return `${(value / 10_000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ha`;
  return `${formatNumber(value)} m²`;
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`;
  return `${meters} m`;
}

export function formatDate(value: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('fr-FR', options ?? { day: 'numeric', month: 'long', year: 'numeric' });
}

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function pricePerSquareMeter(price: number, surface: number): number {
  return surface > 0 ? Math.round(price / surface) : 0;
}

/** Supprime balises HTML et caractères de contrôle d'une saisie utilisateur. */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

export function absoluteUrl(path: string, base: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
