import type { SiteSettings } from '@/types';

/**
 * Valeurs par défaut de l'entreprise. En production, elles peuvent être
 * surchargées par la ligne unique de la table `settings` dans Supabase.
 */
export const defaultSettings: SiteSettings = {
  company_name: 'Progrès Habitat',
  tagline: 'Bâtissons votre avenir ensemble',
  phone: '+226 67 98 57 54',
  whatsapp: '22667985754',
  email: null,
  address: 'Dassasgho, Ouagadougou, Burkina Faso',
  city: 'Ouagadougou',
  country: 'Burkina Faso',
  opening_hours: null,
  facebook_url: 'https://www.facebook.com/share/19aSfUwzeb/',
  instagram_url: null,
  tiktok_url: null,
  linkedin_url: null,
  key_figures: [],
  founded_year: 2025,
};

export const siteConfig = {
  name: 'Progrès Habitat',
  shortName: 'Progrès Habitat',
  description:
    'Terrains et parcelles vérifiés à vendre à Ouagadougou et Tenkodogo : documents officiels, visites accompagnées et paiement échelonné. Progrès Habitat, BTP & génie civil.',
  locale: 'fr_BF',
  currency: 'XOF',
  currencyLabel: 'FCFA',
  countryCode: 'BF',
  themeColor: '#1e846f',
  /** Coordonnées du bureau (Dassasgho, Ouagadougou). */
  office: { latitude: 12.3762, longitude: -1.4825 },
  mapCenter: { latitude: 12.3714, longitude: -1.5197 },
  nav: [
    { href: '/', label: 'Accueil' },
    { href: '/terrains', label: 'Terrains' },
    { href: '/zones', label: 'Nos zones' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/comment-acheter', label: 'Comment acheter' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/mentions-legales', label: 'Mentions légales' },
    { href: '/confidentialite', label: 'Politique de confidentialité' },
    { href: '/conditions-generales', label: 'Conditions générales' },
  ],
  pageSize: 9,
} as const;
