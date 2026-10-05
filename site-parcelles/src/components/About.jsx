import {Check} from 'lucide-react';
import {entreprise} from '../data.js';
import {VueAerienne} from './Illustrations.jsx';

const valeurs = [
  'Sites lotis et documents officiels vérifiables',
  'Prix affichés, contrat clair, aucun frais caché',
  'Une équipe BTP pour construire votre maison',
  'Un suivi avant, pendant et après votre achat',
];

export default function About() {
  return (
    <section id="apropos" className="section">
      <div className="container apropos">
        <div className="apropos__visuel reveal">
          <div className="apropos__cadre">
            <VueAerienne variante={2} />
          </div>
          <div className="apropos__badge">
            <strong>2</strong>
            <span>villes : Ouagadougou &amp; Tenkodogo</span>
          </div>
        </div>
        <div className="reveal">
          <span className="surtitre">À propos de nous</span>
          <h2>Un partenaire de confiance pour devenir propriétaire</h2>
          <p className="texte-doux">
            Basée à Dassasgho (Ouagadougou), <strong>{entreprise.nom}</strong> est une entreprise de BTP et de génie
            civil. Nous aidons les familles burkinabè et la diaspora à acquérir une parcelle à {entreprise.zones}, puis
            à y construire leur maison.
          </p>
          <ul className="liste-check">
            {valeurs.map(v => (
              <li key={v}>
                <span aria-hidden="true">
                  <Check size={16} strokeWidth={3} />
                </span>
                {v}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn--sombre">
            Parler à un conseiller
          </a>
        </div>
      </div>
    </section>
  );
}
