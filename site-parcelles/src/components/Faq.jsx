import {faq} from '../data.js';

export default function Faq() {
  return (
    <section id="faq" className="section">
      <div className="container container--etroit">
        <div className="entete-section">
          <span className="surtitre">Vos questions</span>
          <h2>Questions fréquentes</h2>
        </div>
        <div className="faq">
          {faq.map(q => (
            <details key={q.question} className="faq__item">
              <summary>{q.question}</summary>
              <p>{q.reponse}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
