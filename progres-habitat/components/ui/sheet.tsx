'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {
  side?: 'right' | 'left' | 'bottom';
  title: string;
  description?: string;
}

/** Panneau latéral accessible (piège du focus, Échap, retour du focus). */
export function SheetContent({ side = 'right', title, description, className, children, ...props }: SheetContentProps) {
  const sideClasses = {
    right: 'inset-y-0 right-0 h-full w-[min(28rem,100vw)] data-[state=open]:animate-[sheet-in-right_350ms_var(--ease-premium)]',
    left: 'inset-y-0 left-0 h-full w-[min(28rem,100vw)] data-[state=open]:animate-[sheet-in-left_350ms_var(--ease-premium)]',
    bottom: 'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl data-[state=open]:animate-[sheet-in-bottom_350ms_var(--ease-premium)]',
  }[side];

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-950/45 backdrop-blur-[3px] data-[state=open]:animate-[fade-in_200ms_ease-out]" />
      <Dialog.Content
        className={cn('fixed z-50 flex flex-col bg-white shadow-lift focus:outline-none', sideClasses, className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink-950/[0.06] px-6 py-5">
          <div>
            <Dialog.Title className="text-h3">{title}</Dialog.Title>
            {description ? (
              <Dialog.Description className="mt-1.5 text-sm text-ink-500">{description}</Dialog.Description>
            ) : (
              <Dialog.Description className="sr-only">{title}</Dialog.Description>
            )}
          </div>
          <Dialog.Close
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </Dialog.Close>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
