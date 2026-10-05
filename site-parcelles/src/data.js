// Toutes les informations modifiables du site sont regroupées ici.
//
// PHOTOS : déposez vos images dans le dossier public/photos/ puis indiquez
// leur nom dans les champs `photo` ci-dessous (ex. photo: 'photos/saaba.jpg').
// Tant qu'un champ `photo` est vide, une illustration est affichée à la place.
//
// Les parcelles listées plus bas sont des EXEMPLES à remplacer par les offres réelles.

export const entreprise = {
  nom: 'Progrès Habitat',
  slogan: 'Bâtissons votre avenir ensemble',
  activite: 'BTP · Génie civil · Vente de parcelles',
  telephone: '+226 67 98 57 54',
  whatsapp: '22667985754', // numéro au format international, sans "+" ni espaces
  adresse: 'Dassasgho, Ouagadougou, Burkina Faso',
  zones: 'Ouagadougou et Tenkodogo',
  facebook: 'https://www.facebook.com/share/19aSfUwzeb/',
  carte: 'https://maps.google.com/maps?q=Dassasgho,+Ouagadougou&z=14&output=embed',
  photoAccueil: '', // grande photo de l'accueil (ex. 'photos/accueil.jpg')
  photoConstruction: '', // photo d'un chantier (ex. 'photos/chantier.jpg')
};

export const villes = ['Toutes', 'Ouagadougou', 'Tenkodogo'];

export const parcelles = [
  {
    id: 1,
    nom: 'Cité Les Palmiers',
    ville: 'Ouagadougou',
    quartier: 'Ouaga 2000 (extension)',
    superficie: 300,
    prix: 7500000,
    document: 'ACD',
    statut: 'Disponible',
    atouts: ['Bitume à 200 m', 'Eau ONEA', 'Électricité SONABEL'],
    photo: '',
  },
  {
    id: 2,
    nom: 'Résidence Wend-Panga',
    ville: 'Ouagadougou',
    quartier: 'Saaba',
    superficie: 250,
    prix: 3500000,
    document: "Attestation d'attribution",
    statut: 'Disponible',
    atouts: ['Zone lotie', 'Proche école', 'Paiement échelonné'],
    photo: '',
  },
  {
    id: 3,
    nom: 'Les Jardins de Komsilga',
    ville: 'Ouagadougou',
    quartier: 'Komsilga',
    superficie: 400,
    prix: 4200000,
    document: 'ACD',
    statut: 'Dernières parcelles',
    atouts: ['Parcelle d’angle', 'Voies tracées', 'Calme'],
    photo: '',
  },
  {
    id: 4,
    nom: 'Cité du Boulgou',
    ville: 'Tenkodogo',
    quartier: 'Secteur 5',
    superficie: 300,
    prix: 3800000,
    document: 'ACD',
    statut: 'Disponible',
    atouts: ['Proche marché', 'Électricité', 'Voies latéritées'],
    photo: '',
  },
  {
    id: 5,
    nom: 'Domaine Zoungrana',
    ville: 'Tenkodogo',
    quartier: 'Secteur 3',
    superficie: 500,
    prix: 6500000,
    document: 'Titre foncier',
    statut: 'Disponible',
    atouts: ['Idéal villa', 'Quartier résidentiel', 'Bitume'],
    photo: '',
  },
  {
    id: 6,
    nom: 'Résidence Dassasgho',
    ville: 'Ouagadougou',
    quartier: 'Dassasgho',
    superficie: 300,
    prix: 2500000,
    document: "Attestation d'attribution",
    statut: 'Disponible',
    atouts: ['Prix accessible', 'Proche des commodités', 'Paiement échelonné'],
    photo: '',
  },
];

// `icone` : nom d'une icône de la bibliothèque Lucide (https://lucide.dev/icons)
export const pointsForts = [
  {icone: 'ShieldCheck', titre: 'Sécurité juridique', texte: 'Sites lotis et documents officiels vérifiables.'},
  {icone: 'Wallet', titre: 'Paiement échelonné', texte: 'Orange Money, Moov Money ou virement.'},
  {icone: 'HardHat', titre: 'Expertise BTP', texte: 'Nous construisons aussi votre maison.'},
  {icone: 'Globe', titre: 'Service Diaspora', texte: 'Achat et suivi à distance en toute confiance.'},
];

export const services = [
  {
    icone: 'Map',
    titre: 'Vente de parcelles',
    texte: 'Terrains lotis dans les zones en pleine expansion de Ouagadougou et Tenkodogo.',
  },
  {
    icone: 'FileCheck',
    titre: 'Accompagnement administratif',
    texte: "Obtention de l'ACD, du permis d'exploiter et du titre foncier auprès des services compétents.",
  },
  {
    icone: 'Ruler',
    titre: 'Bornage & topographie',
    texte: 'Implantation des bornes par un géomètre agréé et remise du plan de situation.',
  },
  {
    icone: 'Building2',
    titre: 'BTP & construction',
    texte: 'Construction de votre maison clé en main, selon vos plans et votre budget.',
  },
  {
    icone: 'Wallet',
    titre: 'Paiement échelonné',
    texte: 'Réglez votre parcelle en plusieurs mensualités, sans frais cachés.',
  },
  {
    icone: 'Globe',
    titre: 'Service Diaspora',
    texte: 'Visite vidéo, signature à distance et suivi de votre dossier en toute transparence.',
  },
];

export const construction = [
  'Étude de sol, plans et devis détaillé',
  'Gros œuvre, toiture et second œuvre',
  'Suivi de chantier et rapports photo réguliers',
  'Remise des clés dans les délais convenus',
];

export const etapes = [
  {titre: 'Choisissez', texte: 'Parcourez nos sites et contactez-nous pour la parcelle qui vous intéresse.'},
  {titre: 'Visitez', texte: 'Visite gratuite du site avec un conseiller, ou en vidéo pour la diaspora.'},
  {titre: 'Réservez', texte: 'Versez un acompte et signez le contrat de réservation.'},
  {titre: 'Recevez vos papiers', texte: 'Bornage, remise des documents officiels et du plan de situation.'},
];

export const faq = [
  {
    question: 'Quels documents vais-je recevoir après l’achat ?',
    reponse:
      "Selon le site : une attestation d'attribution ou un Arrêté de Cession Définitive (ACD), accompagné du plan de situation et du procès-verbal de bornage. Nous vous accompagnons ensuite vers le titre foncier.",
  },
  {
    question: 'Puis-je payer en plusieurs fois ?',
    reponse: 'Oui. Après un acompte, le solde peut être réglé en mensualités sur une durée de 6 à 24 mois selon la parcelle.',
  },
  {
    question: 'Je vis à l’étranger, puis-je acheter ?',
    reponse: 'Absolument. Notre service Diaspora organise des visites vidéo, la signature à distance et l’envoi des documents.',
  },
  {
    question: 'Pouvez-vous construire ma maison sur la parcelle ?',
    reponse: 'Oui, Progrès Habitat est une entreprise de BTP et génie civil : plans, devis, construction et suivi de chantier.',
  },
  {
    question: 'Comment vérifier que la parcelle est légale ?',
    reponse:
      'Tous nos sites sont lotis et enregistrés auprès des services des domaines. Nous vous remettons les références pour que vous puissiez les vérifier vous-même.',
  },
];
