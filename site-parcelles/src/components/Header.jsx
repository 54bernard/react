import {useEffect, useState} from 'react';
import {MapPin, Menu, Phone, X} from 'lucide-react';
import {entreprise} from '../data.js';
import {lienTel, lienWhatsApp} from '../utils.js';
import {IconeFacebook, IconeWhatsApp} from './Illustrations.jsx';

const liens = [
  {href: '#apropos', label: 'À propos'},
  {href: '#parcelles', label: 'Parcelles'},
  {href: '#services', label: 'Services'},
  {href: '#construction', label: 'Construction'},
  {href: '#faq', label: 'FAQ'},
  {href: '#contact', label: 'Contact'},
];

export default function Header() {
  const [ouvert, setOuvert] = useState(false);
  const [scrolle, setScrolle] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolle(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fermer = () => setOuvert(false);

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">
          <span className="topbar__item">
            <MapPin size={15} aria-hidden="true" /> {entreprise.adresse}
          </span>
          <div className="topbar__droite">
            <a href={lienTel} className="topbar__item">
              <Phone size={15} aria-hidden="true" /> {entreprise.telephone}
            </a>
            <a href={entreprise.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="topbar__social">
              <IconeFacebook size={16} />
            </a>
          </div>
        </div>
      </div>

      <header className={`header ${scrolle ? 'header--ombre' : ''}`}>
        <div className="container header__inner">
          <a href="#accueil" className="logo" onClick={fermer}>
            <img src="logo.png" alt={entreprise.nom} />
          </a>

          <nav className={`nav ${ouvert ? 'nav--ouvert' : ''}`} aria-label="Navigation principale">
            {liens.map(l => (
              <a key={l.href} href={l.href} onClick={fermer}>
                {l.label}
              </a>
            ))}
            <a
              href={lienWhatsApp(`Bonjour ${entreprise.nom}, je souhaite des informations.`)}
              target="_blank"
              rel="noreferrer"
              className="btn btn--primaire nav__cta"
              onClick={fermer}>
              <IconeWhatsApp size={18} /> Écrivez-nous
            </a>
          </nav>

          <button
            className="menu-toggle"
            aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={ouvert}
            onClick={() => setOuvert(o => !o)}>
            {ouvert ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>
    </>
  );
}
