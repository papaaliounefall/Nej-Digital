export interface Product {
  id: string;
  number: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  impact: string;
  metrics: {
    label: string;
    value: string;
  }[];
  status: 'Production' | 'Déploiement' | 'Beta Active';
  targetAudience: string;
  imageUrl: string;
  liveUrl?: string;
}

export interface PhilosophyPillar {
  number: string;
  title: string;
}

export interface DnaValue {
  name: string;
  headline: string;
  description: string;
  indicator: string;
}

export interface TeamMember {
  name: string;
  role: string;
  /** Secondary, technical title shown under the main role (e.g. "Lead Developer"). */
  secondaryRole?: string;
  bio: string;
  location: string;
  photoUrl: string;
  linkedinUrl?: string;
  githubUrl?: string;
  specialty?: string;
}

export interface ServiceDomain {
  title: string;
  description: string;
}

export interface NewsPost {
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
}
