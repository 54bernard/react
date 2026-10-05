import type { ReactNode } from 'react';

/** Entrée du hero en CSS pur : jouée dès le premier affichage, sans attendre JavaScript (LCP préservé). */
export function HeroMotion({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`motion-safe:animate-[hero-in_0.8s_cubic-bezier(.21,.6,.35,1)_both] ${className ?? ''}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
