/**
 * Données de démonstration — utilisées lorsque Supabase n'est pas configuré.
 * Elles servent à présenter la plateforme ; elles ne correspondent pas à de vraies offres.
 * Le fichier supabase/seed.sql reprend les mêmes zones et terrains.
 */
import type {
  FaqItem,
  Location,
  NearbyPlace,
  PaymentOption,
  PropertyDocument,
  PropertyImage,
  PropertyWithRelations,
  Testimonial,
} from '@/types';

export const demoLocations: Location[] = [
  {
    id: '6f1d1c4e-0001-4a5b-9c1d-000000000001',
    slug: 'ouaga-2000',
    name: 'Ouaga 2000',
    city: 'Ouagadougou',
    description: 'Quartier résidentiel haut de gamme au sud de la capitale, proche des institutions et des grands axes.',
    image_url: '/images/zones/ouaga-2000.webp',
    latitude: 12.3155,
    longitude: -1.4915,
  },
  {
    id: '6f1d1c4e-0001-4a5b-9c1d-000000000002',
    slug: 'saaba',
    name: 'Saaba',
    city: 'Ouagadougou',
    description: 'Commune en pleine expansion à l’est de Ouagadougou, idéale pour une première acquisition.',
    image_url: '/images/zones/saaba.webp',
    latitude: 12.3765,
    longitude: -1.4235,
  },
  {
    id: '6f1d1c4e-0001-4a5b-9c1d-000000000003',
    slug: 'komsilga',
    name: 'Komsilga',
    city: 'Ouagadougou',
    description: 'Zone calme au sud-ouest, appréciée pour ses grandes parcelles et ses prix accessibles.',
    image_url: '/images/zones/komsilga.webp',
    latitude: 12.2455,
    longitude: -1.5465,
  },
  {
    id: '6f1d1c4e-0001-4a5b-9c1d-000000000004',
    slug: 'dassasgho',
    name: 'Dassasgho',
    city: 'Ouagadougou',
    description: 'Quartier central et animé de l’est de la capitale, où se trouve notre bureau.',
    image_url: '/images/zones/dassasgho.webp',
    latitude: 12.3762,
    longitude: -1.4825,
  },
  {
    id: '6f1d1c4e-0001-4a5b-9c1d-000000000005',
    slug: 'pabre',
    name: 'Pabré',
    city: 'Ouagadougou',
    description: 'Commune verdoyante au nord, prisée pour les projets agricoles et les résidences secondaires.',
    image_url: '/images/zones/pabre.webp',
    latitude: 12.5215,
    longitude: -1.5785,
  },
  {
    id: '6f1d1c4e-0001-4a5b-9c1d-000000000006',
    slug: 'tenkodogo',
    name: 'Tenkodogo',
    city: 'Tenkodogo',
    description: 'Chef-lieu du Centre-Est, ville dynamique au fort potentiel de développement.',
    image_url: '/images/zones/tenkodogo.webp',
    latitude: 11.7801,
    longitude: -0.3697,
  },
];

const loc = (slug: string) => {
  const found = demoLocations.find((l) => l.slug === slug);
  if (!found) throw new Error(`Zone de démonstration inconnue : ${slug}`);
  return found;
};

interface DemoSeed {
  n: number;
  slug: string;
  title: string;
  zone: string;
  district: string;
  price: number;
  surface: number;
  type: PropertyWithRelations['type'];
  status: PropertyWithRelations['status'];
  payment: PaymentOption[];
  months: number | null;
  legal: PropertyWithRelations['legal_status'];
  road: string;
  water: boolean;
  electricity: boolean;
  paved: number;
  topography: string;
  nearby: NearbyPlace[];
  amenities: string[];
  featured: boolean;
  lat: number;
  lng: number;
  daysAgo: number;
  views: number;
  description: string;
}

