export interface Profile {
  name: string;
  title: string;
  tagline: string;
  introduction: string;
  photo: string;
  roles: string[];
  email: string;
  phone?: string;
  location?: string;
  calendlyUrl?: string;
}

export interface About {
  story: string;
  journey: string;
  mission: string;
  objectives: string[];
}

export interface Skill {
  name: string;
  category: string;
  level?: number;
  icon?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  username?: string;
}

export interface Website {
  title: string;
  description: string;
  url: string;
  logo?: string;
  category: string;
}

export interface Project {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  caseStudyUrl?: string;
}

export interface Book {
  title: string;
  description: string;
  cover?: string;
  version?: string;
  category: string;
  group?: "tech" | "islamic";
  pages?: number;
  tags: string[];
  readUrl?: string;
  pdfUrl?: string;
  epubUrl?: string;
}

export type ArticleStatus = "published" | "in-progress" | "coming-soon";

export interface Article {
  title: string;
  description: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime?: number;
  status?: ArticleStatus;
  externalUrl?: string;
}

export interface Publication {
  title: string;
  authors: string[];
  journal?: string;
  conference?: string;
  year: number;
  doi?: string;
  url?: string;
  type: "research-paper" | "journal" | "conference" | "thesis" | "report" | "case-study" | "survey-paper";
  description: string;
  status?: ArticleStatus;
}

export interface CareerPlatform {
  name: string;
  url: string;
  description: string;
  region: string;
  logo?: string;
}

export interface FreelancingPlatform {
  name: string;
  url: string;
  description: string;
  profileUrl?: string;
  logo?: string;
}

export interface Service {
  title: string;
  description: string;
  skills: string[];
  pricingModel: string;
  portfolio?: string;
}

export interface DigitalResource {
  title: string;
  url: string;
  description: string;
  platform: string;
  icon?: string;
}

export interface Roadmap {
  title: string;
  role: string;
  milestones: RoadmapMilestone[];
}

export interface RoadmapMilestone {
  title: string;
  description: string;
  resources: string[];
  books: string[];
  projects: string[];
}

export interface NavItem {
  href: string;
  label: string;
  icon?: string;
  section: string;
}

export type CertificateStatus = "active" | "expired" | "verified";

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuerLogo?: string;
  description: string;
  categories: string[];
  skills: string[];
  issueDate?: string;
  expiryDate?: string | null;
  credentialId?: string;
  credentialUrl?: string;
  certificateImage?: string;
  certificatePdf?: string;
  verificationUrl?: string;
  featured: boolean;
  status: CertificateStatus;
  displayOrder: number;
  tags: string[];
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  author: string;
  links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}
