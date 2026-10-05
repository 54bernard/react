'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MapPin, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteLocation, saveLocation } from '@/app/admin/actions';
import { td, th } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { Field, Input, Textarea } from '@/components/ui/form-controls';
import { EmptyState } from '@/components/ui/misc';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { slugify } from '@/lib/utils';
import { locationSchema, type LocationValues } from '@/schemas/property';
import type { LocationWithCount } from '@/services/admin';

function LocationForm({ initial, onDone }: { initial?: LocationWithCount; onDone: () => void }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LocationValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: initial?.name ?? '',
      slug: initial?.slug ?? '',
      city: initial?.city ?? 'Ouagadougou',
      description: initial?.description ?? '',
      image_url: initial?.image_url ?? '',
      latitude: initial?.latitude ?? 12.3714,
      longitude: initial?.longitude ?? -1.5197,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const res = await saveLocation(values, initial?.id);
    if (!res.ok) {
      toast.error(res.error);
      Object.entries(res.fieldErrors ?? {}).forEach(([k, m]) => m?.[0] && setError(k as keyof LocationValues, { message: m[0] }));
      return;
    }
    toast.success(res.message);
    router.refresh();
    onDone();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 p-5">
      <Field label="Nom de la zone" htmlFor="loc-name" error={errors.name?.message}>
        <Input
          id="loc-name"
          {...register('name', {
            onBlur: () => {
              if (!getValues('slug')) setValue('slug', slugify(getValues('name')), { shouldValidate: true });
            },
          })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug (URL)" htmlFor="loc-slug" error={errors.slug?.message} hint="Utilisé dans /terrains?zone=…">
          <Input id="loc-slug" {...register('slug')} />
        </Field>
        <Field label="Ville" htmlFor="loc-city" error={errors.city?.message}>
          <Input id="loc-city" {...register('city')} />
        </Field>
        <Field label="Latitude" htmlFor="loc-lat" error={errors.latitude?.message}>
          <Input id="loc-lat" inputMode="decimal" {...register('latitude')} />
        </Field>
        <Field label="Longitude" htmlFor="loc-lng" error={errors.longitude?.message}>
          <Input id="loc-lng" inputMode="decimal" {...register('longitude')} />
        </Field>
      </div>
      <Field label="Description" htmlFor="loc-desc" optional>
        <Textarea id="loc-desc" rows={3} {...register('description')} />
      </Field>
      <Field label="URL de la photo" htmlFor="loc-img" optional hint="Image de couverture affichée dans « Nos zones ».">
        <Input id="loc-img" {...register('image_url')} />
      </Field>
      <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />} Enregistrer
      </Button>
    </form>
  );
}

export function LocationsManager({ items }: { items: LocationWithCount[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<LocationWithCount | 'new' | null>(null);
  const [pending, start] = useTransition();

  const remove = async (l: LocationWithCount) => {
    const ok = await confirm({
      title: `Supprimer la zone « ${l.name} » ?`,
      description:
        l.property_count > 0
          ? `${l.property_count} terrain(s) y sont rattachés : réaffectez-les d’abord.`
          : 'La zone disparaîtra des filtres et de la page « Nos zones ».',
      confirmLabel: 'Supprimer',
    });
    if (!ok) return;
    start(async () => {
      const res = await deleteLocation(l.id);
      if (res.ok) toast.success(res.message);
      else toast.error(res.error);
      router.refresh();
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button size="sm" className="rounded-xl" onClick={() => setEditing('new')}>
          <Plus /> Nouvelle localisation
        </Button>
      </div>
      {items.length === 0 ? (
        <EmptyState icon={<MapPin />} title="Aucune localisation" description="Créez vos zones (quartiers, communes) pour organiser le catalogue." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="border-b border-ink-100">
                <tr>
                  <th scope="col" className={th}>Zone</th>
                  <th scope="col" className={th}>Ville</th>
                  <th scope="col" className={th}>Terrains</th>
                  <th scope="col" className={th}>GPS</th>
                  <th scope="col" className={th}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {items.map((l) => (
                  <tr key={l.id} className="hover:bg-ink-50/60">
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                          {l.image_url && <Image src={l.image_url} alt="" fill sizes="40px" className="object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-ink-950">{l.name}</p>
                          <p className="text-xs text-ink-500">/{l.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${td} text-ink-600`}>{l.city}</td>
                    <td className={`${td} text-ink-600 tabular-nums`}>{l.property_count}</td>
                    <td className={`${td} font-mono text-xs text-ink-500`}>
                      {l.latitude.toFixed(4)}, {l.longitude.toFixed(4)}
                    </td>
                    <td className={`${td} text-right whitespace-nowrap`}>
                      <Button variant="ghost" size="icon-sm" className="rounded-lg" onClick={() => setEditing(l)} aria-label={`Modifier ${l.name}`}>
                        <Pencil />
                      </Button>
                      <Button variant="danger-ghost" size="icon-sm" className="rounded-lg" onClick={() => remove(l)} disabled={pending} aria-label={`Supprimer ${l.name}`}>
                        <Trash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Sheet open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        {editing !== null && (
          <SheetContent title={editing === 'new' ? 'Nouvelle localisation' : `Modifier « ${editing.name} »`}>
            <LocationForm key={editing === 'new' ? 'new' : editing.id} initial={editing === 'new' ? undefined : editing} onDone={() => setEditing(null)} />
          </SheetContent>
        )}
      </Sheet>
    </>
  );
}
