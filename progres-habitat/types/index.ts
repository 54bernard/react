export const PROPERTY_STATUSES = ['disponible', 'reserve', 'vendu'] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const PROPERTY_TYPES = ['residentiel', 'commercial', 'agricole', 'industriel', 'mixte'] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PAYMENT_OPTIONS = ['comptant', 'echelonne'] as const;
export type PaymentOption = (typeof PAYMENT_OPTIONS)[number];

export const LEGAL_STATUSES = ['attestation_attribution', 'acd', 'permis_urbain_habiter', 'titre_foncier'] as const;
export type LegalStatus = (typeof LEGAL_STATUSES)[number];

export const NEARBY_TYPES = ['ecole', 'commerce', 'sante', 'route', 'transport', 'lieu_culte'] as const;
export type NearbyType = (typeof NEARBY_TYPES)[number];

export const LEAD_SOURCES = ['site_formulaire', 'site_visite', 'whatsapp', 'telephone', 'facebook', 'bouche_a_oreille', 'autre'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_STATUSES = ['nouveau', 'contacte', 'visite_planifiee', 'negociation', 'gagne', 'perdu'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const APPOINTMENT_STATUSES = ['en_attente', 'confirme', 'effectue', 'annule'] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export interface NearbyPlace {
  type: NearbyType;
  name: string;
  distance_m: number;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  alt: string | null;
  position: number;
  is_main: boolean;
}

export interface PropertyDocument {
  id: string;
  property_id: string;
  name: string;
  doc_type: LegalStatus | 'plan' | 'autre';
  file_url: string | null;
  is_available: boolean;
}

export interface Location {
  id: string;
  slug: string;
  name: string;
  city: string;
  description: string | null;
  image_url: string | null;
  latitude: number;
  longitude: number;
}

export interface LocationWithStats extends Location {
  property_count: number;
  available_count: number;
  average_price: number | null;
}

export interface Property {
  id: string;
  slug: string;
  reference: string;
  title: string;
  description: string;
  location_id: string | null;
  city: string;
  district: string;
  address: string | null;
  latitude: number;
  longitude: number;
  price: number;
  surface: number;
  type: PropertyType;
  status: PropertyStatus;
  payment_options: PaymentOption[];
  installment_months: number | null;
  legal_status: LegalStatus;
  road_access: string | null;
  has_water: boolean;
  has_electricity: boolean;
  distance_to_paved_road_m: number | null;
  topography: string | null;
  nearby: NearbyPlace[];
  amenities: string[];
  cadastral_plan_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyWithRelations extends Property {
  images: PropertyImage[];
  documents: PropertyDocument[];
  location: Location | null;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  property_id: string | null;
  source: LeadSource;
  status: LeadStatus;
  message: string | null;
  notes: string | null;
  follow_up_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadWithProperty extends Lead {
  property: Pick<Property, 'id' | 'title' | 'reference' | 'slug'> | null;
}

export interface Appointment {
  id: string;
  lead_id: string | null;
  property_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  preferred_date: string;
  preferred_time: string;
  message: string | null;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithProperty extends Appointment {
  property: Pick<Property, 'id' | 'title' | 'reference' | 'slug'> | null;
}

export interface Testimonial {
  id: string;
  name: string;
  photo_url: string | null;
  content: string;
  property_label: string | null;
  rating: number;
  is_published: boolean;
  created_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  position: number;
  is_published: boolean;
}

export interface KeyFigure {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

export interface SiteSettings {
  company_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string | null;
  address: string;
  city: string;
  country: string;
  opening_hours: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  /** Chiffres saisis par l'administration (laisser vide pour n'afficher que les chiffres calculés). */
  key_figures: KeyFigure[];
  founded_year: number | null;
}

export type SortOption = 'recent' | 'prix-asc' | 'prix-desc' | 'surface-desc' | 'surface-asc';
export type ViewMode = 'grille' | 'liste' | 'carte';

export interface PropertyFilters {
  q?: string;
  ville?: string;
  quartier?: string;
  zone?: string;
  minPrice?: number;
  maxPrice?: number;
  minSurface?: number;
  maxSurface?: number;
  type?: PropertyType;
  statut?: PropertyStatus;
  paiement?: PaymentOption;
  sort?: SortOption;
  page?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface DashboardStats {
  available: number;
  reserved: number;
  sold: number;
  unpublished: number;
  leads: number;
  newLeads: number;
  appointments: number;
  pendingAppointments: number;
  totalViews: number;
  leadsBySource: { source: LeadSource; count: number }[];
  topProperties: Pick<Property, 'id' | 'title' | 'reference' | 'views_count' | 'status'>[];
  followUpsDue: number;
}

export type ActionResult<T = undefined> =
  | { ok: true; message?: string; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };
