export type Language = "fr" | "en";

export interface BaseContent {
  slug: string;
  title: string;
  language: Language;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface BlogPost extends BaseContent {
  excerpt: string;
  readingTime: number;
  status: "draft" | "published";
}

export interface Talk {
  slug: string;
  title: string;
  event: string;
  location: string;
  date: string;
  language: Language;
  tags: string[];
  slidesUrl?: string;
  videoUrl?: string;
}

export interface StartupProduct {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  websiteUrl?: string;
  docsUrl?: string;
  demoUrl?: string;
  featured?: boolean;
}

export interface OpenSourceProject {
  slug: string;
  name: string;
  tagline: string;
  descriptionShort: string;
  descriptionLong?: string;
  tags: string[];
  repoUrl: string;
  latestVersion?: string;
}
