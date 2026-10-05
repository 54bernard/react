import {FileText, MapPin, Maximize2} from 'lucide-react';
import {parcelles, villes} from '../data.js';
import {formatFCFA, lienWhatsApp} from '../utils.js';
import {IconeWhatsApp, VueAerienne, Visuel} from './Illustrations.jsx';

export default function Parcelles({filtres, setFiltres}) {
  const {ville, budgetMax} = filtres;
  const liste = parcelles.filter(
    p => (ville === 'Toutes' || p.ville === ville) && (budgetMax === 0 || p.prix <= budgetMax),
  );

  return (
    <section id="parcelles" className="section section--teinte">
      <div className="container">
        <div className="entete-section entete-section--ligne reveal">
          <div>
            <span className="surtitre">Nos offres</span>
            <h2>Parcelles disponibles</h2>
            <p className="texte-doux">Trouvez le terrain qui correspond à votre projet et à votre budget.</p>
          </div>
          <div className="onglets" role="group" aria-label="Filtrer par ville">
            {villes.map(v => (
              <button
                key={v}
                className={`onglet ${ville === v ? 'onglet--actif' : ''}`}
                aria-pressed={ville === v}
                onClick={() => setFiltres(f => ({...f, ville: v}))}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {budgetMax > 0 && (
          <p className="filtre-actif">
            Budget maximum : <strong>{formatFCFA(budgetMax)}</strong>
            <button onClick={() => setFiltres(f => ({...f, budgetMax: 0}))}>Retirer</button>
          </p>
        )}

        {liste.length === 0 ? (
          <div className="vide">
            <p>Aucune parcelle ne correspond à ces critères pour le moment.</p>
            <a href="#contact" className="btn btn--primaire">
              Être informé des nouveaux sites
            </a>
          </div>
        ) : (
          <div className="grille-cartes">
            {liste.map(p => (
              <article key={p.id} className="carte">
                <div className="carte__media">
                  <Visuel photo={p.photo} alt={p.nom}>
                    <VueAerienne variante={p.id - 1} />
                  </Visuel>
                  <span className={`carte__statut ${p.statut !== 'Disponible' ? 'carte__statut--alerte' : ''}`}>
                    {p.statut}
                  </span>
                  <span className="carte__ville">{p.ville}</span>
                </div>
                <div className="carte__corps">
                  <p className="carte__lieu">
                    <MapPin size={15} aria-hidden="true" /> {p.quartier}, {p.ville}
                  </p>
                  <h3>{p.nom}</h3>
                  <div className="carte__specs">
                    <span>
                      <Maximize2 size={16} aria-hidden="true" /> {p.superficie} m²
                    </span>
                    <span>
                      <FileText size={16} aria-hidden="true" /> {p.document}
                    </span>
                  </div>
                  <ul className="carte__atouts">
                    {p.atouts.map(a => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                  <div className="carte__pied">
                    <div>
                      <span className="carte__apartir">Prix</span>
                      <strong className="carte__prix">{formatFCFA(p.prix)}</strong>
                    </div>
                    <a
                      className="btn btn--whatsapp"
                      href={lienWhatsApp(`Bonjour, je suis intéressé(e) par la parcelle "${p.nom}" (${p.quartier}, ${p.ville}).`)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Demander des informations sur ${p.nom} via WhatsApp`}>
                      <IconeWhatsApp size={18} /> Infos
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
