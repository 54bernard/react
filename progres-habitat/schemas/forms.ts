import { z } from 'zod';

const phoneRegex = /^\+?[0-9\s().-]{8,20}$/;

const name = z
  .string({ required_error: 'Votre nom est requis.' })
  .trim()
  .min(2, 'Votre nom doit contenir au moins 2 caractères.')
  .max(120, 'Nom trop long.');

const phone = z
  .string({ required_error: 'Votre numéro est requis.' })
  .trim()
  .regex(phoneRegex, 'Numéro de téléphone invalide (ex. +226 70 00 00 00).');

const email = z
  .string()
  .trim()
  .max(160)
  .email('Adresse e-mail invalide.')
  .optional()
  .or(z.literal('').transform(() => undefined));

const message = z.string().trim().max(2000, 'Message trop long (2 000 caractères maximum).').optional();

/** Champs anti-spam communs : piège invisible + horodatage d'ouverture du formulaire. */
export const antiSpamSchema = z.object({
  website: z.string().max(0).optional(),
  startedAt: z.coerce.number().int().positive(),
});

export const contactSchema = z.object({
  name,
  phone,
  email,
  subject: z.enum(['achat', 'visite', 'construction', 'diaspora', 'autre'], {
    errorMap: () => ({ message: 'Choisissez un objet.' }),
  }),
  propertyId: z.string().max(64).optional(),
  message: z.string().trim().min(10, 'Décrivez votre demande en quelques mots.').max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: 'Votre accord est nécessaire pour être recontacté.' }) }),
});
export type ContactInput = z.infer<typeof contactSchema>;

const todayIso = () => new Date().toISOString().slice(0, 10);

export const visitSchema = z.object({
  name,
  phone,
  email,
  propertyId: z.string().min(1, 'Choisissez un terrain.').max(64),
  date: z
    .string({ required_error: 'Choisissez une date.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide.')
    .refine((d) => d >= todayIso(), 'La date doit être aujourd’hui ou plus tard.'),
  time: z.enum(['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'], {
    errorMap: () => ({ message: 'Choisissez un créneau.' }),
  }),
  message,
  consent: z.literal(true, { errorMap: () => ({ message: 'Votre accord est nécessaire pour être recontacté.' }) }),
});
export type VisitInput = z.infer<typeof visitSchema>;

export const VISIT_TIMES = visitSchema.shape.time.options;

export const subjectLabels: Record<ContactInput['subject'], string> = {
  achat: 'Acheter un terrain',
  visite: 'Organiser une visite',
  construction: 'Construire sur mon terrain',
  diaspora: 'Achat depuis l’étranger',
  autre: 'Autre demande',
};
