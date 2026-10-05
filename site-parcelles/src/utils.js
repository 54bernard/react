import {useEffect, useRef} from 'react';
import {entreprise} from './data.js';

export function formatFCFA(montant) {
  return new Intl.NumberFormat('fr-FR').format(montant).replace(/ | /g, ' ') + ' FCFA';
}

export function lienWhatsApp(message) {
  return `https://wa.me/${entreprise.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const lienTel = `tel:${entreprise.telephone.replace(/\s/g, '')}`;

// Fait apparaître en douceur les éléments `.reveal` quand ils entrent à l'écran.
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const racine = ref.current;
    if (!racine) return;
    const elements = racine.querySelectorAll('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(e => e.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        }),
      {threshold: 0.12},
    );
    elements.forEach(e => obs.observe(e));
    return () => obs.disconnect();
  });
  return ref;
}
