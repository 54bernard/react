# Progrès Habitat — site vitrine

Site vitrine (React + Vite) de **Progrès Habitat** (BTP, génie civil et vente de parcelles), basée à Dassasgho, Ouagadougou — Burkina Faso.

## Sections

- **Accueil** : accroche, boutons d'action et chiffres clés
- **À propos** : présentation et valeurs de l'entreprise
- **Parcelles** : catalogue filtrable par ville (Ouagadougou, Tenkodogo) et par budget (prix en FCFA, superficie, type de document : ACD, attestation d'attribution, titre foncier)
- **Services** : vente, accompagnement administratif, bornage, construction, paiement échelonné, service Diaspora
- **Comment acheter** : les 4 étapes de l'achat
- **FAQ**
- **Contact** : coordonnées et formulaire qui ouvre WhatsApp avec le message pré-rempli (aucun serveur nécessaire)
- Bouton WhatsApp flottant

## Personnaliser

Toutes les informations (nom de l'entreprise, téléphone, WhatsApp, adresse, parcelles, prix, services, FAQ) se trouvent dans **`src/data.js`**. Les coordonnées sont réelles ; **les parcelles et les prix sont des exemples à remplacer**. Le logo est dans `public/logo.jpg`.

## Lancer le site

```bash
cd site-parcelles
npm install
npm run dev      # serveur de développement
npm run build    # génère le site statique dans dist/
```

Le dossier `dist/` peut être hébergé tel quel sur n'importe quel hébergeur statique (Netlify, Vercel, GitHub Pages, cPanel…).
