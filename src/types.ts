export interface Product {
  id: string;
  number: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  metrics: {
    label: string;
    value: string;
  }[];
  techStack: string[];
  keyFeatures: string[];
  status: 'Production' | 'Déploiement' | 'Beta Active';
  targetAudience: string;
  imageUrl: string;
}

export interface PhilosophyPillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  action: string;
}

export interface DnaValue {
  name: string;
  headline: string;
  description: string;
  indicator: string;
}

export interface TechCapability {
  title: string;
  category: string;
  description: string;
  tools: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  location: string;
  photoUrl: string;
  linkedinUrl: string;
  githubUrl?: string;
  specialty: string;
}

export interface CaseStudy {
  id: string;
  productName: string;
  sector: string;
  tag: string;
  clientType: string;
  timeline: string;
  summary: string;
  results: string[];
  imageUrl: string;
}
