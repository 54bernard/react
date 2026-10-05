'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Apparition discrète au défilement.
 * Le contenu est visible dans le HTML serveur (SEO, sans JavaScript) ; seuls les éléments
 * situés sous la ligne de flottaison sont masqués puis révélés à l'arrivée dans l'écran.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section';
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static');

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState('hidden');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState('shown');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        state !== 'static' && 'transition-[opacity,translate] duration-700 ease-[cubic-bezier(.21,.6,.35,1)]',
        state === 'hidden' && 'translate-y-5 opacity-0',
        className,
      )}
      style={state === 'shown' && delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
