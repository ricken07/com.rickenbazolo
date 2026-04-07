import path from "node:path";
import { promises as fs } from "node:fs";
import type { Talk } from "@/lib/types";

export type { Talk };

const TALKS_PATH = path.join(process.cwd(), "src", "content", "speaking", "talks.json");

export async function getTalks(locale: string) {
  const raw = await fs.readFile(TALKS_PATH, "utf-8");
  const talks: Talk[] = JSON.parse(raw);
  return talks.filter((talk) => talk.language === locale);
}
