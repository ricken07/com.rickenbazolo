// Language is derived from i18n config — single source of truth
export type { Language } from "@/lib/blog/types";

export interface Talk {
  slug: string;
  status: "past" | "upcoming";
  title: Record<string, string>;
  host: string;
  date?: string;
  summary?: Record<string, string>;
  tags?: string[];
  slidesUrl?: string;
  videoUrl?: string;
}

export interface StartupProduct {
  slug: string;
  name: string;
  tagline: string;
  description: Record<string, string>;
  techStack: string[];
  websiteUrl?: string;
  docsUrl?: string;
  demoUrl?: string;
  featured?: boolean;
}

export interface OpenSourceProject {
  slug: string;
  name: string;
  description: Record<string, string>;
  tags: string[];
  repoUrl: string;
  latestVersion?: string;
}
