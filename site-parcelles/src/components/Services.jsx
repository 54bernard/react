import {services} from '../data.js';
import Icone from './Icone.jsx';

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="entete-section reveal">
          <span className="surtitre">Ce que nous faisons</span>
          <h2>Un accompagnement complet, du terrain à la maison</h2>
        </div>
        <div className="grille-services">
          {services.map((s, i) => (
            <article key={s.titre} className="service reveal" style={{transitionDelay: `${(i % 3) * 80}ms`}}>
              <span className="service__icone">
                <Icone nom={s.icone} size={26} />
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
