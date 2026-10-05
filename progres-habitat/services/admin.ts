import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { demoFaq, demoProperties, demoTestimonials } from '@/lib/data/demo';
import { demoAppointments, demoLeads } from '@/lib/data/demo-admin';
import { PROPERTY_SELECT, normalizeProperty } from '@/services/properties';
import type {
  AppointmentStatus,
  AppointmentWithProperty,
  DashboardStats,
  FaqItem,
  LeadSource,
  LeadStatus,
  LeadWithProperty,
  PropertyStatus,
  PropertyWithRelations,
  Testimonial,
} from '@/types';
import { LEAD_SOURCES } from '@/types';

type Client = SupabaseClient | null;
const PROPERTY_REF = 'property:properties(id, title, reference, slug)';

export async function getDashboardStats(supabase: Client): Promise<DashboardStats> {
  const today = new Date().toISOString().slice(0, 10);
  if (!supabase) {
    const bySource = LEAD_SOURCES.map((source) => ({ source, count: demoLeads.filter((l) => l.source === source).length })).filter((s) => s.count > 0);
    return {
      available: demoProperties.filter((p) => p.status === 'disponible').length,
      reserved: demoProperties.filter((p) => p.status === 'reserve').length,
      sold: demoProperties.filter((p) => p.status === 'vendu').length,
      unpublished: demoProperties.filter((p) => !p.is_published).length,
      leads: demoLeads.length,
      newLeads: demoLeads.filter((l) => l.status === 'nouveau').length,
      appointments: demoAppointments.length,
      pendingAppointments: demoAppointments.filter((a) => a.status === 'en_attente').length,
      totalViews: demoProperties.reduce((s, p) => s + p.views_count, 0),
      leadsBySource: bySource,
      topProperties: [...demoProperties].sort((a, b) => b.views_count - a.views_count).slice(0, 5),
      followUpsDue: demoLeads.filter((l) => l.follow_up_at && l.follow_up_at <= today && !['gagne', 'perdu'].includes(l.status)).length,
    };
  }

  const head = (table: string) => supabase.from(table).select('id', { count: 'exact', head: true });
  const [
    availableRes,
    reservedRes,
    soldRes,
    unpublishedRes,
    leadsRes,
    newLeadsRes,
    appointmentsRes,
    pendingRes,
    followUpsRes,
    propsRes,
    sourcesRes,
  ] = await Promise.all([
    head('properties').eq('status', 'disponible').eq('is_published', true),
    head('properties').eq('status', 'reserve'),
    head('properties').eq('status', 'vendu'),
    head('properties').eq('is_published', false),
    head('leads'),
    head('leads').eq('status', 'nouveau'),
    head('appointments'),
    head('appointments').eq('status', 'en_attente'),
    head('leads').lte('follow_up_at', today).not('status', 'in', '(gagne,perdu)'),
    supabase.from('properties').select('id, title, reference, views_count, status').order('views_count', { ascending: false }).limit(200),
    supabase.from('leads').select('source').limit(5000),
  ]);
  const available = availableRes.count ?? 0;
  const reserved = reservedRes.count ?? 0;
  const sold = soldRes.count ?? 0;
  const unpublished = unpublishedRes.count ?? 0;
  const leads = leadsRes.count ?? 0;
  const newLeads = newLeadsRes.count ?? 0;
  const appointments = appointmentsRes.count ?? 0;
  const pendingAppointments = pendingRes.count ?? 0;
  const followUpsDue = followUpsRes.count ?? 0;

  const props = (propsRes.data ?? []) as DashboardStats['topProperties'];
  const sources = (sourcesRes.data ?? []) as { source: LeadSource }[];
  return {
    available,
    reserved,
    sold,
    unpublished,
    leads,
    newLeads,
    appointments,
    pendingAppointments,
    followUpsDue,
    totalViews: props.reduce((s, p) => s + p.views_count, 0),
    topProperties: props.slice(0, 5),
    leadsBySource: LEAD_SOURCES.map((source) => ({ source, count: sources.filter((s) => s.source === source).length })).filter((s) => s.count > 0),
  };
}

