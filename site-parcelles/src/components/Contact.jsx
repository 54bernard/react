import {useState} from 'react';
import {MapPin, Phone, Send} from 'lucide-react';
import {entreprise, parcelles} from '../data.js';
import {lienTel, lienWhatsApp} from '../utils.js';
import {IconeFacebook, IconeWhatsApp} from './Illustrations.jsx';

export default function Contact() {
  const [form, setForm] = useState({nom: '', telephone: '', objet: '', message: ''});
  const maj = champ => e => setForm(f => ({...f, [champ]: e.target.value}));

  // Le formulaire envoie la demande sur WhatsApp : aucun serveur n'est nécessaire.
  const envoyer = e => {
    e.preventDefault();
    const texte = [
      `Bonjour ${entreprise.nom},`,
      `Je m'appelle ${form.nom} (${form.telephone}).`,
      form.objet ? `Objet : ${form.objet}.` : '',
      form.message,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(lienWhatsApp(texte), '_blank', 'noopener');
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="entete-section reveal">
          <span className="surtitre">Contact</span>
          <h2>Parlons de votre projet</h2>
          <p className="texte-doux">Une question, une visite à planifier, un devis ? Nous vous répondons rapidement.</p>
        </div>

        <div className="contact reveal">
          <div className="contact__infos">
            <a href={lienTel} className="coord">
              <span className="coord__icone"><Phone size={20} /></span>
              <div>
                <small>Téléphone</small>
                <strong>{entreprise.telephone}</strong>
              </div>
            </a>
            <a
              href={lienWhatsApp(`Bonjour ${entreprise.nom} !`)}
              target="_blank"
              rel="noreferrer"
              className="coord">
              <span className="coord__icone coord__icone--wa"><IconeWhatsApp size={20} /></span>
              <div>
                <small>WhatsApp</small>
                <strong>Écrivez-nous</strong>
              </div>
            </a>
            <a href={entreprise.facebook} target="_blank" rel="noreferrer" className="coord">
              <span className="coord__icone coord__icone--fb"><IconeFacebook size={20} /></span>
              <div>
                <small>Facebook</small>
                <strong>{entreprise.nom}</strong>
              </div>
            </a>
            <div className="coord">
              <span className="coord__icone"><MapPin size={20} /></span>
              <div>
                <small>Bureau</small>
                <strong>Dassasgho, Ouagadougou</strong>
              </div>
            </div>
            <iframe
              className="carte-map"
              title={`Localisation de ${entreprise.nom}`}
              src={entreprise.carte}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <form className="formulaire" onSubmit={envoyer}>
            <h3>Envoyez-nous un message</h3>
            <div className="formulaire__ligne">
              <label>
                Nom complet
                <input required value={form.nom} onChange={maj('nom')} placeholder="Ex. : Aminata Ouédraogo" />
              </label>
              <label>
                Téléphone
                <input required type="tel" value={form.telephone} onChange={maj('telephone')} placeholder="+226 ..." />
              </label>
            </div>
            <label>
              Votre demande
              <select value={form.objet} onChange={maj('objet')}>
                <option value="">— Choisir —</option>
                <optgroup label="Parcelles">
                  {parcelles.map(p => (
                    <option key={p.id} value={`Parcelle ${p.nom} (${p.ville})`}>
                      {p.nom} — {p.ville}
                    </option>
                  ))}
                </optgroup>
                <option value="Devis de construction">Devis de construction</option>
                <option value="Visite d'un site">Visite d'un site</option>
                <option value="Autre demande">Autre demande</option>
              </select>
            </label>
            <label>
              Message
              <textarea
                rows="5"
                value={form.message}
                onChange={maj('message')}
                placeholder="Votre budget, vos disponibilités pour une visite..."
              />
            </label>
            <button type="submit" className="btn btn--primaire btn--grand">
              <Send size={18} /> Envoyer via WhatsApp
            </button>
            <small className="formulaire__note">Votre message s’ouvrira dans WhatsApp, prêt à être envoyé.</small>
          </form>
        </div>
      </div>
    </section>
  );
}
