/** Exemples de demandes et rendez-vous affichés dans l'administration en mode démonstration. */
import { demoProperties } from '@/lib/data/demo';
import type { AppointmentWithProperty, LeadWithProperty } from '@/types';

const ref = (i: number) => {
  const p = demoProperties[i]!;
  return { id: p.id, title: p.title, reference: p.reference, slug: p.slug };
};

const day = (offset: number) => new Date(Date.parse('2026-10-01T10:00:00Z') + offset * 86_400_000).toISOString();

export const demoLeads: LeadWithProperty[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Exemple — Prospect Saaba',
    phone: '+226 70 00 00 01',
    email: null,
    property_id: ref(1).id,
    property: ref(1),
    source: 'whatsapp',
    status: 'nouveau',
    message: 'Bonjour, je suis intéressé par le terrain PH-OUA-002. Est-il toujours disponible ?',
    notes: null,
    follow_up_at: day(2).slice(0, 10),
    created_at: day(-1),
    updated_at: day(-1),
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Exemple — Client diaspora',
    phone: '+33 6 00 00 00 02',
    email: 'exemple@domaine.test',
    property_id: ref(0).id,
    property: ref(0),
    source: 'site_visite',
    status: 'visite_planifiee',
    message: 'Demande de visite en vidéo.',
    notes: 'Visite vidéo prévue samedi.',
    follow_up_at: day(4).slice(0, 10),
    created_at: day(-3),
    updated_at: day(-2),
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    name: 'Exemple — Investisseur',
    phone: '+226 70 00 00 03',
    email: null,
    property_id: ref(3).id,
    property: ref(3),
    source: 'telephone',
    status: 'negociation',
    message: null,
    notes: 'Souhaite un échéancier sur 6 mois.',
    follow_up_at: day(-1).slice(0, 10),
    created_at: day(-8),
    updated_at: day(-1),
  },
];

export const demoAppointments: AppointmentWithProperty[] = [
  {
    id: '00000000-0000-4000-9000-000000000001',
    lead_id: demoLeads[1]!.id,
    property_id: ref(0).id,
    property: ref(0),
    name: 'Exemple — Client diaspora',
    phone: '+33 6 00 00 00 02',
    email: 'exemple@domaine.test',
    preferred_date: day(4).slice(0, 10),
    preferred_time: '10:00',
    message: 'Visite en vidéo WhatsApp.',
    status: 'confirme',
    created_at: day(-3),
    updated_at: day(-2),
  },
  {
    id: '00000000-0000-4000-9000-000000000002',
    lead_id: null,
    property_id: ref(5).id,
    property: ref(5),
    name: 'Exemple — Prospect Tenkodogo',
    phone: '+226 70 00 00 04',
    email: null,
    preferred_date: day(6).slice(0, 10),
    preferred_time: '15:00',
    message: null,
    status: 'en_attente',
    created_at: day(-1),
    updated_at: day(-1),
  },
];
