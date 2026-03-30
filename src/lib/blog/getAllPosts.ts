import { readMarkdownFile, listBlogDirectories } from "../utils/mdx";
import type { BlogPost } from "./types";

export async function getAllPosts(locale: string): Promise<BlogPost[]> {
  const slugs = await listBlogDirectories();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const { frontmatter } = await readMarkdownFile(slug, locale);
        return frontmatter.language === locale && frontmatter.status === "published"
          ? frontmatter
          : null;
      } catch (error) {
        console.warn(`Missing ${locale} markdown file for slug ${slug}`);
        return null;
      }
    }),
  );

  return posts
    .filter((post: BlogPost | null): post is BlogPost => Boolean(post))
    .sort((a: BlogPost, b: BlogPost) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}
