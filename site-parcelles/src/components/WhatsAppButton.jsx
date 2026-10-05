import {entreprise} from '../data.js';
import {lienWhatsApp} from '../utils.js';
import {IconeWhatsApp} from './Illustrations.jsx';

export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp"
      href={lienWhatsApp(`Bonjour ${entreprise.nom}, je souhaite avoir des informations sur vos parcelles.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Nous écrire sur WhatsApp">
      <IconeWhatsApp size={30} />
    </a>
  );
}
