'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle, Loader2, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteFaq, saveFaq } from '@/app/admin/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { Checkbox, Field, Input, Textarea } from '@/components/ui/form-controls';
import { EmptyState } from '@/components/ui/misc';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { faqSchema, type FaqValues } from '@/schemas/property';
import type { FaqItem } from '@/types';

function FaqForm({ initial, nextPosition, onDone }: { initial?: FaqItem; nextPosition: number; onDone: () => void }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FaqValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: initial?.question ?? '',
      answer: initial?.answer ?? '',
      position: initial?.position ?? nextPosition,
      is_published: initial?.is_published ?? true,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const res = await saveFaq(values, initial?.id);
    if (!res.ok) return void toast.error(res.error);
    toast.success(res.message);
    router.refresh();
    onDone();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 p-5">
      <Field label="Question" htmlFor="faq-q" error={errors.question?.message}>
        <Input id="faq-q" {...register('question')} />
      </Field>
      <Field label="Réponse" htmlFor="faq-a" error={errors.answer?.message}>
        <Textarea id="faq-a" rows={6} {...register('answer')} />
      </Field>
      <Field label="Ordre d’affichage" htmlFor="faq-pos" error={errors.position?.message} hint="Les plus petits nombres apparaissent en premier.">
        <Input id="faq-pos" inputMode="numeric" className="max-w-32" {...register('position')} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox {...register('is_published')} /> Publiée sur le site
      </label>
      <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />} Enregistrer
      </Button>
    </form>
  );
}

export function FaqManager({ items }: { items: FaqItem[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<FaqItem | 'new' | null>(null);
  const [pending, start] = useTransition();
  const nextPosition = Math.max(0, ...items.map((i) => i.position)) + 1;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button size="sm" className="rounded-xl" onClick={() => setEditing('new')}>
          <Plus /> Nouvelle question
        </Button>
      </div>
      {items.length === 0 ? (
        <EmptyState icon={<HelpCircle />} title="Aucune question" description="Les questions publiées apparaissent sur l’accueil et la page FAQ." />
      ) : (
        <ol className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-4 p-4 sm:px-5">
              <span className="mt-0.5 w-6 shrink-0 text-sm font-semibold text-ink-300 tabular-nums">{item.position}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink-950">{item.question}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-500">{item.answer}</p>
              </div>
              <Badge variant={item.is_published ? 'brand' : 'outline'} className="mt-0.5 hidden sm:inline-flex">
                {item.is_published ? 'Publiée' : 'Masquée'}
              </Badge>
              <div className="flex shrink-0">
                <Button variant="ghost" size="icon-sm" className="rounded-lg" onClick={() => setEditing(item)} aria-label="Modifier la question">
                  <Pencil />
                </Button>
                <Button
                  variant="danger-ghost"
                  size="icon-sm"
                  className="rounded-lg"
                  disabled={pending}
                  aria-label="Supprimer la question"
                  onClick={async () => {
                    const ok = await confirm({ title: 'Supprimer cette question ?', description: item.question, confirmLabel: 'Supprimer' });
                    if (!ok) return;
                    start(async () => {
                      const res = await deleteFaq(item.id);
                      if (res.ok) toast.success(res.message);
                      else toast.error(res.error);
                      router.refresh();
                    });
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ol>
      )}
      <Sheet open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        {editing !== null && (
          <SheetContent title={editing === 'new' ? 'Nouvelle question' : 'Modifier la question'}>
            <FaqForm
              key={editing === 'new' ? 'new' : editing.id}
              initial={editing === 'new' ? undefined : editing}
              nextPosition={nextPosition}
              onDone={() => setEditing(null)}
            />
          </SheetContent>
        )}
      </Sheet>
    </>
  );
}