const seeds: DemoSeed[] = [
  {
    n: 1,
    slug: 'terrain-residentiel-ouaga-2000-500-m2',
    title: 'Terrain résidentiel de 500 m² à Ouaga 2000',
    zone: 'ouaga-2000',
    district: 'Ouaga 2000 (extension sud)',
    price: 18_500_000,
    surface: 500,
    type: 'residentiel',
    status: 'disponible',
    payment: ['comptant', 'echelonne'],
    months: 12,
    legal: 'acd',
    road: 'Voie bitumée en façade',
    water: true,
    electricity: true,
    paved: 0,
    topography: 'Terrain plat, sol latéritique stable',
    nearby: [
      { type: 'ecole', name: 'Complexe scolaire international', distance_m: 650 },
      { type: 'commerce', name: 'Supermarché et pharmacie', distance_m: 900 },
      { type: 'route', name: 'Boulevard Mouammar Kadhafi', distance_m: 1200 },
    ],
    amenities: ['Parcelle d’angle', 'Quartier sécurisé', 'Voisinage résidentiel'],
    featured: true,
    lat: 12.3121,
    lng: -1.4878,
    daysAgo: 3,
    views: 412,
    description:
      'Belle parcelle d’angle dans l’extension sud de Ouaga 2000, au cœur d’un quartier résidentiel recherché. Bordée par une voie bitumée, elle est déjà raccordable à l’eau (ONEA) et à l’électricité (SONABEL). Idéale pour une villa familiale avec jardin ou un petit immeuble résidentiel.',
  },
  {
    n: 2,
    slug: 'parcelle-saaba-300-m2-wend-panga',
    title: 'Parcelle de 300 m² à Saaba — Cité Wend-Panga',
    zone: 'saaba',
    district: 'Saaba, secteur 3',
    price: 3_500_000,
    surface: 300,
    type: 'residentiel',
    status: 'disponible',
    payment: ['comptant', 'echelonne'],
    months: 18,
    legal: 'attestation_attribution',
    road: 'Voie latéritique carrossable',
    water: true,
    electricity: true,
    paved: 450,
    topography: 'Terrain plat',
    nearby: [
      { type: 'ecole', name: 'École primaire publique', distance_m: 300 },
      { type: 'commerce', name: 'Marché de Saaba', distance_m: 1500 },
      { type: 'route', name: 'Route nationale 4', distance_m: 450 },
    ],
    amenities: ['Zone lotie', 'Bornage effectué', 'Proche des commodités'],
    featured: true,
    lat: 12.3791,
    lng: -1.4192,
    daysAgo: 6,
    views: 638,
    description:
      'Parcelle de 300 m² dans la cité Wend-Panga à Saaba, zone lotie en plein développement. Accès facile depuis la RN4, école à proximité immédiate. Une excellente opportunité pour une première acquisition, avec un paiement échelonné jusqu’à 18 mois.',
  },
  {
    n: 3,
    slug: 'terrain-komsilga-400-m2-jardins',
    title: 'Terrain de 400 m² — Les Jardins de Komsilga',
    zone: 'komsilga',
    district: 'Komsilga, Les Jardins',
    price: 4_200_000,
    surface: 400,
    type: 'residentiel',
    status: 'disponible',
    payment: ['comptant', 'echelonne'],
    months: 24,
    legal: 'attestation_attribution',
    road: 'Voies tracées et latéritées',
    water: false,
    electricity: true,
    paved: 1200,
    topography: 'Légère pente, bon drainage naturel',
    nearby: [
      { type: 'ecole', name: 'CEG de Komsilga', distance_m: 1100 },
      { type: 'sante', name: 'CSPS', distance_m: 1400 },
      { type: 'route', name: 'Route de Léo', distance_m: 1200 },
    ],
    amenities: ['Environnement calme', 'Arbres existants', 'Grand voisinage vert'],
    featured: true,
    lat: 12.2489,
    lng: -1.5512,
    daysAgo: 10,
    views: 287,
    description:
      'Grande parcelle de 400 m² dans un environnement calme et verdoyant, à quelques minutes de la route de Léo. Les voies sont tracées et l’électricité arrive en bordure de site. Idéale pour une maison familiale avec jardin.',
  },
  {
    n: 4,
    slug: 'parcelle-commerciale-dassasgho-600-m2',
    title: 'Parcelle commerciale de 600 m² à Dassasgho',
    zone: 'dassasgho',
    district: 'Dassasgho, axe principal',
    price: 32_000_000,
    surface: 600,
    type: 'commercial',
    status: 'disponible',
    payment: ['comptant'],
    months: null,
    legal: 'titre_foncier',
    road: 'Façade sur voie bitumée très passante',
    water: true,
    electricity: true,
    paved: 0,
    topography: 'Terrain plat, viabilisé',
    nearby: [
      { type: 'commerce', name: 'Marché de Dassasgho', distance_m: 400 },
      { type: 'transport', name: 'Arrêt de bus SOTRACO', distance_m: 150 },
      { type: 'sante', name: 'Clinique privée', distance_m: 700 },
    ],
    amenities: ['Forte visibilité', 'Idéal commerce ou bureaux', 'Titre foncier'],
    featured: true,
    lat: 12.3741,
    lng: -1.4803,
    daysAgo: 2,
    views: 521,
    description:
      'Parcelle commerciale avec titre foncier, située sur un axe très passant de Dassasgho. Sa façade sur voie bitumée offre une excellente visibilité pour un commerce, une agence, des bureaux ou un immeuble à usage mixte.',
  },
  {
    n: 5,
    slug: 'domaine-agricole-pabre-1-hectare',
    title: 'Domaine agricole d’un hectare à Pabré',
    zone: 'pabre',
    district: 'Pabré, route de Kongoussi',
    price: 12_000_000,
    surface: 10_000,
    type: 'agricole',
    status: 'disponible',
    payment: ['comptant', 'echelonne'],
    months: 12,
    legal: 'attestation_attribution',
    road: 'Piste rurale praticable toute l’année',
    water: true,
    electricity: false,
    paved: 2500,
    topography: 'Terrain plat, sol fertile, forage possible',
    nearby: [
      { type: 'route', name: 'Route de Kongoussi', distance_m: 2500 },
      { type: 'commerce', name: 'Marché de Pabré', distance_m: 3000 },
    ],
    amenities: ['Sol fertile', 'Puits existant', 'Idéal maraîchage ou verger'],
    featured: false,
    lat: 12.5291,
    lng: -1.5873,
    daysAgo: 21,
    views: 143,
    description:
      'Domaine d’un hectare à Pabré, au sol fertile et doté d’un puits. Parfait pour un projet de maraîchage, de verger ou d’élevage, à moins de 40 minutes du centre de Ouagadougou.',
  },
  {
    n: 6,
    slug: 'parcelle-tenkodogo-300-m2-secteur-5',
    title: 'Parcelle de 300 m² à Tenkodogo — secteur 5',
    zone: 'tenkodogo',
    district: 'Tenkodogo, secteur 5',
    price: 2_300_000,
    surface: 300,
    type: 'residentiel',
    status: 'disponible',
    payment: ['comptant', 'echelonne'],
    months: 12,
    legal: 'attestation_attribution',
    road: 'Voie latéritique',
    water: true,
    electricity: true,
    paved: 600,
    topography: 'Terrain plat',
    nearby: [
      { type: 'commerce', name: 'Grand marché de Tenkodogo', distance_m: 1300 },
      { type: 'ecole', name: 'Lycée provincial', distance_m: 900 },
      { type: 'route', name: 'Route nationale 16', distance_m: 600 },
    ],
    amenities: ['Prix accessible', 'Quartier en développement'],
    featured: true,
    lat: 11.7843,
    lng: -0.3648,
    daysAgo: 8,
    views: 199,
    description:
      'Parcelle de 300 m² dans le secteur 5 de Tenkodogo, quartier résidentiel en développement proche du lycée provincial et du grand marché. Eau et électricité disponibles dans la rue.',
  },
  {
    n: 7,
    slug: 'terrain-tenkodogo-500-m2-zoungrana',
    title: 'Terrain de 500 m² — Domaine Zoungrana, Tenkodogo',
    zone: 'tenkodogo',
    district: 'Tenkodogo, secteur 3',
    price: 4_800_000,
    surface: 500,
    type: 'residentiel',
    status: 'reserve',
    payment: ['comptant', 'echelonne'],
    months: 12,
    legal: 'acd',
    road: 'Voie bitumée à 100 m',
    water: true,
    electricity: true,
    paved: 100,
    topography: 'Terrain plat',
    nearby: [
      { type: 'sante', name: 'Centre hospitalier régional', distance_m: 1500 },
      { type: 'ecole', name: 'École privée', distance_m: 500 },
    ],
    amenities: ['Idéal villa', 'Quartier résidentiel calme'],
    featured: false,
    lat: 11.7768,
    lng: -0.3751,
    daysAgo: 30,
    views: 256,
    description:
      'Grande parcelle de 500 m² avec ACD, dans un quartier résidentiel calme de Tenkodogo, à 100 m d’une voie bitumée. Actuellement réservée : contactez-nous pour être informé si elle redevient disponible.',
  },
  {
    n: 8,
    slug: 'parcelle-saaba-250-m2-premiere-acquisition',
    title: 'Parcelle de 250 m² à Saaba — idéale première acquisition',
    zone: 'saaba',
    district: 'Saaba, secteur 6',
    price: 2_700_000,
    surface: 250,
    type: 'residentiel',
    status: 'disponible',
    payment: ['echelonne'],
    months: 24,
    legal: 'attestation_attribution',
    road: 'Voie latéritique',
    water: false,
    electricity: true,
    paved: 900,
    topography: 'Terrain plat',
    nearby: [
      { type: 'ecole', name: 'École primaire', distance_m: 600 },
      { type: 'lieu_culte', name: 'Église et mosquée', distance_m: 400 },
    ],
    amenities: ['Mensualités accessibles', 'Bornage effectué'],
    featured: true,
    lat: 12.3712,
    lng: -1.4124,
    daysAgo: 14,
    views: 344,
    description:
      'Parcelle de 250 m² à Saaba, accessible avec un paiement échelonné jusqu’à 24 mois. Parfaite pour construire progressivement votre maison.',
  },
  {
    n: 9,
    slug: 'terrain-mixte-ouaga-2000-800-m2',
    title: 'Terrain mixte de 800 m² à Ouaga 2000',
    zone: 'ouaga-2000',
    district: 'Ouaga 2000, zone mixte',
    price: 36_000_000,
    surface: 800,
    type: 'mixte',
    status: 'vendu',
    payment: ['comptant'],
    months: null,
    legal: 'titre_foncier',
    road: 'Double façade bitumée',
    water: true,
    electricity: true,
    paved: 0,
    topography: 'Terrain plat, viabilisé',
    nearby: [
      { type: 'commerce', name: 'Centre commercial', distance_m: 500 },
      { type: 'route', name: 'Échangeur de Ouaga 2000', distance_m: 1500 },
    ],
    amenities: ['Double façade', 'Usage résidentiel et commercial'],
    featured: false,
    lat: 12.3189,
    lng: -1.4987,
    daysAgo: 60,
    views: 702,
    description:
      'Terrain à double façade bitumée, adapté à un projet résidentiel et commercial. Ce terrain a été vendu ; d’autres opportunités similaires sont disponibles sur demande.',
  },
  {
    n: 10,
    slug: 'terrain-komsilga-2-hectares-agricole',
    title: 'Terrain agricole de 2 hectares à Komsilga',
    zone: 'komsilga',
    district: 'Komsilga, zone rurale',
    price: 18_000_000,
    surface: 20_000,
    type: 'agricole',
    status: 'disponible',
    payment: ['comptant', 'echelonne'],
    months: 18,
    legal: 'attestation_attribution',
    road: 'Piste rurale',
    water: false,
    electricity: false,
    paved: 3500,
    topography: 'Terrain légèrement vallonné',
    nearby: [{ type: 'route', name: 'Route de Léo', distance_m: 3500 }],
    amenities: ['Grande superficie', 'Projet agricole ou ferme'],
    featured: false,
    lat: 12.2271,
    lng: -1.5689,
    daysAgo: 40,
    views: 88,
    description:
      'Deux hectares à Komsilga pour un projet agricole, une ferme avicole ou un investissement foncier de long terme.',
  },
  {
    n: 11,
    slug: 'parcelle-industrielle-saaba-2000-m2',
    title: 'Parcelle industrielle de 2 000 m² à Saaba',
    zone: 'saaba',
    district: 'Saaba, zone d’activités',
    price: 22_000_000,
    surface: 2_000,
    type: 'industriel',
    status: 'reserve',
    payment: ['comptant'],
    months: null,
    legal: 'acd',
    road: 'Accès poids lourds',
    water: true,
    electricity: true,
    paved: 300,
    topography: 'Terrain plat, remblayé',
    nearby: [{ type: 'route', name: 'Route nationale 4', distance_m: 300 }],
    amenities: ['Accès poids lourds', 'Triphasé disponible'],
    featured: false,
    lat: 12.3654,
    lng: -1.4302,
    daysAgo: 25,
    views: 167,
    description:
      'Parcelle de 2 000 m² en zone d’activités, accessible aux poids lourds et proche de la RN4. Adaptée à un entrepôt, un atelier ou une unité de transformation.',
  },
  {
    n: 12,
    slug: 'parcelle-dassasgho-300-m2-centre',
    title: 'Parcelle de 300 m² au centre de Dassasgho',
    zone: 'dassasgho',
    district: 'Dassasgho, secteur 28',
    price: 9_500_000,
    surface: 300,
    type: 'residentiel',
    status: 'vendu',
    payment: ['comptant', 'echelonne'],
    months: 6,
    legal: 'acd',
    road: 'Voie latéritique, bitume à 200 m',
    water: true,
    electricity: true,
    paved: 200,
    topography: 'Terrain plat',
    nearby: [
      { type: 'ecole', name: 'Lycée de Dassasgho', distance_m: 500 },
      { type: 'commerce', name: 'Marché de Dassasgho', distance_m: 800 },
    ],
    amenities: ['Quartier central', 'Toutes commodités'],
    featured: false,
    lat: 12.3803,
    lng: -1.4851,
    daysAgo: 75,
    views: 455,
    description:
      'Parcelle de 300 m² au cœur de Dassasgho, à proximité de toutes les commodités. Ce terrain a été vendu.',
  },
];

