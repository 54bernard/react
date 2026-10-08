# Progrès Habitat — site vitrine

*Construire aujourd'hui un meilleur demain*

Site statique (HTML, CSS, JavaScript sans dépendance) construit sur la charte graphique Progrès Habitat.

## Lancer le site

Ouvrez `index.html` dans un navigateur, ou servez le dossier :

```bash
cd progres-habitat
python3 -m http.server 8000   # puis http://localhost:8000
```

## Structure

| Fichier | Rôle |
| --- | --- |
| `index.html` | Page d'accueil : hero, recherche, catégories, biens, atouts, services, diaspora, avis, contact |
| `charte.html` | Référence visuelle de la charte (couleurs, polices, boutons, badges, sections) |
| `css/styles.css` | Toute la charte sous forme de variables `--ph-*` et de composants |
| `js/main.js` | Liste des biens (`PROPERTIES`), filtres, favoris, formulaire, menu mobile |
| `assets/` | Logo et favicon (SVG) |

## Charte appliquée

- **Couleurs** : bleu pétrole `#0F5D5E` (principale), orange doré `#F59E0B` (accent), anthracite `#1F2937` (texte), gris clair `#F3F4F6` et blanc (fonds), succès `#10B981`, alerte `#EF4444`, information `#3B82F6`, avertissement `#FACC15`.
- **Typographies** : Poppins Bold/SemiBold pour les titres, Inter Regular/Medium pour les textes (Google Fonts).
- **Boutons** (`.btn--primary` orange, `.btn--secondary` bleu pétrole, `.btn--whatsapp` vert, `.btn--tertiary` bordure), coins arrondis.
- **Badges** : Disponible, Réservé, Vendu, Loué, À la une, Nouveau, Exclusivité, Bonne affaire, Urgent.
- **Sections** alternées : `.section--light`, `.section--neutral`, `.section--premium`, `.section--accent`, avec la vague orange et bleue.

## À personnaliser avant la mise en ligne

- Numéro WhatsApp / téléphone (`22600000000`), adresse e-mail et adresse de l'agence.
- Biens réels dans `PROPERTIES` (`js/main.js`) et vos propres photos (les photos actuelles sont des exemples Unsplash).
- Envoi du formulaire de contact (actuellement un simple message de confirmation).
- Liens des réseaux sociaux et chiffres clés.
- Remplacer `assets/logo.svg` par le fichier vectoriel officiel du logo s'il est disponible.
