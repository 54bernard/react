'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, Grid2x2, ImageOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PropertyImage } from '@/types';

interface Props {
  images: PropertyImage[];
  title: string;
  overlay?: React.ReactNode;
}

/**
 * Galerie immobilière :
 * - bureau : mosaïque (grande photo + vignettes), clic → visionneuse plein écran ;
 * - mobile : carrousel natif au doigt (scroll-snap), compteur et points ;
 * - visionneuse : flèches, clavier (← →, Échap), balayage tactile.
 */
export function Gallery({ images, title, overlay }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [slide, setSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const count = images.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);
  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

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
        <ImageOff className="size-8" aria-hidden="true" />
        <p className="text-sm font-medium">Photos bientôt disponibles</p>
        {overlay}
      </div>
    );
  }

  const current = images[index] ?? images[0]!;
  const thumbs = images.slice(1, 5);
  const desktopCols = count === 1 ? 'lg:grid-cols-1' : count === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-4';

  return (
    <div>
      {/* Mobile : carrousel natif */}
      <div className="relative -mx-4 sm:-mx-6 lg:hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            setSlide(Math.round(el.scrollLeft / el.clientWidth));
          }}
          aria-roledescription="carrousel"
          aria-label={`Photos de ${title}`}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => openAt(i)}
              className="relative aspect-[4/3] w-full shrink-0 snap-center bg-sand-100"
              aria-label={`Agrandir la photo ${i + 1} sur ${count}`}
            >
              <Image src={img.url} alt={img.alt ?? title} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </button>
          ))}
        </div>
        {overlay}
        {count > 1 && (
          <>
            <p className="absolute right-4 bottom-4 rounded-full bg-ink-950/60 px-2.5 py-1 text-xs font-medium text-white tabular-nums backdrop-blur" aria-live="polite">
              {slide + 1} / {count}
            </p>
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
              {images.map((img, i) => (
                <span key={img.id} className={cn('h-1.5 rounded-full bg-white transition-all duration-300', i === slide ? 'w-4' : 'w-1.5 opacity-60')} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bureau : mosaïque */}
      <div className={cn('relative hidden h-[34rem] gap-2 overflow-hidden rounded-3xl lg:grid xl:h-[38rem]', desktopCols, count >= 3 && 'grid-rows-2')}>
        <button
          type="button"
          onClick={() => openAt(0)}
          className={cn('group relative overflow-hidden bg-sand-100', count >= 3 && 'col-span-2 row-span-2', count === 2 && 'row-span-1')}
          aria-label="Agrandir la photo principale"
        >
          <Image
            src={images[0]!.url}
            alt={images[0]!.alt ?? title}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-premium)] group-hover:scale-[1.03]"
          />
        </button>
        {count >= 2 &&
          thumbs.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => openAt(i + 1)}
              className={cn('group relative overflow-hidden bg-sand-100', count === 3 && 'col-span-2')}
              aria-label={`Agrandir la photo ${i + 2} sur ${count}`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? title}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-premium)] group-hover:scale-[1.04]"
              />
            </button>
          ))}
        {overlay}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="absolute right-5 bottom-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink-950 shadow-soft transition-colors hover:bg-sand-100"
        >
          <Grid2x2 className="size-4" aria-hidden="true" /> Voir les {count} photo{count > 1 ? 's' : ''}
        </button>
      </div>

      {/* Visionneuse */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-950 data-[state=open]:animate-[fade-in_250ms_ease-out]" />
          <Dialog.Content className="fixed inset-0 z-50 flex flex-col text-white focus:outline-none data-[state=open]:animate-[fade-in_300ms_ease-out]">
            <Dialog.Title className="sr-only">Photos — {title}</Dialog.Title>
            <Dialog.Description className="sr-only">Utilisez les flèches du clavier ou balayez pour naviguer.</Dialog.Description>
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <span className="text-sm text-white/60 tabular-nums">
                {index + 1} / {count}
              </span>
              <Dialog.Close className="grid size-11 cursor-pointer place-items-center rounded-full bg-white/10 transition hover:bg-white/20" aria-label="Fermer">
                <X className="size-5" />
              </Dialog.Close>
            </div>
            <div
              className="relative flex-1"
              onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
              onTouchEnd={(e) => {
                const start = touchX.current;
                const end = e.changedTouches[0]?.clientX;
                if (start !== null && end !== undefined && Math.abs(end - start) > 50) go(end < start ? 1 : -1);
                touchX.current = null;
              }}
            >
              <Image key={current.id} src={current.url} alt={current.alt ?? title} fill sizes="100vw" className="animate-[fade-in_300ms_ease-out] object-contain" />
              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Photo précédente"
                    className="absolute top-1/2 left-3 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20 sm:left-6"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Photo suivante"
                    className="absolute top-1/2 right-3 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20 sm:right-6"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}
            </div>
            <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Afficher la photo ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    'relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-opacity',
                    i === index ? 'opacity-100 ring-2 ring-white' : 'opacity-45 hover:opacity-80',
                  )}
                >
                  <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
