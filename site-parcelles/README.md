# Progrès Habitat — site vitrine

Site vitrine (React + Vite) de **Progrès Habitat** (BTP, génie civil et vente de parcelles), basée à Dassasgho, Ouagadougou — Burkina Faso.

## Sections

- Barre d'infos (adresse, téléphone, Facebook) et menu fixe
- **Accueil** : titre, illustration, barre de recherche (ville, budget) et points forts
- **À propos**
- **Parcelles** : catalogue filtrable par ville (Ouagadougou, Tenkodogo) et par budget
- **Services**
- **Construction** (BTP & génie civil)
- **Comment acheter** : les 4 étapes
- **FAQ**
- **Contact** : coordonnées, carte Google Maps et formulaire qui ouvre WhatsApp (aucun serveur nécessaire)
- Bandeau d'appel à l'action, pied de page et bouton WhatsApp flottant

## Personnaliser

Toutes les informations se trouvent dans **`src/data.js`**. Les coordonnées sont réelles ; **les parcelles et les prix sont des exemples à remplacer**.

### Ajouter des photos

1. Déposez vos photos dans `public/photos/` (format paysage, idéalement 1600 px de large).
2. Indiquez leur nom dans `src/data.js` :
   - `photoAccueil` : grande image de l'accueil ;
   - `photoConstruction` : photo d'un chantier ;
   - `photo` de chaque parcelle.

Tant qu'un champ photo est vide, une illustration est affichée à la place.

## Lancer le site

```bash
cd site-parcelles
npm install
npm run dev      # serveur de développement
npm run build    # génère le site statique dans dist/
```

Le dossier `dist/` peut être hébergé tel quel sur n'importe quel hébergeur statique (Netlify, Vercel, GitHub Pages, cPanel…).
