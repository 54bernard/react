import { NextResponse, type NextRequest } from 'next/server';
import { getAdminContext } from '@/lib/auth';
import { leadSourceLabels, leadStatusLabels } from '@/lib/labels';
import { exportLeads } from '@/services/admin';
import { LEAD_SOURCES, LEAD_STATUSES, type LeadSource, type LeadStatus } from '@/types';

export const dynamic = 'force-dynamic';

/** Neutralise les formules (=, +, -, @) pour éviter l'injection CSV dans Excel. */
function cell(value: string | null | undefined): string {
  let v = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
}

/** Export CSV des clients (réservé aux administrateurs, filtres identiques à la liste). */
export async function GET(request: NextRequest) {
  const ctx = await getAdminContext();
  if (ctx.mode === 'forbidden') return new NextResponse('Accès refusé', { status: 403 });
  const supabase = ctx.mode === 'live' ? ctx.supabase : null;

  const sp = request.nextUrl.searchParams;
  const status = LEAD_STATUSES.includes(sp.get('statut') as LeadStatus) ? (sp.get('statut') as LeadStatus) : undefined;
  const source = LEAD_SOURCES.includes(sp.get('source') as LeadSource) ? (sp.get('source') as LeadSource) : undefined;
  const leads = await exportLeads(supabase, {
    status,
    source,
    q: sp.get('q')?.slice(0, 60) ?? undefined,
    relance: sp.get('relance') === '1',
  });

  const header = ['Date', 'Nom', 'Téléphone', 'E-mail', 'Terrain', 'Source', 'Statut', 'Relance', 'Notes', 'Message'];
  const rows = leads.map((l) => [
    l.created_at.slice(0, 10),
    l.name,
    l.phone,
    l.email,
    l.property?.reference,
    leadSourceLabels[l.source],
    leadStatusLabels[l.status],
    l.follow_up_at,
    l.notes,
    l.message,
  ]);
  const csv = [header, ...rows].map((r) => r.map(cell).join(';')).join('\r\n');

  return new NextResponse(`﻿${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="clients-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
