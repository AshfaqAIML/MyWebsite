import type {
  Profile,
  About,
  Skill,
  SocialLink,
  Website,
  Project,
  Book,
  Article,
  Publication,
  CareerPlatform,
  FreelancingPlatform,
  Service,
  DigitalResource,
  NavItem,
  SiteConfig,
  Certificate,
  ResumeDocument,
  ResumeDocumentType,
} from "./types";

import siteConfig from "../../data/site-config.json";
import profileData from "../../data/profile.json";
import aboutData from "../../data/about.json";
import skillsData from "../../data/skills.json";
import socialsData from "../../data/socials.json";
import websitesData from "../../data/websites.json";
import projectsData from "../../data/projects.json";
import booksData from "../../data/books.json";
import studyBooksData from "../../data/study-books.json";
import articlesData from "../../data/articles.json";
import publicationsData from "../../data/publications.json";
import careerPlatformsData from "../../data/career-platforms.json";
import freelancingPlatformsData from "../../data/freelancing-platforms.json";
import servicesData from "../../data/services.json";
import digitalResourcesData from "../../data/digital-resources.json";
import navigationData from "../../data/navigation.json";
import certificatesData from "../../data/certificates.json";
import resumeDocumentsData from "../../data/resume.json";

export function getSiteConfig(): SiteConfig {
  return siteConfig as SiteConfig;
}

export function getProfile(): Profile {
  return profileData as Profile;
}

export function getRoles(): string[] {
  return (profileData as Profile).roles || [];
}

export function getAbout(): About {
  return aboutData as About;
}

export function getSkills(): Skill[] {
  return skillsData as Skill[];
}

export function getSkillCategories(): string[] {
  const skills = getSkills();
  return [...new Set(skills.map((s) => s.category))];
}

export function getSkillsByCategory(category: string): Skill[] {
  return getSkills().filter((s) => s.category === category);
}

export function getSocials(): SocialLink[] {
  return socialsData as SocialLink[];
}

export function getWebsites(): Website[] {
  return websitesData as Website[];
}

export function getWebsiteCategories(): string[] {
  const websites = getWebsites();
  return [...new Set(websites.map((w) => w.category))];
}

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export function getBooks(): Book[] {
  return booksData as Book[];
}

export function getStudyBooks(): Book[] {
  return studyBooksData as Book[];
}

export function getBookCategories(): string[] {
  const books = getBooks();
  return [...new Set(books.map((b) => b.category))];
}

export function getArticles(): Article[] {
  return articlesData as Article[];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function getPublications(): Publication[] {
  return publicationsData as Publication[];
}

export function getCareerPlatforms(): CareerPlatform[] {
  return careerPlatformsData as CareerPlatform[];
}

export function getCareerRegions(): string[] {
  const platforms = getCareerPlatforms();
  return [...new Set(platforms.map((p) => p.region))];
}

export function getFreelancingPlatforms(): FreelancingPlatform[] {
  return freelancingPlatformsData as FreelancingPlatform[];
}

export function getServices(): Service[] {
  return servicesData as Service[];
}

export function getDigitalResources(): DigitalResource[] {
  return digitalResourcesData as DigitalResource[];
}

export function getNavigation(): NavItem[] {
  return navigationData as NavItem[];
}

export function getCertificates(): Certificate[] {
  return (certificatesData as Certificate[]).sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );
}

export function getFeaturedCertificates(): Certificate[] {
  return getCertificates().filter((c) => c.featured);
}

export function getCertificateById(id: string): Certificate | undefined {
  return getCertificates().find((c) => c.id === id);
}

export function getCertificateCategories(): string[] {
  const set = new Set<string>();
  for (const c of getCertificates()) {
    for (const cat of c.categories) set.add(cat);
  }
  return Array.from(set).sort();
}

export function getResumeDocuments(): ResumeDocument[] {
  return (resumeDocumentsData as ResumeDocument[]).sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );
}

export function getResumeDocumentById(id: string): ResumeDocument | undefined {
  return getResumeDocuments().find((d) => d.id === id);
}

export function getFeaturedResumeDocument(): ResumeDocument | undefined {
  return getResumeDocuments().find((d) => d.featured);
}

export function getResumeDocumentTypes(): ResumeDocumentType[] {
  const set = new Set<ResumeDocumentType>();
  for (const d of getResumeDocuments()) set.add(d.type);
  return Array.from(set);
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}
