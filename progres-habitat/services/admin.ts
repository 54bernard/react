import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { demoFaq, demoLocations, demoProperties, demoTestimonials } from '@/lib/data/demo';
import { demoAppointments, demoLeads } from '@/lib/data/demo-admin';
import { paginate } from '@/lib/data/filtering';
import { PROPERTY_SELECT, normalizeProperty } from '@/services/properties';
import type {
  AdminUser,
  AppointmentStatus,
  AppointmentWithProperty,
  DashboardStats,
  FaqItem,
  LeadSource,
  LeadStatus,
  LeadWithProperty,
  Location,
  MonthlyStat,
  Paginated,
  PropertyStatus,
  PropertyWithRelations,
  Testimonial,
} from '@/types';
import { LEAD_SOURCES } from '@/types';

type Client = SupabaseClient | null;
const PROPERTY_REF = 'property:properties(id, title, reference, slug)';
export const ADMIN_PAGE_SIZE = 15;

/** Neutralise les caractères spéciaux des filtres PostgREST (.or / ilike). */
function searchTerm(q?: string): string | null {
  const term = q?.replace(/[%_,()."'\\]/g, ' ').trim().slice(0, 60);
  return term ? term : null;
}

function range(page: number, pageSize: number) {
  const from = (Math.max(1, page) - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

function toPaginated<T>(items: T[], total: number, page: number, pageSize: number): Paginated<T> {
  return { items, total, page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}

/** Six derniers mois (du plus ancien au plus récent), au format AAAA-MM. */
function lastMonths(count = 6): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (count - 1 - i), 1));
    return d.toISOString().slice(0, 7);
  });
}

function bucketByMonth(leadDates: string[], visitDates: string[]): MonthlyStat[] {
  return lastMonths().map((month) => ({
    month,
    leads: leadDates.filter((d) => d.startsWith(month)).length,
    visits: visitDates.filter((d) => d.startsWith(month)).length,
  }));
}

const weekAgo = () => new Date(Date.now() - 7 * 86_400_000).toISOString();

/* ================================================================ Tableau de bord */

