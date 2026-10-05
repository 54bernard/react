'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Ne monte ses enfants qu'à l'approche de la zone visible : les composants lourds
 * (cartes) ne sont téléchargés que si l'utilisateur fait défiler jusqu'à eux.
 */
export function LazyMount({ children, fallback, className }: { children: ReactNode; fallback?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible ? children : fallback}
    </div>
  );
}
