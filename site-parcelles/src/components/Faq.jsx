import {Phone, Plus} from 'lucide-react';
import {entreprise, faq} from '../data.js';
import {lienTel} from '../utils.js';

export default function Faq() {
  return (
    <section id="faq" className="section section--teinte">
      <div className="container faq-grille">
        <div className="reveal">
          <span className="surtitre">Vos questions</span>
          <h2>Questions fréquentes</h2>
          <p className="texte-doux">Vous ne trouvez pas votre réponse ? Notre équipe vous répond directement.</p>
          <div className="carte-appel">
            <span className="carte-appel__icone">
              <Phone size={22} />
            </span>
            <div>
              <small>Appelez-nous</small>
              <a href={lienTel}>{entreprise.telephone}</a>
            </div>
          </div>
        </div>
        <div className="faq reveal">
          {faq.map((q, i) => (
            <details key={q.question} className="faq__item" open={i === 0}>
              <summary>
                {q.question}
                <span className="faq__plus" aria-hidden="true">
                  <Plus size={18} />
                </span>
              </summary>
              <p>{q.reponse}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
