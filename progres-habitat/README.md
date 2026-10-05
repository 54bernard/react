# Progrès Habitat — plateforme immobilière de vente de terrains

Site et back-office de **Progrès Habitat** (BTP, génie civil et vente de parcelles — Dassasgho, Ouagadougou, Burkina Faso).

- **Site public** : accueil premium, catalogue avec filtres et carte, fiches terrain détaillées, zones, guide d’achat, FAQ, contact.
- **Administration** (`/admin`) : terrains (CRUD, photos, statuts, duplication, aperçu), CRM léger (prospects, relances), rendez-vous, témoignages, paramètres, statistiques.

> **Mode démonstration** : sans configuration Supabase, le site fonctionne immédiatement avec 12 terrains d’exemple
> (`lib/data/demo.ts`) et un bandeau « Mode démonstration ». L’administration est alors consultable en lecture seule.

---

## Sommaire

1. [Stack technique](#stack-technique)
2. [Démarrage rapide](#démarrage-rapide)
3. [Configurer Supabase](#configurer-supabase)
4. [Déployer sur Vercel](#déployer-sur-vercel)
5. [Variables d’environnement](#variables-denvironnement)
6. [Architecture](#architecture)
7. [Fonctionnalités](#fonctionnalités)
8. [SEO, performance, accessibilité](#seo-performance-accessibilité)
9. [Sécurité](#sécurité)
10. [Contenus à fournir avant la mise en ligne](#contenus-à-fournir-avant-la-mise-en-ligne)

---

## Stack technique

| Domaine | Choix |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Components, Server Actions), React 19, TypeScript strict |
| Design | Tailwind CSS 4, composants maison dans l’esprit shadcn/ui (Radix UI), Lucide React |
| Animations | Framer Motion (discrètes, désactivées si « réduire les animations ») |
| Données | Supabase (PostgreSQL, Auth, Storage, Row Level Security) |
| Formulaires | React Hook Form + Zod (validation client **et** serveur) |
| Cartographie | Google Maps (`@vis.gl/react-google-maps`) si une clé est fournie, sinon OpenStreetMap (Leaflet) sans clé |
| SEO | Metadata API, sitemap.xml, robots.txt, Open Graph, Twitter Cards, JSON-LD Schema.org |
| E-mails | Resend (API HTTP) — facultatif |
| Analytics | Google Analytics 4 + Meta Pixel — facultatifs |
| Hébergement | Vercel |

Polices (Plus Jakarta Sans, Fraunces) embarquées localement dans `app/fonts` : aucun appel externe, pas de décalage de mise en page.

---

## Démarrage rapide

Prérequis : **Node.js 20 ou plus**.

```bash
cd progres-habitat
npm install
cp .env.example .env.local   # facultatif pour le mode démo
npm run dev
```

Ouvrez <http://localhost:3000>. L’administration est sur <http://localhost:3000/admin>.

Autres commandes :

```bash
npm run build      # build de production
npm run start      # serveur de production
npm run lint       # ESLint
npm run typecheck  # TypeScript (tsc --noEmit)
```

---

## Configurer Supabase

1. **Créer un projet** sur <https://supabase.com> (région conseillée : `eu-west` / Europe, la plus proche de l’Afrique de l’Ouest).
2. **Créer la base** : *SQL Editor* → *New query* → collez le contenu de [`supabase/schema.sql`](supabase/schema.sql) → *Run*.
   Cela crée les tables, index, déclencheurs, règles RLS et les compartiments de stockage `property-images` (public) et `property-documents` (privé).
3. **Charger les données de départ** : exécutez de même [`supabase/seed.sql`](supabase/seed.sql)
   (paramètres de l’entreprise, 6 zones, 12 terrains d’exemple, FAQ). Les terrains d’exemple peuvent ensuite être modifiés ou supprimés depuis l’admin.
4. **Créer le compte administrateur** :
   - *Authentication* → *Users* → *Add user* → saisissez e-mail et mot de passe (cochez *Auto confirm user*).
   - Puis dans le *SQL Editor* :
     ```sql
     insert into public.admins (user_id, role)
     select id, 'admin' from auth.users where email = 'votre-email@exemple.com';
     ```
   - Les accès suivants se gèrent ensuite depuis **Admin → Utilisateurs** (rôles *admin* ou *éditeur*) : créez le compte
     dans *Authentication → Users*, puis donnez-lui l’accès par son e-mail.
5. **Désactiver les inscriptions publiques** : *Authentication* → *Providers* → *Email* → désactivez *Allow new users to sign up*
   (seuls les comptes que vous créez peuvent se connecter).
6. **Récupérer les clés** : *Project Settings* → *API* → copiez `Project URL` et la clé `anon public` dans `.env.local` :
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
7. Relancez `npm run dev` : le bandeau « Mode démonstration » disparaît, les formulaires enregistrent les demandes et l’admin devient modifiable.

> La clé `service_role` n’est **pas nécessaire** et ne doit jamais être ajoutée au projet : toutes les écritures passent
> par la session de l’administrateur, contrôlée par les règles RLS.

---

## Déployer sur Vercel

1. Poussez le dépôt sur GitHub.
2. Sur <https://vercel.com/new>, importez le dépôt.
3. **Root Directory** : `progres-habitat` (le projet est dans un sous-dossier). Framework détecté : Next.js.
4. Renseignez les **variables d’environnement** (voir ci-dessous), en particulier `NEXT_PUBLIC_SITE_URL` avec l’URL finale
   (ex. `https://www.progreshabitat.bf`).
5. *Deploy*. Ensuite, dans *Settings → Domains*, ajoutez votre nom de domaine.
6. Dans Supabase → *Authentication* → *URL Configuration*, mettez la même URL dans *Site URL*.
7. Déclarez le site dans [Google Search Console](https://search.google.com/search-console) et soumettez `https://votre-domaine/sitemap.xml`.

Les pages publiques sont régénérées automatiquement (ISR, 5 minutes) et immédiatement après chaque modification faite dans l’admin.

---

## Variables d’environnement

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | oui en production | URL publique (SEO, sitemap, liens de partage) |
| `NEXT_PUBLIC_SUPABASE_URL` | pour la production | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | pour la production | Clé publique « anon » (protégée par RLS) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | non | Active Google Maps (sinon OpenStreetMap). Restreignez la clé à votre domaine. |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | non | Map ID Google (marqueurs avancés) |
| `NEXT_PUBLIC_GA_ID` | non | Google Analytics 4 (`G-XXXXXXX`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | non | Meta Pixel |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` | non | Notification e-mail à chaque nouvelle demande (serveur uniquement) |
| `ALLOW_DEMO_ADMIN` | non | `true` autorise l’admin de démonstration en production (préproduction uniquement). Par défaut, sans Supabase, `/admin` est inaccessible en production. |

---

## Architecture

```
app/
  (site)/                 pages publiques (layout avec header/footer)
    page.tsx              accueil
    terrains/             catalogue (+ loading) et fiche /terrains/[slug]
    zones/ a-propos/ comment-acheter/ faq/ contact/ favoris/
    mentions-legales/ confidentialite/ conditions-generales/
  admin/
    connexion/            authentification Supabase
    (espace)/             back-office protégé : tableau de bord, terrains, clients, visites, localisations,
                          témoignages, FAQ, utilisateurs, paramètres (chaque section a son squelette de chargement)
    actions.ts            Server Actions d’administration (vérification admin + validation Zod)
  actions/                Server Actions publiques (formulaires, favoris, vues)
  sitemap.ts robots.ts manifest.ts not-found.tsx error.tsx global-error.tsx
components/
  ui/                     boutons, champs, accordéon, panneau latéral, squelettes…
  layout/                 header, footer, bannières, en-têtes de page
  home/                   sections de l’accueil
  property/               carte, galerie + lightbox, fiche, filtres, actions WhatsApp/visite
  map/                    carte Google Maps / Leaflet (chargées à la demande)
  forms/                  formulaires contact et visite
  admin/                  composants du back-office
  seo/ analytics/
lib/                      configuration, Supabase, SEO, utilitaires, données de démonstration
services/                 accès aux données (Supabase ou démo), e-mails
schemas/                  schémas Zod (filtres, formulaires, admin)
hooks/                    favoris, état de connexion
types/                    types TypeScript du domaine
supabase/                 schema.sql et seed.sql
public/                   logo, icônes, visuels
```

Principes : composants serveur par défaut, composants client uniquement pour l’interactivité ; accès aux données isolé
dans `services/` ; validation dans `schemas/` partagée entre client et serveur.

---

## Fonctionnalités

**Site public**
- Accueil : hero plein écran avec moteur de recherche, chiffres clés animés, terrains à la une, terrains populaires, zones,
  « Pourquoi nous choisir », processus d’achat en 6 étapes, carte interactive synchronisée, témoignages, CTA, FAQ.
- Catalogue `/terrains` : recherche texte, ville, quartier, prix min/max, surface min/max, type, statut, mode de paiement,
  tri (récent, prix, surface), vues **grille / liste / carte**, pagination, filtres synchronisés dans l’URL
  (ex. `/terrains?ville=Ouagadougou&minPrice=1000000`).
- Fiche terrain : galerie (glisser sur mobile, miniatures, lightbox clavier), prix, prix au m², statut, référence,
  description, caractéristiques (eau, électricité, accès, distance du goudron, topographie), documents, proximité,
  carte et coordonnées GPS, itinéraire, plan, simulation de paiement échelonné, terrains similaires.
- Boutons WhatsApp « intelligents » (message pré-rempli avec référence, localisation, prix et lien), appel, demande de
  visite (enregistrée dans Supabase), partage, favoris (barre d’action collante sur mobile).
- États gérés : chargement (squelettes), aucun résultat, erreur, terrain vendu/réservé, photo absente, connexion perdue,
  formulaire envoyé, erreurs de validation, 404 et 500.

**Administration** (`/admin`, menu : Tableau de bord, Terrains, Clients, Demandes de visite, Localisations,
Témoignages, FAQ, Utilisateurs, Paramètres)
- Tableau de bord : total, disponibles, réservés, vendus, leads de la semaine, demandes de visite, statistiques mensuelles
  (demandes et visites sur 6 mois), annonces les plus consultées, dernières demandes, prochaines visites.
- Terrains : liste avec recherche, onglets (statut, brouillons, archives), filtre par zone, tri et pagination ; formulaire
  en sections (informations générales, prix, surface, localisation, GPS, description, caractéristiques, photos, documents,
  SEO, statut) ; **photos par glisser-déposer**, réordonnables, image principale, texte alternatif ; **brouillon,
  publication, archivage, duplication**, aperçu de l’annonce, confirmation avant suppression.
- Clients (CRM) : recherche, filtres, pagination, statut, notes, relance, ajout manuel, export CSV, appel/WhatsApp direct.
- Demandes de visite : à venir / passées, statut, recherche, pagination.
- Localisations (zones), témoignages, FAQ, utilisateurs (rôles admin/éditeur), paramètres de l’entreprise.
- Notifications (toasts), squelettes de chargement, confirmations des actions destructives.

**Publication d’un terrain** : *brouillon* (invisible) → *publié* (visible, dans le sitemap) → *archivé* (retiré du site,
conservé dans l’admin). Les champs *Titre SEO* et *Description SEO* remplacent, s’ils sont remplis, le titre et la
description générés automatiquement.

---

## SEO, performance, accessibilité

- Titres dynamiques (ex. « Terrain à vendre à Saaba, secteur 3 – 300 m² | Progrès Habitat »), descriptions, URLs canoniques,
  Open Graph et Twitter Cards par terrain.
- JSON-LD : `Organization` + `RealEstateAgent`, `RealEstateListing` avec `Offer`, `Place` et `GeoCoordinates`,
  `BreadcrumbList`, `FAQPage`, `ItemList`.
- `sitemap.xml` (pages, zones, terrains) et `robots.txt` générés automatiquement ; les combinaisons de filtres ne sont pas indexées.
- Images optimisées (`next/image`, AVIF/WebP, tailles adaptées, lazy loading), image du hero prioritaire (LCP),
  polices locales, cartes chargées à la demande, ISR.
- Accessibilité : HTML sémantique, lien d’évitement, focus visibles, navigation clavier (menus, galerie, accordéons),
  `aria-*`, textes alternatifs, contrastes AA, respect de `prefers-reduced-motion`.
- PWA-ready : `manifest.webmanifest`, icônes, couleur de thème.

---

## Sécurité

- **Row Level Security** sur toutes les tables : le public ne peut que lire les contenus publiés et *créer* des demandes ;
  seules les personnes listées dans `admins` peuvent modifier les données ou téléverser des fichiers.
- Toutes les routes `/admin` (sauf la page de connexion) sont protégées par le middleware **et** vérifiées côté serveur
  dans chaque page, route et Server Action. Sans Supabase, l’admin de démonstration est refusée en production
  (sauf `ALLOW_DEMO_ADMIN=true`). Les pages admin sont exclues de l’indexation (`X-Robots-Tag: noindex`).
- Gestion des accès via des fonctions SQL `security definer` (`list_admin_users`, `grant_admin`, `revoke_admin`)
  réservées aux administrateurs ; un administrateur ne peut pas retirer son propre accès.
- Favoris anonymes écrits uniquement via la fonction `set_favorite` (aucune écriture directe du public sur la table).
- Export CSV protégé contre l’injection de formules.
- Validation Zod côté serveur, nettoyage des saisies (balises et caractères de contrôle supprimés).
- Anti-spam : champ piège invisible, délai minimum de remplissage, limitation de débit par IP, et déclencheur SQL
  limitant à 3 demandes par numéro toutes les 10 minutes.
- Fichiers : types MIME et taille contrôlés côté client **et** par le compartiment Supabase ; signature binaire vérifiée.
- En-têtes HTTP de sécurité (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).
- Aucune clé privée dans le code ; `.env.local` est ignoré par Git.

---

## Contenus à fournir avant la mise en ligne

Les éléments suivants sont des **exemples** à remplacer :

1. **Terrains** : les 12 terrains d’exemple (prix, quartiers, documents) → saisissez vos vraies offres dans l’admin.
2. **Photos** : les visuels actuels sont des illustrations générées. Ajoutez vos photos (terrains, chantiers, équipe)
   depuis l’admin ; remplacez aussi `public/images/hero.webp` et `public/images/apropos.webp` par vos meilleures photos.
3. **Coordonnées** : e-mail et horaires (vides par défaut) dans *Admin → Paramètres*.
4. **Témoignages** : uniquement de vrais avis, avec l’accord des clients. La section reste masquée tant qu’aucun n’est publié.
5. **Chiffres clés** : laissés vides, ils sont calculés automatiquement à partir de vos données. N’indiquez que des chiffres vérifiables.
6. **Mentions légales** : complétez le RCCM et l’IFU si vous souhaitez les afficher.
