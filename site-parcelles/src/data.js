// Toutes les informations modifiables du site sont regroupées ici.
// Remplacez les valeurs ci-dessous par celles de votre entreprise.

export const entreprise = {
  nom: 'Faso Parcelles',
  slogan: 'Votre terrain, votre avenir',
  telephone: '+226 70 00 00 00',
  whatsapp: '22670000000', // numéro au format international, sans "+" ni espaces
  email: 'contact@fasoparcelles.bf',
  adresse: 'Avenue Kwame Nkrumah, Ouagadougou, Burkina Faso',
  horaires: 'Lun – Ven : 8h – 17h30 · Sam : 9h – 13h',
  facebook: 'https://facebook.com/',
};

export const chiffres = [
  {valeur: '1 200+', libelle: 'Parcelles vendues'},
  {valeur: '15', libelle: 'Sites aménagés'},
  {valeur: '10 ans', libelle: "D'expérience"},
  {valeur: '100 %', libelle: 'Documents officiels'},
];

export const villes = ['Toutes', 'Ouagadougou', 'Bobo-Dioulasso', 'Koudougou'];

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
    couleur: '#c2410c',
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
    couleur: '#15803d',
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
    couleur: '#b45309',
  },
  {
    id: 4,
    nom: 'Cité Kénédougou',
    ville: 'Bobo-Dioulasso',
    quartier: 'Secteur 33',
    superficie: 300,
    prix: 3800000,
    document: 'ACD',
    statut: 'Disponible',
    atouts: ['Proche marché', 'Électricité', 'Voies latéritées'],
    couleur: '#0f766e',
  },
  {
    id: 5,
    nom: 'Domaine du Houet',
    ville: 'Bobo-Dioulasso',
    quartier: 'Lafiabougou',
    superficie: 500,
    prix: 6500000,
    document: 'Titre foncier',
    statut: 'Disponible',
    atouts: ['Idéal villa', 'Quartier résidentiel', 'Bitume'],
    couleur: '#9a3412',
  },
  {
    id: 6,
    nom: 'Cité du Boulkiemdé',
    ville: 'Koudougou',
    quartier: 'Secteur 9',
    superficie: 300,
    prix: 2500000,
    document: "Attestation d'attribution",
    statut: 'Disponible',
    atouts: ['Prix accessible', 'Proche université', 'Paiement échelonné'],
    couleur: '#166534',
  },
];

export const services = [
  {
    icone: '🗺️',
    titre: 'Vente de parcelles',
    texte:
      'Des terrains lotis et viabilisés dans les zones en pleine expansion de Ouagadougou, Bobo-Dioulasso et Koudougou.',
  },
  {
    icone: '📄',
    titre: 'Accompagnement administratif',
    texte:
      "Nous vous accompagnons pour l'obtention de l'ACD, du permis d'exploiter et du titre foncier auprès des services compétents.",
  },
  {
    icone: '📐',
    titre: 'Bornage & topographie',
    texte:
      'Implantation des bornes par un géomètre agréé et remise du plan de situation de votre parcelle.',
  },
  {
    icone: '🏠',
    titre: 'Construction clé en main',
    texte:
      'Après l’achat, nos partenaires construisent votre maison selon vos plans et votre budget.',
  },
  {
    icone: '💳',
    titre: 'Paiement échelonné',
    texte:
      "Réglez votre parcelle en plusieurs mensualités, sans frais cachés, via Orange Money, Moov Money ou virement.",
  },
  {
    icone: '🌍',
    titre: 'Service Diaspora',
    texte:
      'Vous vivez à l’étranger ? Visite vidéo, signature à distance et suivi de votre dossier en toute transparence.',
  },
];

export const etapes = [
  {
    titre: 'Choisissez',
    texte: 'Parcourez nos sites et contactez-nous pour la parcelle qui vous intéresse.',
  },
  {
    titre: 'Visitez',
    texte: 'Visite gratuite du site avec un de nos conseillers (ou en vidéo pour la diaspora).',
  },
  {
    titre: 'Réservez',
    texte: 'Versez un acompte et signez le contrat de réservation.',
  },
  {
    titre: 'Recevez vos papiers',
    texte: 'Bornage, remise des documents officiels et de votre plan de situation.',
  },
];

export const faq = [
  {
    question: 'Quels documents vais-je recevoir après l’achat ?',
    reponse:
      "Selon le site : une attestation d'attribution ou un Arrêté de Cession Définitive (ACD), accompagné du plan de situation et du procès-verbal de bornage. Nous vous accompagnons ensuite vers le titre foncier.",
  },
  {
    question: 'Puis-je payer en plusieurs fois ?',
    reponse:
      "Oui. Après un acompte, le solde peut être réglé en mensualités sur une durée de 6 à 24 mois selon la parcelle.",
  },
  {
    question: 'Je vis à l’étranger, puis-je acheter ?',
    reponse:
      'Absolument. Notre service Diaspora organise des visites vidéo, la signature à distance et l’envoi des documents.',
  },
  {
    question: 'Comment vérifier que la parcelle est légale ?',
    reponse:
      'Tous nos sites sont lotis et enregistrés auprès des services des domaines. Nous vous remettons les références pour que vous puissiez les vérifier vous-même.',
  },
];