const BASE_DATE = Date.parse('2026-10-01T09:00:00Z');
const iso = (daysAgo: number) => new Date(BASE_DATE - daysAgo * 86_400_000).toISOString();
const pad = (n: number) => String(n).padStart(2, '0');

function demoImages(seed: DemoSeed): PropertyImage[] {
  const id = `demo-${pad(seed.n)}`;
  const views = ['vue aérienne du lotissement', 'vue rapprochée de la parcelle', 'plan de situation'];
  return views.map((label, i) => ({
    id: `${id}-img-${i + 1}`,
    property_id: id,
    url: `/images/terrains/t${pad(seed.n)}-${i + 1}.webp`,
    alt: `${seed.title} — ${label}`,
    position: i,
    is_main: i === 0,
  }));
}

function demoDocuments(seed: DemoSeed): PropertyDocument[] {
  const id = `demo-${pad(seed.n)}`;
  const docs: PropertyDocument[] = [
    {
      id: `${id}-doc-1`,
      property_id: id,
      name:
        seed.legal === 'titre_foncier'
          ? 'Titre foncier'
          : seed.legal === 'acd'
            ? 'Arrêté de Cession Définitive (ACD)'
            : "Attestation d'attribution",
      doc_type: seed.legal,
      file_url: null,
      is_available: true,
    },
    {
      id: `${id}-doc-2`,
      property_id: id,
      name: 'Plan de situation',
      doc_type: 'plan',
      file_url: null,
      is_available: true,
    },
    {
      id: `${id}-doc-3`,
      property_id: id,
      name: 'Procès-verbal de bornage',
      doc_type: 'autre',
      file_url: null,
      is_available: seed.status !== 'disponible' || seed.n % 2 === 0,
    },
  ];
  return docs;
}

