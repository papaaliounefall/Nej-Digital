import {
  Product,
  PhilosophyPillar,
  DnaValue,
  TeamMember
} from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'sunumall',
    number: '01',
    name: 'SunuMall',
    category: 'Commerce digital',
    tagline: 'Tout le Sénégal dans une seule plateforme',
    description: 'Une marketplace qui rassemble boutiques et marchands sénégalais en un seul endroit, avec recherche par catégorie, livraison partout au pays et paiement mobile intégré.',
    impact: 'Encore en phase de déploiement : notre priorité est d\'accompagner les premières boutiques pilotes avant d\'ouvrir plus largement.',
    metrics: [
      { label: 'Paiement', value: 'Wave · OM · CB' },
      { label: 'Couverture', value: 'Sénégal' },
      { label: 'Boutiques', value: 'Multi-catégories' },
      { label: 'Support', value: '24/7' }
    ],
    status: 'Déploiement',
    targetAudience: 'Boutiques, commerçants et artisans sénégalais, acheteurs en ligne',
    imageUrl: '/SunuMall.webp'
  },
  {
    id: 'orientasn',
    number: '02',
    name: 'OrientaSn',
    category: 'Éducation & Orientation',
    tagline: 'Votre orientation, notre mission nationale',
    description: 'La plateforme qui guide chaque bachelier sénégalais vers la filière et l\'établissement qui correspondent à son profil, avec un test d\'orientation assisté par IA et des conseillers certifiés.',
    impact: 'Plateforme en cours de déploiement auprès des premiers établissements et bacheliers partenaires.',
    metrics: [
      { label: 'Parcours', value: 'Bachelier · Établissement' },
      { label: 'Accompagnement', value: 'Conseillers certifiés' },
      { label: 'Moteur', value: 'Recommandation IA' },
      { label: 'Couverture', value: 'Sénégal' }
    ],
    status: 'Déploiement',
    targetAudience: 'Bacheliers, lycéens, établissements scolaires et universitaires',
    imageUrl: '/Orientasn.webp'
  },
  {
    id: 'agrimarket',
    number: '03',
    name: 'AgriMarket',
    category: 'Agriculture & Commerce',
    tagline: 'Les récoltes du Sénégal, directement des champs',
    description: 'Une plateforme qui connecte producteurs et marchés en direct, avec cours en temps réel, paiement sécurisé par séquestre mobile money et bourse de fret certifiée pour la logistique rurale.',
    impact: 'Déploiement en cours sur les grands terroirs agricoles du pays, aux côtés des premiers producteurs et transporteurs partenaires.',
    metrics: [
      { label: 'Terroirs couverts', value: '4 régions' },
      { label: 'Paiement', value: 'Séquestre Wave/OM' },
      { label: 'Logistique', value: 'Fret certifié' },
      { label: 'Cours', value: 'Temps réel' }
    ],
    status: 'Déploiement',
    targetAudience: 'Producteurs, coopératives, transporteurs et acheteurs de gros',
    imageUrl: '/AgriMarket.webp'
  },
  {
    id: 'hadrasmart',
    number: '04',
    name: 'HadraSmart',
    category: 'Ville intelligente & Événementiel',
    tagline: 'Le système nerveux numérique de Tivaouane',
    description: 'Une plateforme au service des pèlerins et du Comité d\'Organisation de la Hadra (COSKAS) : orientation, sécurité et coordination en temps réel entre les équipes de terrain, lors du grand rassemblement religieux de Tivaouane.',
    impact: 'Plus de 240 000 pèlerins connectés lors du dernier événement, avec une prise en charge des demandes en moins de 3 minutes.',
    metrics: [
      { label: 'Pèlerins connectés', value: '240K+' },
      { label: 'Prise en charge', value: '< 3 min' },
      { label: 'Sources validées', value: '100%' },
      { label: 'Langues', value: '3' }
    ],
    status: 'Production',
    targetAudience: 'Pèlerins, familles religieuses et comité d\'organisation (COSKAS)',
    imageUrl: '/HadraSmart.webp'
  },
  {
    id: 'minifoot',
    number: '05',
    name: 'MiniFoot',
    category: 'Sport & Réservation',
    tagline: 'Réservez un terrain de foot en quelques secondes',
    description: 'Une plateforme de réservation de terrains synthétiques à Dakar, avec disponibilité en temps réel, géolocalisation et tableau de bord dédié aux propriétaires de terrains.',
    impact: 'Premiers terrains partenaires en ligne à Dakar (Almadies, Mermoz), plateforme en cours d\'extension à d\'autres quartiers.',
    metrics: [
      { label: 'Réservation', value: 'Instantanée' },
      { label: 'Recherche', value: 'Par quartier' },
      { label: 'Équipements', value: 'Éclairage · Douches · Parking' },
      { label: 'Gestion', value: 'Tableau de bord organisations' }
    ],
    status: 'Déploiement',
    targetAudience: 'Joueurs amateurs, organisateurs de matchs, propriétaires de terrains synthétiques',
    imageUrl: '/minifoot.webp'
  },
  {
    id: 'sunucar',
    number: '06',
    name: 'SunuCar',
    category: 'Mobilité & Location',
    tagline: 'Louez, vendez et gérez votre flotte depuis une seule app',
    description: 'Une plateforme qui connecte propriétaires de véhicules et clients au Sénégal, avec paiement Wave et Orange Money, vérification d\'identité intégrée et tableaux de bord de gestion de flotte.',
    impact: 'Plateforme en phase de test, avec les premiers véhicules pilotes en ligne avant l\'ouverture à davantage de propriétaires.',
    metrics: [
      { label: 'Paiement', value: 'Wave · OM' },
      { label: 'Vérification', value: 'KYC inclus' },
      { label: 'Essai', value: '14 jours gratuit' },
      { label: 'Gestion', value: 'Flotte tout-en-un' }
    ],
    status: 'Beta Active',
    targetAudience: 'Propriétaires de véhicules, loueurs professionnels, particuliers',
    imageUrl: '/sunucar.webp'
  }
];

