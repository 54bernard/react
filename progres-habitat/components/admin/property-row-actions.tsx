'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { Archive, ArchiveRestore, Copy, Eye, EyeOff, Loader2, MoreHorizontal, Pencil, ScanEye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProperty, duplicateProperty, setPropertyArchived, togglePublished, updatePropertyStatus } from '@/app/admin/actions';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { statusLabels } from '@/lib/labels';
import { cn } from '@/lib/utils';
import { PROPERTY_STATUSES, type ActionResult, type PropertyStatus } from '@/types';

const itemClass =
  'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-700 outline-none data-[highlighted]:bg-ink-100 data-[highlighted]:text-ink-950';

const statusDot: Record<PropertyStatus, string> = {
  disponible: 'bg-emerald-500',
  reserve: 'bg-amber-500',
  vendu: 'bg-red-500',
};

export function PropertyStatusSelect({ id, status, disabled }: { id: string; status: PropertyStatus; disabled?: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Statut commercial</span>
      <span className={cn('pointer-events-none absolute left-2.5 size-1.5 rounded-full', statusDot[status])} aria-hidden="true" />
      <select
        value={status}
        disabled={pending || disabled}
        onChange={(e) =>
          start(async () => {
            const res = await updatePropertyStatus(id, e.target.value as PropertyStatus);
            if (res.ok) toast.success(res.message);
            else toast.error(res.error);
            router.refresh();
          })
        }
        className="h-8 cursor-pointer appearance-none rounded-lg border border-ink-200 bg-white pr-3 pl-6 text-[13px] font-medium text-ink-800 transition hover:border-ink-400 focus:border-ink-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
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

export function PropertyRowActions({
  id,
  title,
  published,
  archived,
}: {
  id: string;
  title: string;
  published: boolean;
  archived: boolean;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const confirm = useConfirm();

  const run = (fn: () => Promise<ActionResult<{ id: string }> | ActionResult>, after?: (res: ActionResult<{ id: string }>) => void) =>
    start(async () => {
      const res = (await fn()) as ActionResult<{ id: string }>;
      if (res.ok) toast.success(res.message);
      else toast.error(res.error);
      after?.(res);
      router.refresh();
    });

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-950 data-[state=open]:bg-ink-100"
        aria-label={`Actions pour ${title}`}
        disabled={pending}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}
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
              <ScanEye className="size-4" /> Prévisualiser
            </Link>
          </Dropdown.Item>
          {!archived && (
            <Dropdown.Item className={itemClass} onSelect={() => run(() => togglePublished(id, !published))}>
              {published ? <EyeOff className="size-4" /> : <Eye className="size-4" />} {published ? 'Repasser en brouillon' : 'Publier'}
            </Dropdown.Item>
          )}
          <Dropdown.Item
            className={itemClass}
            onSelect={() =>
              run(
                () => duplicateProperty(id),
                (res) => {
                  if (res.ok && res.data) router.push(`/admin/terrains/${res.data.id}`);
                },
              )
            }
          >
            <Copy className="size-4" /> Dupliquer
          </Dropdown.Item>
          <Dropdown.Item
            className={itemClass}
            onSelect={async () => {
              if (archived) return run(() => setPropertyArchived(id, false));
              const ok = await confirm({
                title: `Archiver « ${title} » ?`,
                description: 'Le terrain est retiré du site et des listes. Vous pourrez le restaurer à tout moment depuis l’onglet Archivés.',
                confirmLabel: 'Archiver',
                tone: 'default',
              });
              if (ok) run(() => setPropertyArchived(id, true));
            }}
          >
            {archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />} {archived ? 'Restaurer' : 'Archiver'}
          </Dropdown.Item>
          <Dropdown.Separator className="my-1 h-px bg-ink-100" />
          <Dropdown.Item
            className={cn(itemClass, 'text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700')}
            onSelect={async () => {
              const ok = await confirm({
                title: `Supprimer « ${title} » ?`,
                description: 'Le terrain, ses photos et ses documents seront définitivement supprimés. Préférez l’archivage pour conserver l’historique.',
                confirmLabel: 'Supprimer définitivement',
              });
              if (ok) run(() => deleteProperty(id));
            }}
          >
            <Trash2 className="size-4" /> Supprimer
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
