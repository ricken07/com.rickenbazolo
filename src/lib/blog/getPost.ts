import { readMarkdownFile } from "../utils/mdx";
import type { BlogPostWithContent } from "./types";

export async function getPost(slug: string, locale: string): Promise<BlogPostWithContent> {
  const { frontmatter, content } = await readMarkdownFile(slug, locale);
  return { ...frontmatter, content };
}