export async function getDashboardStats(supabase: Client): Promise<DashboardStats> {
  const today = new Date().toISOString().slice(0, 10);
  if (!supabase) {
    const active = demoProperties.filter((p) => !p.archived_at);
    return {
      total: active.length,
      archived: demoProperties.length - active.length,
      available: active.filter((p) => p.status === 'disponible' && p.is_published).length,
      reserved: active.filter((p) => p.status === 'reserve').length,
      sold: active.filter((p) => p.status === 'vendu').length,
      unpublished: active.filter((p) => !p.is_published).length,
      leads: demoLeads.length,
      leadsThisWeek: demoLeads.filter((l) => l.created_at >= weekAgo()).length,
      newLeads: demoLeads.filter((l) => l.status === 'nouveau').length,
      appointments: demoAppointments.length,
      pendingAppointments: demoAppointments.filter((a) => a.status === 'en_attente').length,
      totalViews: demoProperties.reduce((s, p) => s + p.views_count, 0),
      leadsBySource: LEAD_SOURCES.map((source) => ({ source, count: demoLeads.filter((l) => l.source === source).length })).filter((s) => s.count > 0),
      topProperties: [...demoProperties].sort((a, b) => b.views_count - a.views_count).slice(0, 5),
      followUpsDue: demoLeads.filter((l) => l.follow_up_at && l.follow_up_at <= today && !['gagne', 'perdu'].includes(l.status)).length,
      monthly: bucketByMonth(
        demoLeads.map((l) => l.created_at),
        demoAppointments.map((a) => a.created_at),
      ),
    };
  }

  const since = `${lastMonths()[0]}-01T00:00:00Z`;
  const head = (table: string) => supabase.from(table).select('id', { count: 'exact', head: true });
  const [
    totalRes,
    archivedRes,
    availableRes,
    reservedRes,
    soldRes,
    unpublishedRes,
    leadsRes,
    weekRes,
    newLeadsRes,
    appointmentsRes,
    pendingRes,
    followUpsRes,
    propsRes,
    sourcesRes,
    leadDatesRes,
    visitDatesRes,
  ] = await Promise.all([
    head('properties').is('archived_at', null),
    head('properties').not('archived_at', 'is', null),
    head('properties').eq('status', 'disponible').eq('is_published', true),
    head('properties').eq('status', 'reserve').is('archived_at', null),
    head('properties').eq('status', 'vendu').is('archived_at', null),
    head('properties').eq('is_published', false).is('archived_at', null),
    head('leads'),
    head('leads').gte('created_at', weekAgo()),
    head('leads').eq('status', 'nouveau'),
    head('appointments'),
    head('appointments').eq('status', 'en_attente'),
    head('leads').lte('follow_up_at', today).not('status', 'in', '(gagne,perdu)'),
    supabase
      .from('properties')
      .select('id, title, reference, views_count, status')
      .is('archived_at', null)
      .order('views_count', { ascending: false })
      .limit(5),
    supabase.from('leads').select('source').limit(5000),
    supabase.from('leads').select('created_at').gte('created_at', since).limit(10000),
    supabase.from('appointments').select('created_at').gte('created_at', since).limit(10000),
  ]);

  const { data: viewsRows } = await supabase.from('properties').select('views_count').limit(5000);
  const sources = (sourcesRes.data ?? []) as { source: LeadSource }[];
  return {
    total: totalRes.count ?? 0,
    archived: archivedRes.count ?? 0,
    available: availableRes.count ?? 0,
    reserved: reservedRes.count ?? 0,
    sold: soldRes.count ?? 0,
    unpublished: unpublishedRes.count ?? 0,
    leads: leadsRes.count ?? 0,
    leadsThisWeek: weekRes.count ?? 0,
    newLeads: newLeadsRes.count ?? 0,
    appointments: appointmentsRes.count ?? 0,
    pendingAppointments: pendingRes.count ?? 0,
    followUpsDue: followUpsRes.count ?? 0,
    totalViews: (viewsRows ?? []).reduce((s, r) => s + Number(r.views_count ?? 0), 0),
    topProperties: (propsRes.data ?? []) as DashboardStats['topProperties'],
    leadsBySource: LEAD_SOURCES.map((source) => ({ source, count: sources.filter((s) => s.source === source).length })).filter((s) => s.count > 0),
    monthly: bucketByMonth(
      ((leadDatesRes.data ?? []) as { created_at: string }[]).map((r) => r.created_at),
      ((visitDatesRes.data ?? []) as { created_at: string }[]).map((r) => r.created_at),
    ),
  };
}

/** Compteurs légers pour les badges du menu. */
export async function getMenuBadges(supabase: Client): Promise<{ newLeads: number; pendingVisits: number }> {
  if (!supabase) {
    return {
      newLeads: demoLeads.filter((l) => l.status === 'nouveau').length,
      pendingVisits: demoAppointments.filter((a) => a.status === 'en_attente').length,
    };
  }
  const [leads, visits] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'nouveau'),
    supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'en_attente'),
  ]);
  return { newLeads: leads.count ?? 0, pendingVisits: visits.count ?? 0 };
}

/* ================================================================ Terrains */

export type PropertyTab = 'tous' | PropertyStatus | 'brouillon' | 'archive';
export type PropertySort = 'recent' | 'ancien' | 'prix-desc' | 'prix-asc' | 'vues';

export interface AdminPropertyQuery {
  q?: string;
  tab?: PropertyTab;
  zone?: string;
  sort?: PropertySort;
  page?: number;
}