export async function listAdminProperties(
  supabase: Client,
  opts: { q?: string; status?: PropertyStatus | 'brouillon' } = {},
): Promise<PropertyWithRelations[]> {
  if (!supabase) {
    return demoProperties.filter((p) => {
      if (opts.status === 'brouillon' && p.is_published) return false;
      if (opts.status && opts.status !== 'brouillon' && p.status !== opts.status) return false;
      if (opts.q && !`${p.title} ${p.reference} ${p.district}`.toLowerCase().includes(opts.q.toLowerCase())) return false;
      return true;
    });
  }
  let query = supabase.from('properties').select(PROPERTY_SELECT).order('updated_at', { ascending: false }).limit(300);
  if (opts.status === 'brouillon') query = query.eq('is_published', false);
  else if (opts.status) query = query.eq('status', opts.status);
  if (opts.q) {
    const term = opts.q.replace(/[%_,()."']/g, ' ').trim();
    if (term) query = query.or(`title.ilike.%${term}%,reference.ilike.%${term}%,district.ilike.%${term}%`);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalizeProperty);
}

export async function getAdminProperty(supabase: Client, id: string): Promise<PropertyWithRelations | null> {
  if (!supabase) return demoProperties.find((p) => p.id === id) ?? null;
  const { data, error } = await supabase.from('properties').select(PROPERTY_SELECT).eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeProperty(data) : null;
}

export async function listLeads(
  supabase: Client,
  opts: { status?: LeadStatus; source?: LeadSource; q?: string; relance?: boolean } = {},
): Promise<LeadWithProperty[]> {
  const today = new Date().toISOString().slice(0, 10);
  if (!supabase) {
    return demoLeads.filter(
      (l) =>
        (!opts.status || l.status === opts.status) &&
        (!opts.source || l.source === opts.source) &&
        (!opts.q || `${l.name} ${l.phone}`.toLowerCase().includes(opts.q.toLowerCase())) &&
        (!opts.relance || (l.follow_up_at !== null && l.follow_up_at <= today)),
    );
  }
  let query = supabase.from('leads').select(`*, ${PROPERTY_REF}`).order('created_at', { ascending: false }).limit(500);
  if (opts.status) query = query.eq('status', opts.status);
  if (opts.source) query = query.eq('source', opts.source);
  if (opts.relance) query = query.lte('follow_up_at', today).not('status', 'in', '(gagne,perdu)');
  if (opts.q) {
    const term = opts.q.replace(/[%_,()."']/g, ' ').trim();
    if (term) query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as LeadWithProperty[];
}

export async function listAppointments(supabase: Client, opts: { status?: AppointmentStatus } = {}): Promise<AppointmentWithProperty[]> {
  if (!supabase) return demoAppointments.filter((a) => !opts.status || a.status === opts.status);
  let query = supabase
    .from('appointments')
    .select(`*, ${PROPERTY_REF}`)
    .order('preferred_date', { ascending: true })
    .order('preferred_time', { ascending: true })
    .limit(500);
  if (opts.status) query = query.eq('status', opts.status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as AppointmentWithProperty[];
}

export async function listAdminTestimonials(supabase: Client): Promise<Testimonial[]> {
  if (!supabase) return demoTestimonials;
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Testimonial[];
}

export async function listAdminFaq(supabase: Client): Promise<FaqItem[]> {
  if (!supabase) return demoFaq;
  const { data, error } = await supabase.from('faq').select('*').order('position');
  if (error) throw new Error(error.message);
  return (data ?? []) as FaqItem[];
}

export async function listPropertyOptions(supabase: Client): Promise<{ id: string; label: string }[]> {
  const items = await listAdminProperties(supabase);
  return items.map((p) => ({ id: p.id, label: `${p.reference} — ${p.title}` }));
}