export const PHILOSOPHY_PILLARS: PhilosophyPillar[] = [
  { number: '01', title: 'Comprendre' },
  { number: '02', title: 'Imaginer' },
  { number: '03', title: 'Construire' },
  { number: '04', title: 'Transformer' }
];

export const DNA_VALUES: DnaValue[] = [
  {
    name: 'Jeunesse',
    headline: 'Une génération qui ose créer.',
    description: 'Nous incarnons l\'énergie d\'une jeunesse instruite, audacieuse et résolue à prendre les commandes de son destin technologique plutôt que de subir des solutions inadaptées.',
    indicator: 'Moyenne d\'âge de 25 ans avec une rigueur d\'ingénierie internationale.'
  },
  {
    name: 'Innovation',
    headline: 'Des idées transformées en solutions concrètes.',
    description: 'L\'innovation chez NEJ Digitale n\'est pas un slogan abstrait : c\'est la capacité à livrer des outils fonctionnels qui règlent un vrai problème dès le premier jour.',
    indicator: '6 produits en déploiement, chacun répondant à un goulet d\'étranglement concret.'
  },
  {
    name: 'Impact',
    headline: 'La technologie doit améliorer quelque chose.',
    description: 'Chaque fonctionnalité que nous déployons doit avoir une justification concrète : faire gagner du temps, sécuriser un revenu ou ouvrir une nouvelle perspective d\'avenir.',
    indicator: 'Mesure systématique du retour sur utilité pour les utilisateurs finaux.'
  },
  {
    name: 'Excellence',
    headline: 'Nous voulons construire des produits dont nous sommes fiers.',
    description: 'Nous refusons les compromis sur la qualité du code, la précision du design et la fiabilité des infrastructures. Le "Made in Senegal" doit être synonyme d\'excellence.',
    indicator: 'Standards d\'ingénierie et d\'accessibilité stricts dès le premier déploiement.'
  },
  {
    name: 'Ambition',
    headline: 'Commencer localement, penser sans frontières.',
    description: 'Nos racines sont à Dakar et dans les terroirs du Sénégal, mais nos architectures et notre vision sont conçues pour l\'échelle continentale et mondiale.',
    indicator: 'Roadmap panafricaine structurée vers la CEDEAO et l\'Afrique subsaharienne.'
  }
];

// TODO: un 4e profil (la présidente) reste à ajouter dès que sa photo est disponible.
export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Papa Alioune Fall',
    role: 'Cofondateur & Secrétaire Général',
    secondaryRole: 'Software Engineer',
    bio: 'Cofondateur de NEJ Digital, il coordonne les activités administratives et organisationnelles de la structure tout en concevant et développant ses solutions numériques.',
    location: 'Dakar, Sénégal',
    photoUrl: '/papa-alioune-fall.webp',
    linkedinUrl: 'https://www.linkedin.com/in/papa-alioune-fall-03a1b2377/',
    githubUrl: 'https://github.com/papaaliounefall',
    specialty: 'Software Engineer'
  },
  {
    name: 'Anifa Djité',
    role: 'Responsable Communication',
    secondaryRole: 'Developer',
    bio: 'Responsable Communication de NEJ Digitale, également active sur le développement des produits.',
    location: 'Dakar, Sénégal',
    photoUrl: '/anifa-djite.webp',
    linkedinUrl: 'https://www.linkedin.com/in/anifa-djitté-7673a5350',
    githubUrl: 'https://github.com/anifa2003',
    specialty: 'Développeuse Full Stack'
  },
  {
    name: 'Amadou Sow',
    role: 'Responsable RH',
    bio: 'Responsable des Ressources Humaines de NEJ Digitale, il pilote le recrutement, l\'intégration et l\'accompagnement des talents qui rejoignent l\'équipe.',
    specialty: 'Ressources Humaines & Recrutement',
    location: 'Dakar, Sénégal',
    photoUrl: '/amadou-sow.webp',
    // TODO: renseigner les vraies URLs
    linkedinUrl: '',
    githubUrl: ''
  }
];
