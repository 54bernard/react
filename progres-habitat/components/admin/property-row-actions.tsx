'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { Copy, Eye, EyeOff, Loader2, MoreHorizontal, Pencil, ScanEye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProperty, duplicateProperty, togglePublished, updatePropertyStatus } from '@/app/admin/actions';
import { statusLabels } from '@/lib/labels';
import { PROPERTY_STATUSES, type ActionResult, type PropertyStatus } from '@/types';

const itemClass =
  'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-700 outline-none data-[highlighted]:bg-ink-100 data-[highlighted]:text-ink-900';

export function PropertyStatusSelect({ id, status }: { id: string; status: PropertyStatus }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Statut</span>
      <select
        value={status}
        disabled={pending}
        onChange={(e) =>
          start(async () => {
            const res = await updatePropertyStatus(id, e.target.value as PropertyStatus);
            if (res.ok) toast.success(res.message);
            else toast.error(res.error);
            router.refresh();
          })
        }
        className="h-8 cursor-pointer rounded-lg border border-ink-200 bg-white px-2 text-sm font-medium focus:border-brand-500 focus:outline-none"
      >
        {PROPERTY_STATUSES.map((s) => (
          <option key={s} value={s}>
            {statusLabels[s]}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="ml-2 size-4 animate-spin text-ink-400" aria-hidden="true" />}
    </label>
  );
}

export function PropertyRowActions({ id, title, published }: { id: string; title: string; published: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const run = (fn: () => Promise<ActionResult<unknown>>, after?: (res: ActionResult<unknown>) => void) =>
    start(async () => {
      const res = await fn();
      if (res.ok) toast.success(res.message);
      else toast.error(res.error);
      after?.(res);
      router.refresh();
    });

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className="grid size-9 cursor-pointer place-items-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-ink-900"
        aria-label={`Actions pour ${title}`}
        disabled={pending}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-5" />}
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content align="end" sideOffset={6} className="z-50 min-w-52 rounded-xl border border-ink-100 bg-white p-1.5 shadow-lift">
          <Dropdown.Item asChild className={itemClass}>
            <Link href={`/admin/terrains/${id}`}>
              <Pencil className="size-4" /> Modifier
            </Link>
          </Dropdown.Item>
          <Dropdown.Item asChild className={itemClass}>
            <Link href={`/admin/terrains/${id}/apercu`}>
              <ScanEye className="size-4" /> Aperçu
            </Link>
          </Dropdown.Item>
          <Dropdown.Item className={itemClass} onSelect={() => run(() => togglePublished(id, !published))}>
            {published ? <EyeOff className="size-4" /> : <Eye className="size-4" />} {published ? 'Dépublier' : 'Publier'}
          </Dropdown.Item>
          <Dropdown.Item
            className={itemClass}
            onSelect={() =>
              run(
                () => duplicateProperty(id),
                (res) => {
                  if (res.ok && res.data && typeof res.data === 'object' && 'id' in res.data) {
                    router.push(`/admin/terrains/${(res.data as { id: string }).id}`);
                  }
                },
              )
            }
          >
            <Copy className="size-4" /> Dupliquer
          </Dropdown.Item>
          <Dropdown.Separator className="my-1 h-px bg-ink-100" />
          <Dropdown.Item
            className={`${itemClass} text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700`}
            onSelect={() => {
              if (window.confirm(`Supprimer définitivement « ${title} » et ses photos ?`)) run(() => deleteProperty(id));
            }}
          >
            <Trash2 className="size-4" /> Supprimer
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
