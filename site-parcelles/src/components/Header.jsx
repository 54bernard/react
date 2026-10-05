import {useEffect, useState} from 'react';
import {entreprise} from '../data.js';

const liens = [
  {href: '#apropos', label: 'À propos'},
  {href: '#parcelles', label: 'Parcelles'},
  {href: '#services', label: 'Services'},
  {href: '#processus', label: 'Comment acheter'},
  {href: '#faq', label: 'FAQ'},
];

export default function Header() {
  const [ouvert, setOuvert] = useState(false);
  const [scrolle, setScrolle] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolle(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${scrolle ? 'header--scrolle' : ''}`}>
      <div className="container header__inner">
        <a href="#accueil" className="logo" onClick={() => setOuvert(false)}>
          <img src="logo.jpg" alt={entreprise.nom} className="logo__img" />
        </a>

        <button
          className="menu-toggle"
          aria-label="Ouvrir le menu"
          aria-expanded={ouvert}
          onClick={() => setOuvert(o => !o)}>
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${ouvert ? 'nav--ouvert' : ''}`}>
          {liens.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOuvert(false)}>
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn btn--primaire btn--petit"
            onClick={() => setOuvert(false)}>
            Nous contacter
          </a>
        </nav>
      </div>
    </header>
  );
}