export const demoProperties: PropertyWithRelations[] = seeds.map((seed) => {
  const location = loc(seed.zone);
  const id = `demo-${pad(seed.n)}`;
  return {
    id,
    slug: seed.slug,
    reference: `PH-${location.city === 'Tenkodogo' ? 'TKD' : 'OUA'}-${String(seed.n).padStart(3, '0')}`,
    title: seed.title,
    description: seed.description,
    location_id: location.id,
    city: location.city,
    district: seed.district,
    address: null,
    latitude: seed.lat,
    longitude: seed.lng,
    price: seed.price,
    surface: seed.surface,
    type: seed.type,
    status: seed.status,
    payment_options: seed.payment,
    installment_months: seed.months,
    legal_status: seed.legal,
    road_access: seed.road,
    has_water: seed.water,
    has_electricity: seed.electricity,
    distance_to_paved_road_m: seed.paved,
    topography: seed.topography,
    nearby: seed.nearby,
    amenities: seed.amenities,
    cadastral_plan_url: `/images/terrains/t${pad(seed.n)}-3.webp`,
    is_featured: seed.featured,
    is_published: true,
    archived_at: null,
    seo_title: null,
    seo_description: null,
    views_count: seed.views,
    created_at: iso(seed.daysAgo),
    updated_at: iso(Math.max(0, seed.daysAgo - 1)),
    images: demoImages(seed),
    documents: demoDocuments(seed),
    location,
  };
});

