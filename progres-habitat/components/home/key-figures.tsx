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
    let frame = 0;
    setValue(0);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        setValue(Math.round(eased * figure.value));
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
      {figure.prefix && <span className="mr-1.5 font-sans text-base font-medium text-ink-500 sm:text-lg">{figure.prefix.trim()}</span>}
      {value.toLocaleString('fr-FR')}
      {figure.suffix && <span className="ml-1 text-2xl sm:text-3xl">{figure.suffix}</span>}
    </span>
  );
}

export function KeyFigures({ figures }: { figures: KeyFigure[] }) {
  return (
    <section aria-label="Chiffres clés" className="relative z-10 border-b border-ink-100 bg-white">
      <dl className="container-page grid grid-cols-2 divide-ink-100 lg:grid-cols-4 lg:divide-x">
        {figures.map((f, i) => (
          <div
            key={f.label}
            className={`flex flex-col-reverse justify-end gap-1 px-4 py-7 sm:px-6 lg:py-10 ${i % 2 === 1 ? 'border-l border-ink-100 lg:border-l-0' : ''} ${i >= 2 ? 'border-t border-ink-100 lg:border-t-0' : ''}`}
          >
            <dt className="text-sm text-ink-500">{f.label}</dt>
            <dd className="font-display text-4xl font-medium tracking-tight whitespace-nowrap text-ink-900 sm:text-5xl">
              <Counter figure={f} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
