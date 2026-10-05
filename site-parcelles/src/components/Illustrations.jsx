// Illustrations vectorielles utilisées tant qu'aucune photo n'est fournie.

const C = {
  teal: '#1e846f',
  tealClair: '#3fa58c',
  ardoise: '#263c45',
  orange: '#f67f09',
  sable: '#f3e3c7',
  laterite: '#c9773a',
};

function Arbre({x, y, s = 1}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="-4" width="6" height="34" rx="2" fill="#6b4a2f" />
      <ellipse cx="0" cy="-18" rx="34" ry="14" fill={C.teal} />
      <ellipse cx="-14" cy="-26" rx="20" ry="10" fill={C.tealClair} />
      <ellipse cx="14" cy="-24" rx="18" ry="9" fill="#2a9a7f" />
    </g>
  );
}

export function SceneAccueil() {
  return (
    <svg viewBox="0 0 560 460" className="illu" role="img" aria-label="Illustration d'une maison moderne sur sa parcelle">
      <defs>
        <linearGradient id="ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe7cc" />
          <stop offset="1" stopColor="#fff7ee" />
        </linearGradient>
        <linearGradient id="sol" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3a46b" />
          <stop offset="1" stopColor={C.laterite} />
        </linearGradient>
        <linearGradient id="vitre" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bfe3da" />
          <stop offset="1" stopColor="#7fbfb0" />
        </linearGradient>
      </defs>
      <rect width="560" height="460" rx="28" fill="url(#ciel)" />
      <circle cx="450" cy="92" r="46" fill={C.orange} opacity="0.9" />
      <circle cx="450" cy="92" r="70" fill={C.orange} opacity="0.12" />
      {/* Collines */}
      <path d="M0 300 Q140 240 280 280 T560 260 V460 H0Z" fill="#9fd1c3" opacity="0.6" />
      {/* Sol latérite */}
      <path d="M0 330 Q200 300 560 320 V460 H0Z" fill="url(#sol)" />
      {/* Maison */}
      <g>
        <rect x="150" y="196" width="250" height="140" fill="#fbfbf9" />
        <rect x="150" y="196" width="250" height="14" fill={C.ardoise} />
        <rect x="300" y="150" width="140" height="70" fill="#f1f1ec" />
        <rect x="292" y="140" width="156" height="12" rx="2" fill={C.ardoise} />
        <rect x="140" y="186" width="160" height="12" rx="2" fill={C.ardoise} />
        <rect x="318" y="164" width="104" height="40" rx="3" fill="url(#vitre)" />
        <rect x="170" y="228" width="70" height="56" rx="3" fill="url(#vitre)" />
        <rect x="256" y="240" width="44" height="96" rx="3" fill={C.teal} />
        <circle cx="292" cy="290" r="3" fill={C.orange} />
        <rect x="318" y="236" width="64" height="48" rx="3" fill="url(#vitre)" />
        <rect x="150" y="300" width="250" height="36" fill="#e9e6de" />
        <rect x="240" y="336" width="76" height="10" fill="#d8d2c4" />
      </g>
      {/* Clôture */}
      <g fill="#fff" opacity="0.9">
        <rect x="60" y="342" width="440" height="8" rx="2" />
        {Array.from({length: 23}).map((_, i) => (
          <rect key={i} x={62 + i * 19.5} y="326" width="5" height="24" rx="1" />
        ))}
      </g>
      <Arbre x={90} y={300} s={1.25} />
      <Arbre x={470} y={302} s={1.05} />
      {/* Bornes */}
      {[60, 500].map(x => (
        <g key={x}>
          <rect x={x - 5} y="352" width="10" height="16" fill={C.orange} />
          <rect x={x - 5} y="352" width="10" height="4" fill="#fff" />
        </g>
      ))}
      <path d="M60 400 H500" stroke="#fff" strokeWidth="2" strokeDasharray="6 6" />
      <rect x="236" y="388" width="88" height="24" rx="12" fill="#fff" />
      <text x="280" y="405" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ardoise}>
        20 m
      </text>
    </svg>
  );
}

