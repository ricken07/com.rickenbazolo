import { locales } from "@/i18n/config";

export type Language = (typeof locales)[number];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  language: Language;
  tags: string[];
  publishedAt: string;  // "YYYY-MM-DD"
  readingTime: number;  // auto-calculated, frontmatter value used as fallback
  status: "draft" | "published";
  coverImage?: string;  // optional cover image URL or /public path
  canonical?: string;   // original URL if cross-posted
}

export interface BlogPostWithContent extends BlogPost {
  content: string;
}

export type Archive = {
  [year: string]: {
    [monthLabel: string]: BlogPost[];
  };
};
