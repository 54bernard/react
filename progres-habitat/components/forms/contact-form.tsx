'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { submitContact } from '@/app/actions/leads';
import { useAntiSpam } from '@/components/forms/anti-spam';
import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/form-controls';
import { trackEvent } from '@/lib/track';
import { contactSchema, subjectLabels, type ContactInput } from '@/schemas/forms';

export function ContactForm({ properties }: { properties: { id: string; label: string }[] }) {
  const { honeypot, spamFields } = useAntiSpam();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: 'achat', propertyId: '', message: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await submitContact({ ...values, ...spamFields() });
    if (!result.ok) {
      setServerError(result.error);
      Object.entries(result.fieldErrors ?? {}).forEach(([key, messages]) => {
        if (messages?.[0]) setError(key as keyof ContactInput, { message: messages[0] });
      });
      return;
    }
    trackEvent('lead_submit', { subject: values.subject });
    setSuccess(result.message ?? 'Message envoyé.');
    reset();
  });

  if (success) {
    return (
      <div role="status" className="flex flex-col items-center rounded-3xl border border-ink-100 bg-white px-6 py-14 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">Message envoyé</h2>
        <p className="mt-2 max-w-md text-ink-500">{success}</p>
        <Button variant="outline" className="mt-6" onClick={() => setSuccess(null)}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  const err = (k: keyof ContactInput) => errors[k]?.message;

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
      {honeypot}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom complet" htmlFor="c-name" error={err('name')}>
          <Input id="c-name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby="c-name-error" {...register('name')} />
        </Field>
        <Field label="Téléphone / WhatsApp" htmlFor="c-phone" error={err('phone')}>
          <Input id="c-phone" type="tel" autoComplete="tel" placeholder="+226 …" aria-invalid={!!errors.phone} aria-describedby="c-phone-error" {...register('phone')} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-mail" htmlFor="c-email" error={err('email')} optional>
          <Input id="c-email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="c-email-error" {...register('email')} />
        </Field>
        <Field label="Objet" htmlFor="c-subject" error={err('subject')}>
          <Select id="c-subject" {...register('subject')}>
            {Object.entries(subjectLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Terrain concerné" htmlFor="c-property" optional>
        <Select id="c-property" {...register('propertyId')}>
          <option value="">— Aucun en particulier —</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Message" htmlFor="c-message" error={err('message')}>
        <Textarea
          id="c-message"
          rows={5}
          placeholder="Votre projet, votre budget, la zone recherchée…"
          aria-invalid={!!errors.message}
          aria-describedby="c-message-error"
          {...register('message')}
        />
      </Field>
      <div>
        <label className="flex items-start gap-3 text-sm text-ink-600">
          <Checkbox className="mt-0.5" aria-invalid={!!errors.consent} aria-describedby="c-consent-error" {...register('consent')} />
          <span>
            J’accepte que mes données soient utilisées pour répondre à ma demande, conformément à la{' '}
            <a href="/confidentialite" className="font-medium text-brand-700 underline-offset-4 hover:underline">
              politique de confidentialité
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="c-consent-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {errors.consent.message}
          </p>
        )}
      </div>
      {serverError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
        {isSubmitting ? 'Envoi en cours…' : 'Envoyer le message'}
      </Button>
    </form>
  );
}
