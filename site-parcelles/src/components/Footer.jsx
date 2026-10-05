import {MapPin, Phone} from 'lucide-react';
import {entreprise, services} from '../data.js';
import {lienTel, lienWhatsApp} from '../utils.js';
import {IconeFacebook, IconeWhatsApp} from './Illustrations.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="cta-bandeau">
          <div>
            <h2>Prêt à devenir propriétaire ?</h2>
            <p>Contactez-nous dès aujourd’hui pour visiter nos sites.</p>
          </div>
          <div className="cta-bandeau__actions">
            <a href={lienTel} className="btn btn--blanc btn--grand">
              <Phone size={18} /> Appeler
            </a>
            <a
              href={lienWhatsApp(`Bonjour ${entreprise.nom}, je souhaite visiter un site.`)}
              target="_blank"
              rel="noreferrer"
              className="btn btn--contour btn--grand">
              <IconeWhatsApp size={18} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="footer__grille">
          <div>
            <img src="logo.png" alt={entreprise.nom} className="footer__logo" />
            <p>{entreprise.slogan}. Parcelles, accompagnement administratif et construction au Burkina Faso.</p>
            <a href={entreprise.facebook} target="_blank" rel="noreferrer" className="footer__social" aria-label="Facebook">
              <IconeFacebook size={18} />
            </a>
          </div>
          <div>
            <h3>Navigation</h3>
            <a href="#apropos">À propos</a>
            <a href="#parcelles">Parcelles</a>
            <a href="#construction">Construction</a>
            <a href="#faq">FAQ</a>
          </div>
          <div>
            <h3>Services</h3>
            {services.slice(0, 4).map(s => (
              <a key={s.titre} href="#services">
                {s.titre}
              </a>
            ))}
          </div>
          <div>
            <h3>Contact</h3>
            <a href={lienTel}>
              <Phone size={15} aria-hidden="true" /> {entreprise.telephone}
            </a>
            <span>
              <MapPin size={15} aria-hidden="true" /> {entreprise.adresse}
            </span>
          </div>
        </div>
      </div>
      <div className="footer__bas">
        <div className="container">
          © {new Date().getFullYear()} {entreprise.nom}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
