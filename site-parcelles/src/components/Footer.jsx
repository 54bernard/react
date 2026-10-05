import {entreprise} from '../data.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <a href="#accueil" className="logo logo--clair">
            <img src="logo.jpg" alt={entreprise.nom} className="logo__img" />
          </a>
          <p>{entreprise.slogan}.</p>
        </div>
        <nav className="footer__liens">
          <a href="#parcelles">Parcelles</a>
          <a href="#services">Services</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
          <a href={entreprise.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </nav>
      </div>
      <div className="footer__bas">
        <div className="container">
          © {new Date().getFullYear()} {entreprise.nom} · {entreprise.adresse}
        </div>
      </div>
      <div className="drapeau" aria-hidden="true">
        <span />
        <span />
      </div>
    </footer>
  );
}
