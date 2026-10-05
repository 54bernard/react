'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Boîte de confirmation accessible (Radix AlertDialog : focus piégé, Échap, retour du focus).
 * Usage : `const confirm = useConfirm(); if (await confirm({ title: '…' })) { … }`
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  };

  const danger = options?.tone !== 'default';

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog.Root open={options !== null} onOpenChange={(open) => !open && close(false)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-[60] bg-ink-950/45 backdrop-blur-[2px] data-[state=open]:animate-[fade-in_180ms_ease-out]" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 z-[60] w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lift focus:outline-none data-[state=open]:animate-[pop-in_220ms_var(--ease-premium)]">
            <div className="flex gap-4">
              {danger && (
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
                  <AlertTriangle className="size-5" aria-hidden="true" />
                </span>
              )}
              <div>
                <AlertDialog.Title className="text-base font-semibold text-ink-950">{options?.title}</AlertDialog.Title>
                <AlertDialog.Description className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  {options?.description ?? 'Cette action est définitive.'}
                </AlertDialog.Description>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AlertDialog.Cancel asChild>
                <Button variant="outline" size="md" onClick={() => close(false)}>
                  {options?.cancelLabel ?? 'Annuler'}
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button variant={danger ? 'danger' : 'primary'} size="md" onClick={() => close(true)}>
                  {options?.confirmLabel ?? 'Confirmer'}
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm doit être utilisé dans <ConfirmProvider>.');
  return ctx;
}
