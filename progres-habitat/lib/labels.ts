import type {
  AppointmentStatus,
  LeadSource,
  LeadStatus,
  LegalStatus,
  NearbyType,
  PaymentOption,
  PropertyStatus,
  PropertyType,
} from '@/types';

export const statusLabels: Record<PropertyStatus, string> = {
  disponible: 'Disponible',
  reserve: 'Réservé',
  vendu: 'Vendu',
};

export const typeLabels: Record<PropertyType, string> = {
  residentiel: 'Résidentiel',
  commercial: 'Commercial',
  agricole: 'Agricole',
  industriel: 'Industriel',
  mixte: 'Mixte',
};

export const paymentLabels: Record<PaymentOption, string> = {
  comptant: 'Comptant',
  echelonne: 'Paiement échelonné',
};

export const legalLabels: Record<LegalStatus, string> = {
  attestation_attribution: "Attestation d'attribution",
  acd: 'Arrêté de Cession Définitive (ACD)',
  permis_urbain_habiter: "Permis Urbain d'Habiter (PUH)",
  titre_foncier: 'Titre foncier',
};

export const legalShortLabels: Record<LegalStatus, string> = {
  attestation_attribution: 'Attestation',
  acd: 'ACD',
  permis_urbain_habiter: 'PUH',
  titre_foncier: 'Titre foncier',
};

export const nearbyLabels: Record<NearbyType, string> = {
  ecole: 'École',
  commerce: 'Commerce',
  sante: 'Santé',
  route: 'Route principale',
  transport: 'Transport',
  lieu_culte: 'Lieu de culte',
};

export const leadSourceLabels: Record<LeadSource, string> = {
  site_formulaire: 'Formulaire du site',
  site_visite: 'Demande de visite (site)',
  whatsapp: 'WhatsApp',
  telephone: 'Téléphone',
  facebook: 'Facebook',
  bouche_a_oreille: 'Bouche-à-oreille',
  autre: 'Autre',
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  nouveau: 'Nouveau',
  contacte: 'Contacté',
  visite_planifiee: 'Visite planifiée',
  negociation: 'Négociation',
  gagne: 'Gagné',
  perdu: 'Perdu',
};

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  en_attente: 'En attente',
  confirme: 'Confirmé',
  effectue: 'Effectué',
  annule: 'Annulé',
};
