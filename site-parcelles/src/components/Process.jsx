import {etapes} from '../data.js';

export default function Process() {
  return (
    <section id="processus" className="section">
      <div className="container">
        <div className="entete-section reveal">
          <span className="surtitre">Simple et rapide</span>
          <h2>Comment acheter votre parcelle</h2>
        </div>
        <ol className="etapes">
          {etapes.map((e, i) => (
            <li key={e.titre} className="etape reveal" style={{transitionDelay: `${i * 90}ms`}}>
              <span className="etape__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{e.titre}</h3>
              <p>{e.texte}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
