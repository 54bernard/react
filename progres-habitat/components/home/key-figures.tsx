'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyFigure } from '@/types';

function Counter({ figure }: { figure: KeyFigure }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Valeur finale au rendu serveur (SEO, sans JavaScript) ; le compteur repart de 0 à l'arrivée à l'écran.
  const [value, setValue] = useState(figure.value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Déjà visible au chargement : pas d'animation (évite un saut 0 → valeur sous les yeux)
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    let frame = 0;
    setValue(0);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1600;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setValue(Math.round((1 - Math.pow(1 - t, 4)) * figure.value));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [figure.value]);

  return (
    <span ref={ref} className="tabular-nums">
      {figure.prefix && <span className="mr-2 align-middle font-sans text-sm font-medium tracking-normal text-ink-500">{figure.prefix.trim()}</span>}
      {value.toLocaleString('fr-FR')}
      {figure.suffix}
    </span>
  );
}

export function KeyFigures({ figures }: { figures: KeyFigure[] }) {
  return (
    <section aria-label="Chiffres clés" className="border-b border-ink-950/[0.06] bg-sand-50">
      <dl className="container-page grid grid-cols-2 lg:grid-cols-4">
        {figures.map((f, i) => (
          <div
            key={f.label}
            className={[
              'flex flex-col-reverse justify-end gap-2 py-8 sm:py-10 lg:py-14',
              i % 2 === 1 ? 'border-l border-ink-950/[0.06] pl-5 sm:pl-8' : 'pr-5',
              i >= 2 ? 'border-t border-ink-950/[0.06] lg:border-t-0' : '',
              i > 0 ? 'lg:border-l lg:border-ink-950/[0.06] lg:pl-10' : '',
            ].join(' ')}
          >
            <dt className="text-[13px] text-ink-500 sm:text-sm">{f.label}</dt>
            <dd className="font-display text-[2.5rem] leading-none tracking-tight whitespace-nowrap text-ink-950 sm:text-5xl lg:text-[3.5rem]">
              <Counter figure={f} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
