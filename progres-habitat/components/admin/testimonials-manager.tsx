'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MessageSquareQuote, Pencil, Plus, Save, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteTestimonial, saveTestimonial } from '@/app/admin/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/form-controls';
import { EmptyState } from '@/components/ui/misc';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { testimonialSchema, type TestimonialValues } from '@/schemas/property';
import type { Testimonial } from '@/types';

function TestimonialForm({ initial, onDone }: { initial?: Testimonial; onDone: () => void }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: initial?.name ?? '',
      content: initial?.content ?? '',
      property_label: initial?.property_label ?? '',
      photo_url: initial?.photo_url ?? '',
      rating: initial?.rating ?? 5,
      is_published: initial?.is_published ?? false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const res = await saveTestimonial(values, initial?.id);
    if (res.ok) {
      toast.success(res.message);
      router.refresh();
      onDone();
    } else toast.error(res.error);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 p-5">
      <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
        Publiez uniquement des avis réels, avec l’accord écrit du client pour l’utilisation de son nom et de sa photo.
      </p>
      <Field label="Nom du client" htmlFor="t-name" error={errors.name?.message}>
        <Input id="t-name" {...register('name')} />
      </Field>
      <Field label="Témoignage" htmlFor="t-content" error={errors.content?.message}>
        <Textarea id="t-content" rows={5} {...register('content')} />
      </Field>
      <Field label="Terrain acheté" htmlFor="t-property" optional>
        <Input id="t-property" placeholder="Ex. Parcelle de 300 m² à Saaba" {...register('property_label')} />
      </Field>
      <Field label="URL de la photo" htmlFor="t-photo" optional error={errors.photo_url?.message}>
        <Input id="t-photo" {...register('photo_url')} />
      </Field>
      <Field label="Note" htmlFor="t-rating">
        <Select id="t-rating" {...register('rating')}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} / 5
            </option>
          ))}
        </Select>
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox {...register('is_published')} /> Publier sur le site
      </label>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />} Enregistrer
      </Button>
    </form>
  );
}

export function TestimonialsManager({ items }: { items: Testimonial[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Testimonial | 'new' | null>(null);
  const [pending, start] = useTransition();
  const confirm = useConfirm();

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button size="sm" className="rounded-xl" onClick={() => setEditing('new')}>
          <Plus /> Ajouter un témoignage
        </Button>
      </div>
      {items.length === 0 ? (
        <EmptyState icon={<MessageSquareQuote />} title="Aucun témoignage" description="La section Témoignages est masquée sur le site tant qu’aucun avis n’est publié." />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((t) => (
            <li key={t.id} className="flex flex-col rounded-2xl border border-ink-100 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink-900">{t.name}</p>
                  {t.property_label && <p className="text-sm text-ink-500">{t.property_label}</p>}
                </div>
                <Badge variant={t.is_published ? 'success' : 'neutral'}>{t.is_published ? 'Publié' : 'Masqué'}</Badge>
              </div>
              <div className="mt-3 flex gap-0.5" aria-label={`Note ${t.rating} sur 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={i < t.rating ? 'size-4 fill-accent-500 text-accent-500' : 'size-4 text-ink-200'} aria-hidden="true" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">“{t.content}”</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(t)}>
                  <Pencil /> Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  className="text-red-600 hover:bg-red-50"
                  onClick={async () => {
                    const ok = await confirm({ title: `Supprimer le témoignage de ${t.name} ?`, confirmLabel: 'Supprimer' });
                    if (!ok) return;
                    start(async () => {
                      const res = await deleteTestimonial(t.id);
                      if (res.ok) toast.success(res.message);
                      else toast.error(res.error);
                      router.refresh();
                    });
                  }}
                >
                  <Trash2 /> Supprimer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Sheet open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        {editing !== null && (
          <SheetContent title={editing === 'new' ? 'Nouveau témoignage' : 'Modifier le témoignage'}>
            <TestimonialForm initial={editing === 'new' ? undefined : editing} onDone={() => setEditing(null)} />
          </SheetContent>
        )}
      </Sheet>
    </>
  );
}