export async function listAdminProperties(supabase: Client, opts: AdminPropertyQuery = {}): Promise<Paginated<PropertyWithRelations>> {
  const tab = opts.tab ?? 'tous';
  const page = opts.page ?? 1;
  const term = searchTerm(opts.q);

  if (!supabase) {
    let items = demoProperties.filter((p) => {
      if (tab === 'archive') return Boolean(p.archived_at);
      if (p.archived_at) return false;
      if (tab === 'brouillon') return !p.is_published;
      if (tab !== 'tous' && p.status !== tab) return false;
      return true;
    });
    if (term) items = items.filter((p) => `${p.title} ${p.reference} ${p.district}`.toLowerCase().includes(term.toLowerCase()));
    if (opts.zone) items = items.filter((p) => p.location?.slug === opts.zone);
    const sorted = [...items].sort((a, b) => {
      switch (opts.sort) {
        case 'ancien':
          return a.updated_at.localeCompare(b.updated_at);
        case 'prix-desc':
          return b.price - a.price;
        case 'prix-asc':
          return a.price - b.price;
        case 'vues':
          return b.views_count - a.views_count;
        default:
          return b.updated_at.localeCompare(a.updated_at);
      }
    });
    return paginate(sorted, page, ADMIN_PAGE_SIZE);
  }

  let query = supabase.from('properties').select(PROPERTY_SELECT, { count: 'exact' });
  if (tab === 'archive') query = query.not('archived_at', 'is', null);
  else {
    query = query.is('archived_at', null);
    if (tab === 'brouillon') query = query.eq('is_published', false);
    else if (tab !== 'tous') query = query.eq('status', tab);
  }
  if (term) query = query.or(`title.ilike.%${term}%,reference.ilike.%${term}%,district.ilike.%${term}%`);
  if (opts.zone) {
    const { data: zone } = await supabase.from('locations').select('id').eq('slug', opts.zone).maybeSingle();
    query = query.eq('location_id', zone?.id ?? '00000000-0000-0000-0000-000000000000');
  }
  const order: Record<PropertySort, [string, boolean]> = {
    recent: ['updated_at', false],
    ancien: ['updated_at', true],
    'prix-desc': ['price', false],
    'prix-asc': ['price', true],
    vues: ['views_count', false],
  };
  const [column, ascending] = order[opts.sort ?? 'recent'];
  const { from, to } = range(page, ADMIN_PAGE_SIZE);
  const { data, error, count } = await query.order(column, { ascending }).range(from, to);
  if (error) throw new Error(error.message);
  return toPaginated((data ?? []).map(normalizeProperty), count ?? 0, page, ADMIN_PAGE_SIZE);
}

export async function getAdminProperty(supabase: Client, id: string): Promise<PropertyWithRelations | null> {
  if (!supabase) return demoProperties.find((p) => p.id === id) ?? null;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await supabase.from('properties').select(PROPERTY_SELECT).eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeProperty(data) : null;
}

export async function listPropertyOptions(supabase: Client): Promise<{ id: string; label: string }[]> {
  if (!supabase) return demoProperties.map((p) => ({ id: p.id, label: `${p.reference} — ${p.title}` }));
  const { data, error } = await supabase
    .from('properties')
    .select('id, reference, title')
    .is('archived_at', null)
    .order('reference')
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []).map((p) => ({ id: p.id as string, label: `${p.reference} — ${p.title}` }));
}

/* ================================================================ Clients (CRM) */

export interface LeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  q?: string;
  relance?: boolean;
  page?: number;
}

export async function listLeads(supabase: Client, opts: LeadQuery = {}): Promise<Paginated<LeadWithProperty>> {
  const today = new Date().toISOString().slice(0, 10);
  const page = opts.page ?? 1;
  const term = searchTerm(opts.q);
  if (!supabase) {
    const items = demoLeads.filter(
      (l) =>
        (!opts.status || l.status === opts.status) &&
        (!opts.source || l.source === opts.source) &&
        (!term || `${l.name} ${l.phone} ${l.email ?? ''}`.toLowerCase().includes(term.toLowerCase())) &&
        (!opts.relance || (l.follow_up_at !== null && l.follow_up_at <= today && !['gagne', 'perdu'].includes(l.status))),
    );
    return paginate(items, page, ADMIN_PAGE_SIZE);
  }
  let query = supabase.from('leads').select(`*, ${PROPERTY_REF}`, { count: 'exact' });
  if (opts.status) query = query.eq('status', opts.status);
  if (opts.source) query = query.eq('source', opts.source);
  if (opts.relance) query = query.lte('follow_up_at', today).not('status', 'in', '(gagne,perdu)');
  if (term) query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`);
  const { from, to } = range(page, ADMIN_PAGE_SIZE);
  const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);
  if (error) throw new Error(error.message);
  return toPaginated((data ?? []) as LeadWithProperty[], count ?? 0, page, ADMIN_PAGE_SIZE);
}

/** Toutes les fiches correspondant aux filtres (export CSV), plafonné à 5 000 lignes. */
export async function exportLeads(supabase: Client, opts: Omit<LeadQuery, 'page'> = {}): Promise<LeadWithProperty[]> {
  if (!supabase) return (await listLeads(null, { ...opts, page: 1 })).items;
  const today = new Date().toISOString().slice(0, 10);
  const term = searchTerm(opts.q);
  let query = supabase.from('leads').select(`*, ${PROPERTY_REF}`);
  if (opts.status) query = query.eq('status', opts.status);
  if (opts.source) query = query.eq('source', opts.source);
  if (opts.relance) query = query.lte('follow_up_at', today).not('status', 'in', '(gagne,perdu)');
  if (term) query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`);
  const { data, error } = await query.order('created_at', { ascending: false }).limit(5000);
  if (error) throw new Error(error.message);
  return (data ?? []) as LeadWithProperty[];
}

