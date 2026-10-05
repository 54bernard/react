import type { Property } from '@/types';
import { formatPrice, formatSurface } from '@/lib/utils';

export function whatsappLink(number: string, message: string): string {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function propertyWhatsappMessage(
  property: Pick<Property, 'reference' | 'title' | 'district' | 'city' | 'price' | 'surface'>,
  pageUrl?: string,
): string {
  const lines = [
    `Bonjour, je suis intéressé(e) par le terrain ${property.reference} (${property.title}) situé à ${property.district}, ${property.city}, affiché à ${formatPrice(property.price)} pour ${formatSurface(property.surface)}.`,
    'Je souhaiterais obtenir davantage d’informations.',
  ];
  if (pageUrl) lines.push(pageUrl);
  return lines.join('\n');
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
