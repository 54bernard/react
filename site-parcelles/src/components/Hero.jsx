import {entreprise, atoutsCles} from '../data.js';

export default function Hero() {
  return (
    <section id="accueil" className="hero">
      <div className="hero__fond" aria-hidden="true">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="rgba(255,255,255,0.06)"
            d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,229.3C1120,235,1280,213,1360,202.7L1440,192L1440,320L0,320Z"
          />
        </svg>
      </div>
      <div className="container hero__inner">
        <div className="hero__texte">
          <span className="badge">🇧🇫 {entreprise.activite}</span>
          <h1>
            {entreprise.slogan}.
            <br />
            <span className="surligne">Achetez votre parcelle</span> en toute
            sécurité.
          </h1>
          <p>
            Terrains lotis à {entreprise.zones}. Documents officiels, bornage,
            paiement échelonné et construction de votre maison par nos
            équipes BTP.
          </p>
          <div className="hero__actions">
            <a href="#parcelles" className="btn btn--primaire">
              Voir les parcelles
            </a>
            <a href="#contact" className="btn btn--contour">
              Planifier une visite
            </a>
          </div>
        </div>

        <ul className="chiffres">
          {atoutsCles.map(c => (
            <li key={c.libelle}>
              <strong>{c.valeur}</strong>
              <span>{c.libelle}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
