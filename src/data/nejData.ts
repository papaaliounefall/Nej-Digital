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

// photoUrl values are Unsplash stock placeholders — replace with real team
// photos before pushing traffic to the site (see /equipe/ page).
export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Papa Alioune Fall',
    role: 'Fondateur & Lead Product Engineer',
    bio: 'Passionné par l\'ingénierie logicielle et le développement de produits technologiques à fort impact sociétal. Conduit la vision produit et l\'architecture générale de NEJ Digitale.',
    location: 'Dakar, Sénégal',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    linkedinUrl: 'https://linkedin.com/in/papaaliounefall',
    githubUrl: 'https://github.com/papaaliounefall',
    specialty: 'Architecture logicielle & Stratégie produit'
  },
  {
    name: 'Amina Diop',
    role: 'Co-fondatrice & Directrice des Opérations',
    bio: 'Spécialiste de la transformation organisationnelle et du déploiement opérationnel des solutions tech sur le terrain sénégalais et ouest-africain.',
    location: 'Dakar, Sénégal',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    linkedinUrl: 'https://linkedin.com',
    specialty: 'Opérations, FinTech & Croissance terrain'
  },
  {
    name: 'Moussa Ndiaye',
    role: 'Lead Backend & Data Architect',
    bio: 'Expert en bases de données distribuées, systèmes financiers temps réel et APIs de micro-paiement. Garant de la robustesse technique et de la sécurité des plateformes.',
    location: 'Dakar, Sénégal',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    specialty: 'Systèmes distribués & Sécurité des paiements'
  },
  {
    name: 'Fatou Bintou Sène',
    role: 'Product Designer & UX Researcher',
    bio: 'Défend une approche du design centrée sur les usages réels en Afrique : interfaces visuelles claires, charges cognitives réduites et adaptation aux contextes multilingues.',
    location: 'Dakar / Saint-Louis',
    photoUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=600&q=80',
    linkedinUrl: 'https://linkedin.com',
    specialty: 'Design System & Recherche utilisateur terrain'
  }
];
