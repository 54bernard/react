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
    right: 'inset-y-0 right-0 h-full w-[min(26rem,100vw)] data-[state=open]:animate-[sheet-in-right_300ms_cubic-bezier(.2,.8,.2,1)]',
    left: 'inset-y-0 left-0 h-full w-[min(26rem,100vw)] data-[state=open]:animate-[sheet-in-left_300ms_cubic-bezier(.2,.8,.2,1)]',
    bottom: 'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl data-[state=open]:animate-[sheet-in-bottom_300ms_cubic-bezier(.2,.8,.2,1)]',
  }[side];

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-950/40 backdrop-blur-[2px] data-[state=open]:animate-[fade-in_200ms_ease-out]" />
      <Dialog.Content
        className={cn('fixed z-50 flex flex-col bg-white shadow-lift focus:outline-none', sideClasses, className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-5 py-4">
          <div>
            <Dialog.Title className="text-lg font-semibold text-ink-900">{title}</Dialog.Title>
            {description ? (
              <Dialog.Description className="mt-0.5 text-sm text-ink-500">{description}</Dialog.Description>
            ) : (
              <Dialog.Description className="sr-only">{title}</Dialog.Description>
            )}
          </div>
          <Dialog.Close
            className="grid size-9 cursor-pointer place-items-center rounded-full text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
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
