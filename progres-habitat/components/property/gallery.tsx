'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, ImageOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PropertyImage } from '@/types';

interface Props {
  images: PropertyImage[];
  title: string;
  overlay?: React.ReactNode;
}

export function Gallery({ images, title, overlay }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;

  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setDirection(delta);
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  if (count === 0) {
    return (
      <div className="relative flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-3xl bg-sand-100 text-ink-400">
        <ImageOff className="size-10" aria-hidden="true" />
        <p className="font-medium">Photos bientôt disponibles</p>
        {overlay}
      </div>
    );
  }

  const current = images[index]!;

  return (
    <div>
      <div
        className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand-100 sm:aspect-[16/10]"
        aria-roledescription="carrousel"
        aria-label={`Photos de ${title}`}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
            drag={count > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
            className="absolute inset-0"
          >
            <Image
              src={current.url}
              alt={current.alt ?? title}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover select-none"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {overlay}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-4 bottom-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-ink-900 shadow-soft backdrop-blur transition hover:bg-white"
        >
          <Expand className="size-4" aria-hidden="true" /> Voir les {count} photo{count > 1 ? 's' : ''}
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Photo précédente"
              className="absolute top-1/2 left-4 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-ink-900 opacity-100 shadow-soft transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Photo suivante"
              className="absolute top-1/2 right-4 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-ink-900 opacity-100 shadow-soft transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
            <p className="absolute bottom-4 left-4 rounded-full bg-ink-950/60 px-3 py-1 text-xs font-medium text-white backdrop-blur" aria-live="polite">
              {index + 1} / {count}
            </p>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6" aria-label="Miniatures">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                aria-label={`Afficher la photo ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-xl ring-2 ring-offset-2 transition',
                  i === index ? 'ring-brand-500' : 'opacity-70 ring-transparent hover:opacity-100',
                )}
              >
                <Image src={img.url} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-950/95 data-[state=open]:animate-[fade-in_200ms_ease-out]" />
          <Dialog.Content className="fixed inset-0 z-50 flex flex-col focus:outline-none">
            <Dialog.Title className="sr-only">Photos — {title}</Dialog.Title>
            <Dialog.Description className="sr-only">Utilisez les flèches du clavier pour naviguer.</Dialog.Description>
            <div className="flex items-center justify-between p-4 text-white">
              <span className="text-sm text-white/70">
                {index + 1} / {count}
              </span>
              <Dialog.Close className="grid size-11 cursor-pointer place-items-center rounded-full bg-white/10 transition hover:bg-white/20" aria-label="Fermer">
                <X className="size-5" />
              </Dialog.Close>
            </div>
            <div className="relative flex-1">
              <Image src={current.url} alt={current.alt ?? title} fill sizes="100vw" className="object-contain" />
              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Photo précédente"
                    className="absolute top-1/2 left-4 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Photo suivante"
                    className="absolute top-1/2 right-4 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}
            </div>
            {current.alt && <p className="p-4 text-center text-sm text-white/70">{current.alt}</p>}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
