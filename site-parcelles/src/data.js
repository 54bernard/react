// Toutes les informations modifiables du site sont regroupées ici.
// Les parcelles listées plus bas sont des exemples à remplacer par les offres réelles.

export const entreprise = {
  nom: 'Progrès Habitat',
  slogan: 'Bâtissons votre avenir ensemble',
  activite: 'BTP · Génie civil · Vente de parcelles',
  telephone: '+226 67 98 57 54',
  whatsapp: '22667985754', // numéro au format international, sans "+" ni espaces
  adresse: 'Dassasgho, Ouagadougou, Burkina Faso',
  zones: 'Ouagadougou et Tenkodogo',
  facebook: 'https://www.facebook.com/share/19aSfUwzeb/',
};

export const atoutsCles = [
  {valeur: 'Ouaga & Tenkodogo', libelle: 'Nos zones d’intervention'},
  {valeur: 'BTP', libelle: 'Génie civil & construction'},
  {valeur: 'Officiels', libelle: 'Documents remis à l’achat'},
  {valeur: 'Échelonné', libelle: 'Paiement adapté à votre budget'},
];

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
    couleur: '#1e846f',
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
    couleur: '#334e59',
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
    couleur: '#d96f08',
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
    couleur: '#176b5a',
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
    couleur: '#f67f09',
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
    couleur: '#2b5f6b',
  },
];

export const services = [
  {
    icone: '🗺️',
    titre: 'Vente de parcelles',
    texte:
      'Des terrains lotis et viabilisés dans les zones en pleine expansion de Ouagadougou et Tenkodogo.',
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
    titre: 'BTP & construction',
    texte:
      'Entreprise de génie civil, nous construisons votre maison clé en main selon vos plans et votre budget.',
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
