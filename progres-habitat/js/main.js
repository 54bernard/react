/* Progrès Habitat — interactions du site */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * Catalogue des biens. Pour ajouter un bien, ajoutez un objet ici.
   * status  : disponible | reserve | vendu | loue
   * tags    : une | nouveau | exclusivite | bonne-affaire | urgent
   * ------------------------------------------------------------------ */
  var PROPERTIES = [
    {
      ref: 'PH-0048', title: 'Villa moderne – Ouaga 2000', type: 'villa',
      city: 'Ouagadougou', area: 'Ouaga 2000', surface: 250, rooms: 5,
      price: 120000000, status: 'disponible', tags: ['une'],
      photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=75'
    },
    {
      ref: 'PH-0051', title: 'Maison familiale – Patte d’Oie', type: 'maison',
      city: 'Ouagadougou', area: 'Patte d’Oie', surface: 180, rooms: 4,
      price: 65000000, status: 'disponible', tags: ['nouveau'],
      photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=75'
    },
    {
      ref: 'PH-0039', title: 'Appartement standing – Koulouba', type: 'appartement',
      city: 'Ouagadougou', area: 'Koulouba', surface: 110, rooms: 3,
      price: 350000, period: '/ mois', status: 'loue', tags: [], forRent: true,
      photo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=75'
    },
    {
      ref: 'PH-0055', title: 'Terrain viabilisé avec titre foncier', type: 'terrain',
      city: 'Bobo-Dioulasso', area: 'Sarfalao', surface: 600, rooms: null,
      price: 18000000, status: 'disponible', tags: ['bonne-affaire'],
      photo: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=75'
    },
    {
      ref: 'PH-0044', title: 'Villa avec piscine – Ouaga 2000', type: 'villa',
      city: 'Ouagadougou', area: 'Ouaga 2000', surface: 420, rooms: 7,
      price: 245000000, status: 'reserve', tags: ['exclusivite'],
      photo: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=75'
    },
    {
      ref: 'PH-0058', title: 'Ferme agricole 5 hectares', type: 'ferme',
      city: 'Koudougou', area: 'Route de Sabou', surface: 50000, rooms: null,
      price: 40000000, status: 'disponible', tags: ['urgent'],
      photo: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=900&q=75'
    }
  ];

  var STATUS_LABEL = { disponible: 'Disponible', reserve: 'Réservé', vendu: 'Vendu', loue: 'Loué' };
  var TAG_LABEL = { une: 'À la une', nouveau: 'Nouveau', exclusivite: 'Exclusivité', 'bonne-affaire': 'Bonne affaire', urgent: 'Urgent' };

  function fcfa(n) {
    return n.toLocaleString('fr-FR').replace(/ | /g, ' ') + ' FCFA';
  }
  function surface(m2) {
    return m2 >= 10000 ? (m2 / 10000).toLocaleString('fr-FR') + ' ha' : m2.toLocaleString('fr-FR') + ' m²';
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(id) { return '<svg aria-hidden="true"><use href="#' + id + '"/></svg>'; }

  /* Sécurité : toute donnée d'un bien est considérée comme non fiable
     (elle viendra de l'espace admin). On n'accepte que des valeurs connues,
     des nombres et des URL https ; tout le reste est échappé. */
  var TYPES = ['villa', 'maison', 'appartement', 'terrain', 'ferme', 'location'];
  function num(n) { n = Number(n); return isFinite(n) && n >= 0 ? n : 0; }
  function safeUrl(u) {
    u = String(u || '');
    return /^https:\/\//i.test(u) || /^\/?[\w\-./]+$/.test(u) ? u : '';
  }

  function card(p) {
    var type = TYPES.indexOf(p.type) !== -1 ? p.type : '';
    var status = STATUS_LABEL.hasOwnProperty(p.status) ? p.status : 'disponible';
    var tags = (Array.isArray(p.tags) ? p.tags : []).filter(function (t) { return TAG_LABEL.hasOwnProperty(t); });
    var ref = esc(p.ref);
    var rooms = Math.floor(num(p.rooms));

    var badges = tags.map(function (t) {
      return '<span class="badge badge--' + t + '">' + TAG_LABEL[t] + '</span>';
    });
    badges.push('<span class="badge badge--' + status + '">' + STATUS_LABEL[status] + '</span>');

    var price = fcfa(num(p.price)) + (p.period ? ' <small>' + esc(p.period) + '</small>' : '');
    var photo = safeUrl(p.photo);

    return '' +
      '<article class="property" data-type="' + type + (p.forRent ? ' location' : '') + '" data-city="' + esc(p.city) + '" data-price="' + num(p.price) + '" data-search="' + esc((p.title + ' ' + p.ref + ' ' + p.city + ' ' + p.area).toLowerCase()) + '">' +
        '<div class="property__media">' +
          (photo ? '<img src="' + esc(photo) + '" alt="' + esc(p.title) + '" loading="lazy">' : '') +
          '<div class="property__badges">' + badges.join('') + '</div>' +
          '<button class="fav" type="button" aria-pressed="false" aria-label="Ajouter ' + esc(p.title) + ' aux favoris" data-ref="' + ref + '">' + icon('i-heart') + '</button>' +
        '</div>' +
        '<div class="property__body">' +
          '<h3 class="property__title">' + esc(p.title) + '</h3>' +
          '<p class="property__ref">Réf : ' + ref + '</p>' +
          '<ul class="property__meta">' +
            '<li>' + icon('i-pin') + esc(p.area) + ', ' + esc(p.city) + '</li>' +
            '<li class="row"><span>' + icon('i-area') + surface(num(p.surface)) + '</span>' +
              (rooms ? '<span>' + icon('i-rooms') + rooms + ' pièces</span>' : '') +
            '</li>' +
          '</ul>' +
          '<div class="property__foot">' +
            '<span class="property__price">' + price + '</span>' +
            '<a class="btn btn--secondary btn--sm" href="#contact" data-ref="' + ref + '">Voir le bien ' + icon('i-arrow') + '</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  var list = document.getElementById('listings');
  var empty = document.getElementById('listings-empty');
  list.innerHTML = PROPERTIES.map(card).join('');

  /* Photo introuvable : on la retire pour laisser le fond aux couleurs de la charte.
     (Pas d'attribut onerror dans le HTML, pour permettre une CSP stricte.) */
  document.addEventListener('error', function (e) {
    if (e.target.tagName === 'IMG' && e.target.closest('.property__media, .split__media')) e.target.remove();
  }, true);

  /* ---------------- Filtres ---------------- */
  var state = { type: '', q: '', city: '', min: 0, max: Infinity };

  function apply() {
    var shown = 0;
    list.querySelectorAll('.property').forEach(function (el) {
      var types = el.dataset.type.split(' ');
      var price = Number(el.dataset.price);
      var ok = (!state.type || types.indexOf(state.type) !== -1 || (state.type === 'maison' && types[0] === 'villa')) &&
               (!state.q || el.dataset.search.indexOf(state.q) !== -1) &&
               (!state.city || el.dataset.city === state.city) &&
               price >= state.min && price <= state.max;
      el.hidden = !ok;
      if (ok) shown++;
    });
    empty.hidden = shown !== 0;
  }

  var chips = document.querySelectorAll('.chip');
  function setType(type) {
    state.type = type;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === type)); });
    apply();
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { setType(c.dataset.filter); }); });
  document.querySelectorAll('.category[data-filter]').forEach(function (a) {
    a.addEventListener('click', function () { setType(a.dataset.filter); });
  });

  document.getElementById('search').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    state.q = f.q.value.trim().toLowerCase();
    state.city = f.ville.value;
    state.min = Number(f.min.value) || 0;
    state.max = Number(f.max.value) || Infinity;
    setType(f.type.value);
    document.getElementById('biens').scrollIntoView();
  });

  /* ---------------- Favoris (mémorisés dans le navigateur) ---------------- */
  var favs = [];
  try { favs = JSON.parse(localStorage.getItem('ph-favs') || '[]'); } catch (e) { favs = []; }
  list.querySelectorAll('.fav').forEach(function (b) {
    if (favs.indexOf(b.dataset.ref) !== -1) b.setAttribute('aria-pressed', 'true');
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      favs = favs.filter(function (r) { return r !== b.dataset.ref; });
      if (on) favs.push(b.dataset.ref);
      try { localStorage.setItem('ph-favs', JSON.stringify(favs)); } catch (e) { /* stockage indisponible */ }
    });
  });

  /* « Voir le bien » pré-remplit le formulaire de contact avec la référence */
  list.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-ref]');
    if (!link) return;
    var msg = document.getElementById('c-msg');
    msg.value = 'Bonjour, je souhaite visiter le bien réf. ' + link.dataset.ref + '.';
  });

  /* ---------------- Formulaire de contact ---------------- */
  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    if (!f.checkValidity()) { f.reportValidity(); return; }
    var ok = document.getElementById('contact-ok');
    var btn = f.querySelector('button[type="submit"]');
    btn.disabled = true;
    // Envoi vers Netlify Forms (demandes visibles dans le tableau de bord Netlify)
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(f)).toString()
    }).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      ok.className = 'alert alert--success';
      ok.textContent = 'Merci ! Votre demande a bien été envoyée, un conseiller vous recontacte rapidement.';
      f.reset();
    }).catch(function () {
      ok.className = 'alert alert--error';
      ok.textContent = 'L’envoi a échoué. Réessayez ou contactez-nous directement sur WhatsApp.';
    }).then(function () {
      ok.hidden = false;
      btn.disabled = false;
    });
  });

  /* ---------------- Menu mobile ---------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
