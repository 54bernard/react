import {ArrowRight, FileText, Search, ShieldCheck} from 'lucide-react';
import {entreprise, pointsForts, villes} from '../data.js';
import {SceneAccueil, Visuel} from './Illustrations.jsx';
import Icone from './Icone.jsx';

export default function Hero({filtres, setFiltres}) {
  const rechercher = e => {
    e.preventDefault();
    document.getElementById('parcelles')?.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <section id="accueil" className="hero">
      <div className="container hero__grille">
        <div className="hero__texte">
          <span className="etiquette">
            <span className="etiquette__point" /> {entreprise.activite}
          </span>
          <h1>
            Bâtissons <span className="degrade">votre avenir</span> ensemble.
          </h1>
          <p className="hero__intro">
            Devenez propriétaire en toute sérénité : parcelles loties à {entreprise.zones}, documents officiels,
            paiement échelonné et construction de votre maison par nos équipes BTP.
          </p>
          <div className="hero__actions">
            <a href="#parcelles" className="btn btn--primaire btn--grand">
              Voir les parcelles <ArrowRight size={18} />
            </a>
            <a href="#contact" className="btn btn--secondaire btn--grand">
              Planifier une visite
            </a>
          </div>
        </div>

        <div className="hero__visuel">
          <Visuel photo={entreprise.photoAccueil} alt={`Parcelle ${entreprise.nom}`} className="hero__photo">
            <SceneAccueil />
          </Visuel>
          <div className="flottant flottant--haut">
            <span className="flottant__icone"><ShieldCheck size={20} /></span>
            <div>
              <strong>Documents officiels</strong>
              <small>ACD · Attestation · Titre foncier</small>
            </div>
          </div>
          <div className="flottant flottant--bas">
            <span className="flottant__icone flottant__icone--orange"><FileText size={20} /></span>
            <div>
              <strong>Paiement échelonné</strong>
              <small>Jusqu’à 24 mois</small>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <form className="recherche" onSubmit={rechercher} aria-label="Rechercher une parcelle">
          <label className="recherche__champ">
            <span>Ville</span>
            <select value={filtres.ville} onChange={e => setFiltres(f => ({...f, ville: e.target.value}))}>
              {villes.map(v => (
                <option key={v} value={v}>
                  {v === 'Toutes' ? 'Toutes les villes' : v}
                </option>
              ))}
            </select>
          </label>
          <label className="recherche__champ">
            <span>Budget maximum</span>
            <select
              value={filtres.budgetMax}
              onChange={e => setFiltres(f => ({...f, budgetMax: Number(e.target.value)}))}>
              <option value={0}>Tous les prix</option>
              <option value={3000000}>3 000 000 FCFA</option>
              <option value={5000000}>5 000 000 FCFA</option>
              <option value={8000000}>8 000 000 FCFA</option>
            </select>
          </label>
          <button type="submit" className="btn btn--primaire btn--grand recherche__btn">
            <Search size={18} /> Rechercher
          </button>
        </form>

        <ul className="points-forts">
          {pointsForts.map(p => (
            <li key={p.titre}>
              <span className="points-forts__icone">
                <Icone nom={p.icone} size={22} />
              </span>
              <div>
                <strong>{p.titre}</strong>
                <span>{p.texte}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
