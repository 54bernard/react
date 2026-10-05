import {useState} from 'react';
import {parcelles, villes} from '../data.js';
import {formatFCFA, lienWhatsApp} from '../utils.js';

function PlanParcelle({couleur}) {
  return (
    <svg viewBox="0 0 300 160" className="carte__plan" aria-hidden="true">
      <rect width="300" height="160" fill={couleur} />
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none">
        <path d="M0 80 H300" strokeWidth="10" stroke="rgba(255,255,255,0.18)" />
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={`h${i}`} x={10 + i * 58} y="12" width="50" height="56" rx="3" />
        ))}
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={`b${i}`} x={10 + i * 58} y="92" width="50" height="56" rx="3" />
        ))}
      </g>
      <rect x="126" y="12" width="50" height="56" rx="3" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}

export default function Parcelles() {
  const [ville, setVille] = useState('Toutes');
  const [budgetMax, setBudgetMax] = useState(0);

  const liste = parcelles.filter(
    p =>
      (ville === 'Toutes' || p.ville === ville) &&
      (budgetMax === 0 || p.prix <= budgetMax),
  );

  return (
    <section id="parcelles" className="section section--teinte">
      <div className="container">
        <div className="entete-section">
          <span className="surtitre">Nos offres</span>
          <h2>Parcelles disponibles</h2>
          <p>Trouvez le terrain qui correspond à votre projet et à votre budget.</p>
        </div>

        <div className="filtres">
          <div className="filtres__villes" role="group" aria-label="Filtrer par ville">
            {villes.map(v => (
              <button
                key={v}
                className={`puce ${ville === v ? 'puce--active' : ''}`}
                aria-pressed={ville === v}
                onClick={() => setVille(v)}>
                {v}
              </button>
            ))}
          </div>
          <label className="filtres__budget">
            Budget max.
            <select
              value={budgetMax}
              onChange={e => setBudgetMax(Number(e.target.value))}>
              <option value={0}>Tous les prix</option>
              <option value={3000000}>3 000 000 FCFA</option>
              <option value={5000000}>5 000 000 FCFA</option>
              <option value={8000000}>8 000 000 FCFA</option>
            </select>
          </label>
        </div>

        {liste.length === 0 ? (
          <p className="vide">
            Aucune parcelle ne correspond à ces critères pour le moment.{' '}
            <a href="#contact">Contactez-nous</a>, de nouveaux sites arrivent
            régulièrement.
          </p>
        ) : (
          <div className="grille-cartes">
            {liste.map(p => (
              <article key={p.id} className="carte">
                <div className="carte__media">
                  <PlanParcelle couleur={p.couleur} />
                  <span className="carte__statut">{p.statut}</span>
                </div>
                <div className="carte__corps">
                  <p className="carte__lieu">
                    📍 {p.quartier}, {p.ville}
                  </p>
                  <h3>{p.nom}</h3>
                  <dl className="carte__infos">
                    <div>
                      <dt>Superficie</dt>
                      <dd>{p.superficie} m²</dd>
                    </div>
                    <div>
                      <dt>Document</dt>
                      <dd>{p.document}</dd>
                    </div>
                  </dl>
                  <ul className="carte__atouts">
                    {p.atouts.map(a => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                  <div className="carte__pied">
                    <div>
                      <span className="carte__apartir">À partir de</span>
                      <strong className="carte__prix">{formatFCFA(p.prix)}</strong>
                    </div>
                    <a
                      className="btn btn--primaire btn--petit"
                      href={lienWhatsApp(
                        `Bonjour, je suis intéressé(e) par la parcelle "${p.nom}" (${p.quartier}, ${p.ville}).`,
                      )}
                      target="_blank"
                      rel="noreferrer">
                      Je suis intéressé
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