// Vue aérienne d'un lotissement ; `variante` change la disposition.
export function VueAerienne({variante = 0}) {
  const fonds = ['#d7b88f', '#cfae84', '#dcc199', '#d2b088', '#d9bb92', '#cdab80'];
  const cible = [3, 6, 1, 8, 5, 2][variante % 6];
  // Arbres le long des routes, à l'écart des étiquettes posées en haut des cartes.
  const positions = [[60, 80], [134, 150], [230, 108], [290, 160], [20, 108], [176, 80], [100, 180]];
  const arbres = positions.filter((_, i) => (i + variante) % 3 !== 0);
  return (
    <svg viewBox="0 0 320 190" className="illu illu--aerienne" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="320" height="190" fill={fonds[variante % 6]} />
      {/* Routes */}
      <rect x="0" y="86" width="320" height="18" fill="#a88d6c" />
      <rect x="148" y="0" width="16" height="190" fill="#a88d6c" />
      <path d="M0 95 H320" stroke="#efe2cc" strokeWidth="1.5" strokeDasharray="8 8" />
      {/* Parcelles */}
      {[0, 1].map(bloc =>
        [0, 1].map(cote =>
          [0, 1, 2].map(i => {
            const n = bloc * 6 + cote * 3 + i;
            const x = cote === 0 ? 12 + i * 44 : 176 + i * 44;
            const y = bloc === 0 ? 14 : 114;
            const choisie = n === cible;
            return (
              <g key={n}>
                <rect
                  x={x}
                  y={y}
                  width="40"
                  height="62"
                  rx="2"
                  fill={choisie ? 'rgba(246,127,9,0.35)' : 'rgba(255,255,255,0.18)'}
                  stroke={choisie ? C.orange : 'rgba(255,255,255,0.75)'}
                  strokeWidth={choisie ? 2.5 : 1.2}
                  strokeDasharray={choisie ? '0' : '3 3'}
                />
                {choisie && <circle cx={x + 20} cy={y + 31} r="6" fill={C.orange} stroke="#fff" strokeWidth="2" />}
              </g>
            );
          }),
        ),
      )}
      {arbres.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill={C.teal} opacity="0.9" />
          <circle cx={x - 3} cy={y - 3} r="5" fill={C.tealClair} />
        </g>
      ))}
      {/* Boussole */}
      <g transform="translate(300 172)">
        <circle r="11" fill="rgba(255,255,255,0.85)" />
        <path d="M0 -8 L3 0 L0 8 L-3 0Z" fill={C.ardoise} />
        <path d="M0 -8 L3 0 L-3 0Z" fill={C.orange} />
      </g>
    </svg>
  );
}

export function SceneChantier() {
  return (
    <svg viewBox="0 0 520 420" className="illu" role="img" aria-label="Illustration d'un chantier de construction">
      <rect width="520" height="420" rx="28" fill="#2f4952" />
      <circle cx="420" cy="80" r="40" fill={C.orange} opacity="0.85" />
      <path d="M0 340 H520 V420 H0Z" fill="#b8763f" />
      {/* Grue */}
      <g stroke="#f6b35c" strokeWidth="5" fill="none">
        <path d="M90 340 V60" />
        <path d="M60 60 H380" />
        <path d="M90 60 L130 20 L170 60" />
        <path d="M330 60 V130" strokeWidth="2" />
      </g>
      <rect x="312" y="130" width="36" height="22" fill={C.orange} />
      {/* Bâtiment en construction */}
      <g>
        <rect x="190" y="190" width="220" height="150" fill="#e8e4da" />
        {[0, 1, 2].map(r =>
          [0, 1, 2, 3].map(c => (
            <rect key={`${r}${c}`} x={206 + c * 50} y={204 + r * 44} width="34" height="28" fill="#9fbfb7" />
          )),
        )}
        <rect x="190" y="180" width="220" height="10" fill="#cfc8b8" />
        {/* Échafaudage */}
        <g stroke={C.orange} strokeWidth="3">
          <path d="M180 120 V340 M420 120 V340 M180 180 H420 M180 120 H420" />
          <path d="M180 120 L420 180 M180 180 L420 120" strokeWidth="1.5" opacity="0.6" />
        </g>
        <rect x="190" y="130" width="220" height="50" fill="none" stroke="#e8e4da" strokeWidth="3" strokeDasharray="10 6" />
      </g>
      {/* Parpaings */}
      {[0, 1, 2].map(i => (
        <rect key={i} x={40 + i * 30} y="318" width="26" height="22" fill="#d6d0c2" stroke="#b5ad9c" />
      ))}
      <rect x="55" y="296" width="26" height="22" fill="#d6d0c2" stroke="#b5ad9c" />
    </svg>
  );
}

// Affiche la photo si elle est fournie, sinon l'illustration.
export function Visuel({photo, alt, children, className = ''}) {
  if (photo) return <img src={photo} alt={alt} className={`photo ${className}`} loading="lazy" />;
  return children;
}

export function IconeWhatsApp({size = 22}) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.2c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3zm0 23.2c-2 0-3.9-.5-5.5-1.5l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.8C5.3 9.8 10.1 5 16 5s10.7 4.8 10.7 10.6S21.9 26.2 16 26.2zm5.9-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
    </svg>
  );
}

export function IconeFacebook({size = 20}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3z" />
    </svg>
  );
}
