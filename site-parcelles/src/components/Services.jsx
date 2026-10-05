import {services} from '../data.js';

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="entete-section">
          <span className="surtitre">Ce que nous faisons</span>
          <h2>Nos services</h2>
          <p>Un accompagnement complet, du choix du terrain à la construction.</p>
        </div>
        <div className="grille-services">
          {services.map(s => (
            <article key={s.titre} className="service">
              <span className="service__icone" aria-hidden="true">
                {s.icone}
              </span>
              <h3>{s.titre}</h3>
              <p>{s.texte}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
