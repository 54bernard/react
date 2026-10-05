import {Check, HardHat} from 'lucide-react';
import {construction, entreprise} from '../data.js';
import {SceneChantier, Visuel} from './Illustrations.jsx';

export default function Construction() {
  return (
    <section id="construction" className="section section--sombre">
      <div className="container construction">
        <div className="reveal">
          <span className="surtitre">BTP &amp; génie civil</span>
          <h2>Votre parcelle achetée, nous construisons votre maison</h2>
          <p className="construction__intro">
            {entreprise.nom} réalise vos travaux de A à Z avec ses propres équipes : un seul interlocuteur, du choix
            du terrain à la remise des clés.
          </p>
          <ul className="liste-check liste-check--clair">
            {construction.map(c => (
              <li key={c}>
                <span aria-hidden="true">
                  <Check size={16} strokeWidth={3} />
                </span>
                {c}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn--primaire btn--grand">
            <HardHat size={18} /> Demander un devis gratuit
          </a>
        </div>
        <div className="construction__visuel reveal">
          <Visuel photo={entreprise.photoConstruction} alt="Chantier Progrès Habitat">
            <SceneChantier />
          </Visuel>
        </div>
      </div>
    </section>
  );
}
