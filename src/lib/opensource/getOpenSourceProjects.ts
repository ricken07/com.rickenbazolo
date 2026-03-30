import path from "node:path";
import { promises as fs } from "node:fs";

export interface OpenSourceProject {
  slug: string;
  name: string;
  description: Record<string, string>;
  tags: string[];
  repoUrl: string;
  latestVersion?: string;
}

const PROJECTS_PATH = path.join(process.cwd(), "src", "content", "opensource", "projects.json");

export interface LocalizedOpenSourceProject extends OpenSourceProject {
  localizedDescription: string;
}

export async function getOpenSourceProjects(locale: string): Promise<LocalizedOpenSourceProject[]> {
  const raw = await fs.readFile(PROJECTS_PATH, "utf-8");
  const projects: OpenSourceProject[] = JSON.parse(raw);
  return projects.map((project) => ({
    ...project,
    localizedDescription: project.description?.[locale] ?? project.description.en,
  }));
}
