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
            <rect width="400" height="320" rx="24" fill="#fde9cf" />
            <circle cx="320" cy="70" r="36" fill="#f67f09" />
            <path d="M0 220 Q100 170 200 210 T400 200 V320 H0Z" fill="#2b9a82" />
            <path d="M0 250 Q120 215 220 245 T400 240 V320 H0Z" fill="#1e846f" />
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
                  fill={r === 1 && c === 2 ? '#1e846f' : '#ffffff'}
                  stroke="#334e59"
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
            Basée à Dassasgho (Ouagadougou), <strong>{entreprise.nom}</strong>{' '}
            est une entreprise de BTP et génie civil qui aide les familles
            burkinabè et la diaspora à devenir propriétaires à{' '}
            {entreprise.zones}. Nous proposons des parcelles loties, vous
            accompagnons dans les démarches administratives et pouvons
            construire votre maison.
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
