import path from "node:path";
import { promises as fs } from "node:fs";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { BlogPost } from "../blog/types";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

async function resolveBlogPath(slug: string, locale: string) {
  const mdPath = path.join(BLOG_DIR, slug, `${locale}.md`);
  const mdxPath = path.join(BLOG_DIR, slug, `${locale}.mdx`);

  try {
    await fs.access(mdPath);
    return mdPath;
  } catch {
    return mdxPath;
  }
}

export async function readMarkdownFile(slug: string, locale: string) {
  const filePath = await resolveBlogPath(slug, locale);
  const file = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(file);
  return { frontmatter: data as BlogPost, content };
}

export async function renderMarkdown(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
  return content;
}

export async function listBlogDirectories() {
  const directories = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  return directories.filter((dirent) => dirent.isDirectory()).map((dir) => dir.name);
}
