import { z } from 'zod';
import {
  APPOINTMENT_STATUSES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  LEGAL_STATUSES,
  NEARBY_TYPES,
  PAYMENT_OPTIONS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
} from '@/types';

const text = (max: number) => z.string().trim().max(max);
const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => (v ? v : null));

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;
export const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024;

export const imageInputSchema = z.object({
  // Identifiants vérifiés (UUID) côté serveur ; souples ici pour l'aperçu en mode démonstration
  id: z.string().min(1).max(64).optional(),
  url: z.string().url().or(z.string().startsWith('/')),
  storage_path: z.string().max(300).nullish(),
  alt: nullableText(200),
  is_main: z.boolean(),
});

export const documentInputSchema = z.object({
  name: text(140).min(2, 'Nom du document requis.'),
  doc_type: z.enum([...LEGAL_STATUSES, 'plan', 'autre']),
  file_url: nullableText(500),
  is_available: z.boolean(),
});

export const nearbyInputSchema = z.object({
  type: z.enum(NEARBY_TYPES),
  name: text(120).min(2, 'Nom requis.'),
  distance_m: z.coerce.number().int().min(0).max(100_000),
});

export const propertyFormSchema = z
  .object({
    id: z.string().min(1).max(64),
    title: text(140).min(5, 'Le titre doit contenir au moins 5 caractères.'),
    slug: text(120)
      .min(3, 'Slug requis.')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Uniquement lettres minuscules, chiffres et tirets.'),
    reference: text(30).min(3, 'Référence requise.'),
    description: text(5000).min(30, 'Décrivez le terrain (30 caractères minimum).'),
    location_id: z.string().uuid().nullish().or(z.literal('').transform(() => null)),
    city: text(80).min(2, 'Ville requise.'),
    district: text(120).min(2, 'Quartier requis.'),
    address: nullableText(200),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    price: z.coerce.number().int().min(0, 'Prix invalide.').max(100_000_000_000),
    surface: z.coerce.number().int().min(1, 'Superficie invalide.').max(100_000_000),
    type: z.enum(PROPERTY_TYPES),
    status: z.enum(PROPERTY_STATUSES),
    payment_options: z.array(z.enum(PAYMENT_OPTIONS)).min(1, 'Choisissez au moins un mode de paiement.'),
    installment_months: z.coerce.number().int().min(1).max(120).nullish().or(z.literal('').transform(() => null)),
    legal_status: z.enum(LEGAL_STATUSES),
    road_access: nullableText(160),
    has_water: z.boolean(),
    has_electricity: z.boolean(),
    distance_to_paved_road_m: z.coerce.number().int().min(0).max(100_000).nullish().or(z.literal('').transform(() => null)),
    topography: nullableText(160),
    amenities: z.array(text(60).min(1)).max(20),
    nearby: z.array(nearbyInputSchema).max(20),
    documents: z.array(documentInputSchema).max(20),
    images: z.array(imageInputSchema).max(30),
    cadastral_plan_url: nullableText(500),
    seo_title: nullableText(70),
    seo_description: nullableText(170),
    is_featured: z.boolean(),
    publication: z.enum(['brouillon', 'publie', 'archive']),
  })
  .refine((v) => !v.payment_options.includes('echelonne') || (v.installment_months ?? 0) > 0, {
    path: ['installment_months'],
    message: 'Indiquez la durée maximale du paiement échelonné.',
  });

export type PropertyFormValues = z.input<typeof propertyFormSchema>;
export type PropertyFormOutput = z.output<typeof propertyFormSchema>;

export const leadUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
  notes: nullableText(4000),
  follow_up_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullish()
    .or(z.literal('').transform(() => null)),
});

export const leadCreateSchema = z.object({
  name: text(120).min(2, 'Nom requis.'),
  phone: text(30).regex(/^\+?[0-9\s().-]{6,20}$/, 'Numéro invalide.'),
  email: z.string().trim().email('E-mail invalide.').optional().or(z.literal('').transform(() => undefined)),
  property_id: z.string().uuid().nullish().or(z.literal('').transform(() => null)),
  source: z.enum(LEAD_SOURCES),
  message: nullableText(2000),
  follow_up_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullish()
    .or(z.literal('').transform(() => null)),
});
export type LeadCreateValues = z.input<typeof leadCreateSchema>;

export const appointmentUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(APPOINTMENT_STATUSES),
});

export const testimonialSchema = z.object({
  name: text(120).min(2, 'Nom requis.'),
  content: text(1000).min(10, 'Témoignage trop court.'),
  property_label: nullableText(140),
  photo_url: nullableText(500),
  rating: z.coerce.number().int().min(1).max(5),
  is_published: z.boolean(),
});
export type TestimonialValues = z.input<typeof testimonialSchema>;

export const settingsSchema = z.object({
  company_name: text(120).min(2),
  tagline: text(160).min(2),
  phone: text(30).min(6),
  whatsapp: text(20).regex(/^\d{8,15}$/, 'Numéro international sans + ni espaces (ex. 22670000000).'),
  email: z.string().trim().email('E-mail invalide.').nullish().or(z.literal('').transform(() => null)),
  address: text(200).min(5),
  city: text(80).min(2),
  country: text(80).min(2),
  opening_hours: nullableText(200),
  facebook_url: z.string().trim().url('URL invalide.').nullish().or(z.literal('').transform(() => null)),
  instagram_url: z.string().trim().url('URL invalide.').nullish().or(z.literal('').transform(() => null)),
  tiktok_url: z.string().trim().url('URL invalide.').nullish().or(z.literal('').transform(() => null)),
  linkedin_url: z.string().trim().url('URL invalide.').nullish().or(z.literal('').transform(() => null)),
  founded_year: z.coerce.number().int().min(1950).max(2100).nullish().or(z.literal('').transform(() => null)),
  key_figures: z
    .array(
      z.object({
        label: text(60).min(2),
        value: z.coerce.number().int().min(0).max(1_000_000),
        prefix: text(10).optional(),
        suffix: text(10).optional(),
      }),
    )
    .max(4),
});
export type SettingsValues = z.input<typeof settingsSchema>;

export const locationSchema = z.object({
  name: text(80).min(2, 'Nom requis.'),
  slug: text(80)
    .min(2, 'Slug requis.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Uniquement lettres minuscules, chiffres et tirets.'),
  city: text(80).min(2, 'Ville requise.'),
  description: nullableText(400),
  image_url: nullableText(500),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});
export type LocationValues = z.input<typeof locationSchema>;

export const faqSchema = z.object({
  question: text(200).min(5, 'Question trop courte.'),
  answer: text(2000).min(10, 'Réponse trop courte.'),
  position: z.coerce.number().int().min(0).max(1000),
  is_published: z.boolean(),
});
export type FaqValues = z.input<typeof faqSchema>;

export const grantAdminSchema = z.object({
  email: z.string().trim().email('Adresse e-mail invalide.'),
  role: z.enum(['admin', 'editor']),
});
export type GrantAdminValues = z.input<typeof grantAdminSchema>;
