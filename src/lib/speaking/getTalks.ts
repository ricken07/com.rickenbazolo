import path from "node:path";
import { promises as fs } from "node:fs";

export interface Talk {
  slug: string;
  title: string;
  event: string;
  location: string;
  date: string;
  language: string;
  tags: string[];
  slidesUrl?: string;
  videoUrl?: string;
}

const TALKS_PATH = path.join(process.cwd(), "src", "content", "speaking", "talks.json");

export async function getTalks(locale: string) {
  const raw = await fs.readFile(TALKS_PATH, "utf-8");
  const talks: Talk[] = JSON.parse(raw);
  return talks.filter((talk) => talk.language === locale);
}
