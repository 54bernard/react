import {etapes} from '../data.js';

export default function Process() {
  return (
    <section id="processus" className="section section--sombre">
      <div className="container">
        <div className="entete-section">
          <span className="surtitre">Simple et rapide</span>
          <h2>Comment acheter votre parcelle ?</h2>
        </div>
        <ol className="etapes">
          {etapes.map((e, i) => (
            <li key={e.titre} className="etape">
              <span className="etape__num">{i + 1}</span>
              <h3>{e.titre}</h3>
              <p>{e.texte}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
