import {useState} from 'react';
import {entreprise, parcelles} from '../data.js';
import {lienWhatsApp} from '../utils.js';

export default function Contact() {
  const [form, setForm] = useState({nom: '', telephone: '', site: '', message: ''});

  const maj = champ => e => setForm(f => ({...f, [champ]: e.target.value}));

  // Le formulaire envoie la demande sur WhatsApp : aucun serveur n'est nécessaire.
  const envoyer = e => {
    e.preventDefault();
    const texte = [
      `Bonjour ${entreprise.nom},`,
      `Je m'appelle ${form.nom} (${form.telephone}).`,
      form.site ? `Je suis intéressé(e) par : ${form.site}.` : '',
      form.message,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(lienWhatsApp(texte), '_blank', 'noopener');
  };

  return (
    <section id="contact" className="section section--teinte">
      <div className="container contact">
        <div className="contact__infos">
          <span className="surtitre">Contact</span>
          <h2>Parlons de votre projet</h2>
          <p>
            Une question, une visite à planifier ? Notre équipe vous répond
            rapidement.
          </p>
          <ul className="coordonnees">
            <li>
              <span aria-hidden="true">📞</span>
              <a href={`tel:${entreprise.telephone.replace(/\s/g, '')}`}>
                {entreprise.telephone}
              </a>
            </li>
            <li>
              <span aria-hidden="true">💬</span>
              <a href={lienWhatsApp(`Bonjour ${entreprise.nom} !`)} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <span aria-hidden="true">📍</span>
              {entreprise.adresse}
            </li>
            <li>
              <span aria-hidden="true">👍</span>
              <a href={entreprise.facebook} target="_blank" rel="noreferrer">
                Page Facebook
              </a>
            </li>
          </ul>
        </div>

        <form className="formulaire" onSubmit={envoyer}>
          <label>
            Nom complet
            <input required value={form.nom} onChange={maj('nom')} placeholder="Ex. : Aminata Ouédraogo" />
          </label>
          <label>
            Téléphone
            <input
              required
              type="tel"
              value={form.telephone}
              onChange={maj('telephone')}
              placeholder="+226 ..."
            />
          </label>
          <label>
            Site qui vous intéresse
            <select value={form.site} onChange={maj('site')}>
              <option value="">— Je ne sais pas encore —</option>
              {parcelles.map(p => (
                <option key={p.id} value={`${p.nom} (${p.ville})`}>
                  {p.nom} — {p.ville}
                </option>
              ))}
            </select>
          </label>
          <label>
            Message
            <textarea
              rows="4"
              value={form.message}
              onChange={maj('message')}
              placeholder="Votre budget, vos disponibilités pour une visite..."
            />
          </label>
          <button type="submit" className="btn btn--primaire">
            Envoyer via WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
