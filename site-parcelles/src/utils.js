import {entreprise} from './data.js';

export function formatFCFA(montant) {
  return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
}

export function lienWhatsApp(message) {
  return `https://wa.me/${entreprise.whatsapp}?text=${encodeURIComponent(message)}`;
}
