'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BellRing, Download, Loader2, Phone, Plus, Save, Trash2, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { createLead, deleteLead, updateLead } from '@/app/admin/actions';
import { WhatsAppIcon } from '@/components/layout/whatsapp-icon';
import { td, th } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { Field, Input, Select, Textarea } from '@/components/ui/form-controls';
import { EmptyState } from '@/components/ui/misc';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { leadSourceLabels, leadStatusLabels } from '@/lib/labels';
import { cn, formatDate } from '@/lib/utils';
import { phoneHref, whatsappLink } from '@/lib/whatsapp';
import { leadCreateSchema, type LeadCreateValues } from '@/schemas/property';
import { LEAD_SOURCES, LEAD_STATUSES, type LeadStatus, type LeadWithProperty } from '@/types';

const statusTone: Record<LeadStatus, string> = {
  nouveau: 'bg-accent-50 text-accent-700',
  contacte: 'bg-sky-50 text-sky-800',
  visite_planifiee: 'bg-violet-50 text-violet-800',
  negociation: 'bg-amber-50 text-amber-900',
  gagne: 'bg-emerald-50 text-emerald-800',
  perdu: 'bg-ink-100 text-ink-600',
};

function LeadEditor({ lead, onDone }: { lead: LeadWithProperty; onDone: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? '');
  const [followUp, setFollowUp] = useState(lead.follow_up_at ?? '');
  const confirm = useConfirm();

  const save = () =>
    start(async () => {
      const res = await updateLead({ id: lead.id, status, notes, follow_up_at: followUp });
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
        onDone();
      } else toast.error(res.error);
    });

  const remove = async () => {
    const ok = await confirm({
      title: `Supprimer la fiche de ${lead.name} ?`,
      description: 'L’historique de ce client (notes, relances) sera définitivement supprimé.',
      confirmLabel: 'Supprimer',
    });
    if (!ok) return;
    start(async () => {
      const res = await deleteLead(lead.id);
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
        onDone();
      } else toast.error(res.error);
    });
  };

  const waDigits = lead.phone.replace(/\D/g, '');

  return (
    <div className="space-y-6 p-5">
      <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-ink-50 p-4 text-sm">
        <div>
          <dt className="text-ink-500">Téléphone</dt>
          <dd className="font-medium">{lead.phone}</dd>
        </div>
        <div>
          <dt className="text-ink-500">E-mail</dt>
          <dd className="truncate font-medium">{lead.email ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Terrain demandé</dt>
          <dd className="font-medium">{lead.property ? `${lead.property.reference}` : '—'}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Source</dt>
          <dd className="font-medium">{leadSourceLabels[lead.source]}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-ink-500">Reçue le</dt>
          <dd className="font-medium">{new Date(lead.created_at).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</dd>
        </div>
        {lead.message && (
          <div className="col-span-2">
            <dt className="text-ink-500">Message</dt>
            <dd className="mt-1 whitespace-pre-line text-ink-800">{lead.message}</dd>
          </div>
        )}
      </dl>

      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline">
          <a href={phoneHref(lead.phone)}>
            <Phone /> Appeler
          </a>
        </Button>
        <Button asChild variant="whatsapp">
          <a href={whatsappLink(waDigits, `Bonjour ${lead.name.split(' ')[0]}, c’est Progrès Habitat.`)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> WhatsApp
          </a>
        </Button>
      </div>

      <Field label="Statut" htmlFor="lead-status">
        <Select id="lead-status" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {leadStatusLabels[s]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Date de relance" htmlFor="lead-followup" optional>
        <Input id="lead-followup" type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
      </Field>
      <Field label="Notes internes" htmlFor="lead-notes" optional>
        <Textarea id="lead-notes" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Budget, disponibilités, échanges…" />
      </Field>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={remove} disabled={pending} className="text-red-600 hover:bg-red-50 hover:text-red-700">
          <Trash2 /> Supprimer
        </Button>
        <Button onClick={save} disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />} Enregistrer
        </Button>
      </div>
    </div>
  );
}

function NewLeadForm({ properties, onDone }: { properties: { id: string; label: string }[]; onDone: () => void }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadCreateValues>({ resolver: zodResolver(leadCreateSchema), defaultValues: { source: 'telephone' } });

  const onSubmit = handleSubmit(async (values) => {
    const res = await createLead(values);
    if (res.ok) {
      toast.success(res.message);
      router.refresh();
      onDone();
    } else toast.error(res.error);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 p-5">
      <Field label="Nom du client" htmlFor="nl-name" error={errors.name?.message}>
        <Input id="nl-name" {...register('name')} />
      </Field>
      <Field label="Numéro" htmlFor="nl-phone" error={errors.phone?.message}>
        <Input id="nl-phone" type="tel" {...register('phone')} />
      </Field>
      <Field label="E-mail" htmlFor="nl-email" optional error={errors.email?.message}>
        <Input id="nl-email" type="email" {...register('email')} />
      </Field>
      <Field label="Terrain demandé" htmlFor="nl-property" optional>
        <Select id="nl-property" {...register('property_id')}>
          <option value="">— Aucun —</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Source du client" htmlFor="nl-source">
        <Select id="nl-source" {...register('source')}>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {leadSourceLabels[s]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Relance prévue le" htmlFor="nl-followup" optional>
        <Input id="nl-followup" type="date" {...register('follow_up_at')} />
      </Field>
      <Field label="Message / besoin" htmlFor="nl-message" optional>
        <Textarea id="nl-message" rows={3} {...register('message')} />
      </Field>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />} Ajouter le prospect
      </Button>
    </form>
  );
}

export function LeadsManager({
  leads,
  properties,
  exportHref,
  footer,
}: {
  leads: LeadWithProperty[];
  properties: { id: string; label: string }[];
  exportHref: string;
  footer?: React.ReactNode;
}) {
  const [selected, setSelected] = useState<LeadWithProperty | null>(null);
  const [creating, setCreating] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <a href={exportHref} download>
            <Download /> Exporter (CSV)
          </a>
        </Button>
        <Sheet open={creating} onOpenChange={setCreating}>
          <SheetTrigger asChild>
            <Button size="sm" className="rounded-xl">
              <Plus /> Nouveau client
            </Button>
          </SheetTrigger>
          <SheetContent title="Nouveau prospect" description="Ajoutez un client contacté par téléphone, WhatsApp, Facebook…">
            <NewLeadForm properties={properties} onDone={() => setCreating(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {leads.length === 0 ? (
        <EmptyState icon={<UserRound />} title="Aucun client" description="Les demandes envoyées depuis le site et les prospects ajoutés manuellement apparaîtront ici." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
          {/* Mobile */}
          <ul className="divide-y divide-ink-100 md:hidden">
            {leads.map((l) => {
              const late = l.follow_up_at && l.follow_up_at <= today && !['gagne', 'perdu'].includes(l.status);
              return (
                <li key={l.id}>
                  <button type="button" onClick={() => setSelected(l)} className="flex w-full cursor-pointer items-start gap-3 p-4 text-left">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sand-100 text-sm font-semibold text-ink-700" aria-hidden="true">
                      {l.name.replace(/^Exemple — /, '').charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink-950">{l.name}</span>
                      <span className="block truncate text-xs text-ink-500">
                        {l.phone} · {l.property?.reference ?? 'Sans terrain'}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', statusTone[l.status])}>{leadStatusLabels[l.status]}</span>
                        {late && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600">
                            <BellRing className="size-3" aria-hidden="true" /> Relance due
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Desktop */}
          <div className="relative hidden overflow-x-auto md:block">
            <table className="w-full min-w-[56rem] text-sm">
              <thead className="border-b border-ink-100">
                <tr>
                  <th scope="col" className={th}>Client</th>
                  <th scope="col" className={th}>Terrain demandé</th>
                  <th scope="col" className={th}>Source</th>
                  <th scope="col" className={th}>Date</th>
                  <th scope="col" className={th}>Statut</th>
                  <th scope="col" className={th}>Relance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {leads.map((l) => {
                  const late = l.follow_up_at && l.follow_up_at <= today && !['gagne', 'perdu'].includes(l.status);
                  return (
                    <tr key={l.id} className="cursor-pointer transition-colors hover:bg-ink-50/60" onClick={() => setSelected(l)}>
                      <td className={td}>
                        <button type="button" className="cursor-pointer text-left font-medium text-ink-950 hover:underline" onClick={() => setSelected(l)}>
                          {l.name}
                        </button>
                        <p className="text-xs text-ink-500">{l.phone}</p>
                      </td>
                      <td className={`${td} text-ink-600`}>{l.property?.reference ?? '—'}</td>
                      <td className={`${td} text-ink-600`}>{leadSourceLabels[l.source]}</td>
                      <td className={`${td} whitespace-nowrap text-ink-600`}>{formatDate(l.created_at, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className={td}>
                        <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', statusTone[l.status])}>{leadStatusLabels[l.status]}</span>
                      </td>
                      <td className={`${td} whitespace-nowrap`}>
                        {l.follow_up_at ? (
                          <span className={cn('inline-flex items-center gap-1.5', late ? 'font-semibold text-red-600' : 'text-ink-600')}>
                            {late && <BellRing className="size-3.5" aria-hidden="true" />}
                            {formatDate(l.follow_up_at, { day: 'numeric', month: 'short' })}
                          </span>
                        ) : (
                          <span className="text-ink-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {footer}
        </div>
      )}

      <Sheet open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <SheetContent title={selected.name} description="Fiche client">
            <LeadEditor key={selected.id} lead={selected} onDone={() => setSelected(null)} />
          </SheetContent>
        )}
      </Sheet>
    </>
  );
}
