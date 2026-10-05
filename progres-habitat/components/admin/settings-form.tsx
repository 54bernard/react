'use client';

import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveSettings } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-controls';
import { settingsSchema, type SettingsValues } from '@/schemas/property';
import type { SiteSettings } from '@/types';

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft sm:p-7">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...settings,
      email: settings.email ?? '',
      opening_hours: settings.opening_hours ?? '',
      facebook_url: settings.facebook_url ?? '',
      instagram_url: settings.instagram_url ?? '',
      tiktok_url: settings.tiktok_url ?? '',
      linkedin_url: settings.linkedin_url ?? '',
      founded_year: settings.founded_year ?? '',
    },
  });
  const figures = useFieldArray({ control, name: 'key_figures' });

  const onSubmit = handleSubmit(async (values) => {
    const res = await saveSettings(values);
    if (res.ok) {
      toast.success(res.message);
      router.refresh();
    } else toast.error(res.error);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Section title="Entreprise">
        <Field label="Nom" htmlFor="s-name" error={errors.company_name?.message}>
          <Input id="s-name" {...register('company_name')} />
        </Field>
        <Field label="Slogan" htmlFor="s-tagline" error={errors.tagline?.message}>
          <Input id="s-tagline" {...register('tagline')} />
        </Field>
        <Field label="Année de création" htmlFor="s-year" optional error={errors.founded_year?.message}>
          <Input id="s-year" inputMode="numeric" {...register('founded_year')} />
        </Field>
      </Section>

      <Section title="Coordonnées">
        <Field label="Téléphone (affiché)" htmlFor="s-phone" error={errors.phone?.message}>
          <Input id="s-phone" {...register('phone')} />
        </Field>
        <Field label="WhatsApp (format international)" htmlFor="s-wa" error={errors.whatsapp?.message} hint="Ex. 22667985754">
          <Input id="s-wa" inputMode="numeric" {...register('whatsapp')} />
        </Field>
        <Field label="E-mail" htmlFor="s-email" optional error={errors.email?.message}>
          <Input id="s-email" type="email" {...register('email')} />
        </Field>
        <Field label="Horaires" htmlFor="s-hours" optional hint="Ex. Lun–Ven 8h–17h30 · Sam 9h–13h">
          <Input id="s-hours" {...register('opening_hours')} />
        </Field>
        <Field label="Adresse" htmlFor="s-address" error={errors.address?.message}>
          <Input id="s-address" {...register('address')} />
        </Field>
        <Field label="Ville" htmlFor="s-city" error={errors.city?.message}>
          <Input id="s-city" {...register('city')} />
        </Field>
        <Field label="Pays" htmlFor="s-country" error={errors.country?.message}>
          <Input id="s-country" {...register('country')} />
        </Field>
      </Section>

      <Section title="Réseaux sociaux">
        <Field label="Facebook" htmlFor="s-fb" optional error={errors.facebook_url?.message}>
          <Input id="s-fb" {...register('facebook_url')} />
        </Field>
        <Field label="Instagram" htmlFor="s-ig" optional error={errors.instagram_url?.message}>
          <Input id="s-ig" {...register('instagram_url')} />
        </Field>
        <Field label="TikTok" htmlFor="s-tt" optional error={errors.tiktok_url?.message}>
          <Input id="s-tt" {...register('tiktok_url')} />
        </Field>
        <Field label="LinkedIn" htmlFor="s-li" optional error={errors.linkedin_url?.message}>
          <Input id="s-li" {...register('linkedin_url')} />
        </Field>
      </Section>

      <section className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft sm:p-7">
        <h2 className="text-lg font-semibold">Chiffres clés de la page d’accueil</h2>
        <p className="mt-1 text-sm text-ink-500">
          Laissez vide pour afficher les chiffres calculés automatiquement (terrains disponibles, zones…). N’indiquez que des
          chiffres réels et vérifiables.
        </p>
        <ul className="mt-6 space-y-3">
          {figures.fields.map((f, i) => (
            <li key={f.id} className="grid gap-3 sm:grid-cols-[1fr_8rem_6rem_6rem_auto] sm:items-center">
              <Input aria-label="Libellé" placeholder="Libellé (ex. Terrains vendus)" {...register(`key_figures.${i}.label` as const)} />
              <Input aria-label="Valeur" inputMode="numeric" placeholder="Valeur" {...register(`key_figures.${i}.value` as const)} />
              <Input aria-label="Préfixe" placeholder="Préfixe" {...register(`key_figures.${i}.prefix` as const)} />
              <Input aria-label="Suffixe" placeholder="Suffixe" {...register(`key_figures.${i}.suffix` as const)} />
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => figures.remove(i)} aria-label="Retirer">
                <Trash2 className="text-red-600" />
              </Button>
            </li>
          ))}
        </ul>
        {figures.fields.length < 4 && (
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => figures.append({ label: '', value: 0, prefix: '', suffix: '' })}>
            <Plus /> Ajouter un chiffre
          </Button>
        )}
      </section>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />} Enregistrer les paramètres
        </Button>
      </div>
    </form>
  );
}