export const demoFaq: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Comment acheter un terrain chez Progrès Habitat ?',
    answer:
      'Choisissez un terrain sur le site ou contactez un conseiller, puis nous organisons une visite gratuite. Après vérification des documents, vous réservez avec un acompte et signez le contrat. Le solde est réglé comptant ou en plusieurs fois, et nous vous remettons les documents officiels.',
    position: 1,
    is_published: true,
  },
  {
    id: 'faq-2',
    question: 'Quels documents sont fournis ?',
    answer:
      "Selon le terrain : attestation d'attribution, Arrêté de Cession Définitive (ACD) ou titre foncier, accompagnés du plan de situation et du procès-verbal de bornage. Le document disponible est indiqué sur chaque fiche.",
    position: 2,
    is_published: true,
  },
  {
    id: 'faq-3',
    question: 'Peut-on payer en plusieurs fois ?',
    answer:
      'Oui, la plupart de nos terrains sont proposés avec un paiement échelonné. Après un acompte, le solde est réparti en mensualités (durée indiquée sur chaque fiche). Les paiements se font par Orange Money, Moov Money, virement ou en agence, contre reçu.',
    position: 3,
    is_published: true,
  },
  {
    id: 'faq-4',
    question: 'Comment réserver une visite ?',
    answer:
      'Cliquez sur « Demander une visite » depuis la fiche d’un terrain, ou contactez-nous par WhatsApp ou téléphone. Nous confirmons le rendez-vous et vous accompagnons sur place. Pour la diaspora, nous proposons des visites en vidéo.',
    position: 4,
    is_published: true,
  },
  {
    id: 'faq-5',
    question: 'Comment vérifier la propriété d’un terrain ?',
    answer:
      'Nous vous communiquons les références du document (numéro de parcelle, lot, section) afin que vous puissiez les vérifier vous-même auprès des services des domaines ou de la mairie. Vous pouvez aussi vous faire accompagner par un notaire de votre choix.',
    position: 5,
    is_published: true,
  },
  {
    id: 'faq-6',
    question: 'Quels frais supplémentaires faut-il prévoir ?',
    answer:
      'Selon le statut du terrain, prévoyez les frais de mutation ou de mise à jour du document, les éventuels frais de notaire et les taxes administratives. Nous vous remettons une estimation écrite de ces frais avant toute réservation.',
    position: 6,
    is_published: true,
  },
];

