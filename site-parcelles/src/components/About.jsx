import {entreprise} from '../data.js';

const valeurs = [
  {titre: 'Sécurité juridique', texte: 'Chaque parcelle est lotie et dispose de documents vérifiables.'},
  {titre: 'Transparence', texte: 'Prix affichés, aucun frais caché, contrat clair.'},
  {titre: 'Proximité', texte: 'Une équipe disponible avant, pendant et après votre achat.'},
];

export default function About() {
  return (
    <section id="apropos" className="section">
      <div className="container apropos">
        <div className="apropos__visuel" aria-hidden="true">
          <svg viewBox="0 0 400 320" role="img">
            <rect width="400" height="320" rx="24" fill="#fde68a" />
            <circle cx="320" cy="70" r="36" fill="#f59e0b" />
            <path d="M0 220 Q100 170 200 210 T400 200 V320 H0Z" fill="#d97706" />
            <path d="M0 250 Q120 215 220 245 T400 240 V320 H0Z" fill="#b45309" />
            {/* Plan de lotissement */}
            {[0, 1, 2].map(r =>
              [0, 1, 2, 3].map(c => (
                <rect
                  key={`${r}-${c}`}
                  x={60 + c * 72}
                  y={60 + r * 42}
                  width="62"
                  height="34"
                  rx="4"
                  fill={r === 1 && c === 2 ? '#ef2b2d' : '#fffbeb'}
                  stroke="#92400e"
                  strokeWidth="2"
                />
              )),
            )}
            <text x="235" y="124" fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle">
              Vendu
            </text>
          </svg>
        </div>
        <div>
          <span className="surtitre">À propos de nous</span>
          <h2>Un partenaire de confiance pour devenir propriétaire</h2>
          <p>
            Depuis plus de 10 ans, <strong>{entreprise.nom}</strong> aide les
            familles burkinabè et la diaspora à acquérir un terrain en toute
            sérénité. Nous aménageons des sites lotis, accompagnons nos clients
            dans leurs démarches administratives et garantissons la remise de
            documents officiels.
          </p>
          <ul className="valeurs">
            {valeurs.map(v => (
              <li key={v.titre}>
                <span className="valeurs__check" aria-hidden="true">✓</span>
                <div>
                  <strong>{v.titre}</strong>
                  <p>{v.texte}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
