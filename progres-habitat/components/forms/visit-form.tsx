'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { submitVisitRequest } from '@/app/actions/leads';
import { useAntiSpam } from '@/components/forms/anti-spam';
import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/form-controls';
import { trackEvent } from '@/lib/track';
import { VISIT_TIMES, visitSchema, type VisitInput } from '@/schemas/forms';

interface Props {
  properties: { id: string; label: string }[];
  defaultPropertyId?: string;
  onDone?: () => void;
}

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export function VisitForm({ properties, defaultPropertyId, onDone }: Props) {
  const { honeypot, spamFields } = useAntiSpam();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VisitInput>({
    resolver: zodResolver(visitSchema),
    defaultValues: { propertyId: defaultPropertyId ?? '', date: tomorrow(), time: '09:00', message: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await submitVisitRequest({ ...values, ...spamFields() });
    if (!result.ok) {
      setServerError(result.error);
      Object.entries(result.fieldErrors ?? {}).forEach(([key, messages]) => {
        if (messages?.[0]) setError(key as keyof VisitInput, { message: messages[0] });
      });
      return;
    }
    trackEvent('visit_request', { property_id: values.propertyId });
    setSuccess(result.message ?? 'Demande envoyée.');
  });

  if (success) {
    return (
      <div role="status" className="flex flex-col items-center px-2 py-8 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-lg font-semibold">Demande de visite envoyée</h3>
        <p className="mt-2 max-w-sm text-ink-500">{success}</p>
        {onDone && (
          <Button variant="outline" className="mt-6" onClick={onDone}>
            Fermer
          </Button>
        )}
      </div>
    );
  }

  const err = (k: keyof VisitInput) => errors[k]?.message;

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-4">
      {honeypot}
      <Field label="Nom complet" htmlFor="v-name" error={err('name')}>
        <Input id="v-name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby="v-name-error" {...register('name')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Téléphone" htmlFor="v-phone" error={err('phone')}>
          <Input id="v-phone" type="tel" autoComplete="tel" placeholder="+226 …" aria-invalid={!!errors.phone} aria-describedby="v-phone-error" {...register('phone')} />
        </Field>
        <Field label="E-mail" htmlFor="v-email" error={err('email')} optional>
          <Input id="v-email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="v-email-error" {...register('email')} />
        </Field>
      </div>
      <Field label="Terrain" htmlFor="v-property" error={err('propertyId')}>
        <Select id="v-property" aria-invalid={!!errors.propertyId} aria-describedby="v-property-error" {...register('propertyId')}>
          <option value="">— Choisir un terrain —</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date souhaitée" htmlFor="v-date" error={err('date')}>
          <Input id="v-date" type="date" min={new Date().toISOString().slice(0, 10)} aria-invalid={!!errors.date} aria-describedby="v-date-error" {...register('date')} />
        </Field>
        <Field label="Heure" htmlFor="v-time" error={err('time')}>
          <Select id="v-time" aria-invalid={!!errors.time} aria-describedby="v-time-error" {...register('time')}>
            {VISIT_TIMES.map((t) => (
              <option key={t} value={t}>
                {t.replace(':', ' h ')}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Message" htmlFor="v-message" error={err('message')} optional>
        <Textarea id="v-message" rows={3} placeholder="Précisions, visite en vidéo pour la diaspora…" {...register('message')} />
      </Field>
      <div>
        <label className="flex items-start gap-3 text-sm text-ink-600">
          <Checkbox className="mt-0.5" aria-invalid={!!errors.consent} aria-describedby="v-consent-error" {...register('consent')} />
          J’accepte d’être recontacté(e) par Progrès Habitat au sujet de ma demande.
        </label>
        {errors.consent && (
          <p id="v-consent-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {errors.consent.message}
          </p>
        )}
      </div>
      {serverError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <CalendarCheck />}
        {isSubmitting ? 'Envoi en cours…' : 'Demander la visite'}
      </Button>
    </form>
  );
}