/**
 * Exemples de témoignages — affichés UNIQUEMENT en mode démonstration, avec la
 * mention « Exemple ». En production, seuls les témoignages publiés dans Supabase s'affichent.
 */
export const demoTestimonials: Testimonial[] = [
  {
    id: 'demo-t1',
    name: 'Exemple — client Ouagadougou',
    photo_url: null,
    content:
      'Ce bloc montre comment s’afficheront les avis de vos clients. Ajoutez de vrais témoignages depuis Supabase pour les publier.',
    property_label: 'Parcelle à Saaba',
    rating: 5,
    is_published: true,
    created_at: iso(5),
  },
  {
    id: 'demo-t2',
    name: 'Exemple — client diaspora',
    photo_url: null,
    content:
      'Chaque témoignage affiche le nom, la photo, le terrain acheté et la note. Ne publiez que des avis réels, avec l’accord de vos clients.',
    property_label: 'Terrain à Tenkodogo',
    rating: 5,
    is_published: true,
    created_at: iso(12),
  },
  {
    id: 'demo-t3',
    name: 'Exemple — investisseur',
    photo_url: null,
    content:
      'Les témoignages sont gérés dans la table « testimonials » : seuls ceux marqués comme publiés apparaissent sur le site.',
    property_label: 'Parcelle commerciale',
    rating: 4,
    is_published: true,
    created_at: iso(20),
  },
];