export async function listRecentLeads(supabase: Client, limit = 6): Promise<LeadWithProperty[]> {
  if (!supabase) return demoLeads.slice(0, limit);
  const { data, error } = await supabase.from('leads').select(`*, ${PROPERTY_REF}`).order('created_at', { ascending: false }).limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as LeadWithProperty[];
}

/* ================================================================ Demandes de visite */

export interface AppointmentQuery {
  status?: AppointmentStatus;
  periode?: 'a-venir' | 'passees';
  q?: string;
  page?: number;
}

export async function listAppointments(supabase: Client, opts: AppointmentQuery = {}): Promise<Paginated<AppointmentWithProperty>> {
  const today = new Date().toISOString().slice(0, 10);
  const page = opts.page ?? 1;
  const term = searchTerm(opts.q);
  const upcoming = opts.periode !== 'passees';
  if (!supabase) {
    const items = demoAppointments
      .filter(
        (a) =>
          (!opts.status || a.status === opts.status) &&
          (upcoming ? a.preferred_date >= today : a.preferred_date < today) &&
          (!term || `${a.name} ${a.phone}`.toLowerCase().includes(term.toLowerCase())),
      )
      .sort((a, b) => (upcoming ? 1 : -1) * `${a.preferred_date}${a.preferred_time}`.localeCompare(`${b.preferred_date}${b.preferred_time}`));
    return paginate(items, page, ADMIN_PAGE_SIZE);
  }
  let query = supabase.from('appointments').select(`*, ${PROPERTY_REF}`, { count: 'exact' });
  if (opts.status) query = query.eq('status', opts.status);
  query = upcoming ? query.gte('preferred_date', today) : query.lt('preferred_date', today);
  if (term) query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%`);
  const { from, to } = range(page, ADMIN_PAGE_SIZE);
  const { data, error, count } = await query
    .order('preferred_date', { ascending: upcoming })
    .order('preferred_time', { ascending: upcoming })
    .range(from, to);
  if (error) throw new Error(error.message);
  return toPaginated((data ?? []) as AppointmentWithProperty[], count ?? 0, page, ADMIN_PAGE_SIZE);
}

/* ================================================================ Contenus */

export async function listAdminTestimonials(supabase: Client): Promise<Testimonial[]> {
  if (!supabase) return demoTestimonials;
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false }).limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as Testimonial[];
}

export async function listAdminFaq(supabase: Client): Promise<FaqItem[]> {
  if (!supabase) return demoFaq;
  const { data, error } = await supabase.from('faq').select('*').order('position').limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as FaqItem[];
}

export interface LocationWithCount extends Location {
  property_count: number;
}

export async function listAdminLocations(supabase: Client): Promise<LocationWithCount[]> {
  if (!supabase) {
    return demoLocations.map((l) => ({ ...l, property_count: demoProperties.filter((p) => p.location_id === l.id).length }));
  }
  const { data, error } = await supabase.from('locations').select('*, properties(count)').order('name');
  if (error) throw new Error(error.message);
  return ((data ?? []) as (Location & { properties: { count: number }[] })[]).map(({ properties, ...l }) => ({
    ...l,
    property_count: properties?.[0]?.count ?? 0,
  }));
}

/* ================================================================ Utilisateurs */

export async function listAdminUsers(supabase: Client): Promise<AdminUser[]> {
  if (!supabase) {
    return [
      {
        user_id: '00000000-0000-4000-a000-000000000001',
        email: 'admin@exemple.test',
        role: 'admin',
        created_at: '2026-01-01T00:00:00Z',
        last_sign_in_at: null,
      },
    ];
  }
  const { data, error } = await supabase.rpc('list_admin_users');
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminUser[];
}
