import path from "node:path";
import { promises as fs } from "node:fs";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { rehypeMermaid } from "react-markdown-mermaid";
import readingTime from "reading-time";
import { z } from "zod";
import type { BlogPost } from "../blog/types";
import { MermaidDiagram } from "@/components/blog/MermaidDiagram";

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

// Zod schema — validates frontmatter at parse time, gives clear errors
const blogFrontmatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().default(""),
  language: z.enum(["fr", "en"]),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt must be YYYY-MM-DD"),
  readingTime: z.number().optional(),
  status: z.enum(["draft", "published"]),
  canonical: z.string().url().optional(),
  coverImage: z.string().optional(),
});

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

  const parsed = blogFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid frontmatter in ${slug}/${locale}:\n${issues}`);
  }

  const fm = parsed.data;
  // Auto-calculate readingTime; fall back to frontmatter value if provided
  const stats = readingTime(content);
  const resolvedReadingTime = fm.readingTime ?? Math.max(1, Math.ceil(stats.minutes));

  const frontmatter: BlogPost = {
    ...fm,
    readingTime: resolvedReadingTime,
  };

  return { frontmatter, content };
}

export async function renderMarkdown(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          rehypeResponsiveTables,
          // Must run before rehypePrettyCode so mermaid fences are swapped for
          // a <MermaidBlock> element instead of being syntax-highlighted as text.
          rehypeMermaid,
          [
            rehypePrettyCode,
            {
              theme: {
                dark: "github-dark",
                light: "github-light",
              },
              keepBackground: false,
              defaultLang: { block: "text", inline: "text" },
            },
          ],
        ],
      },
    },
    components: {
      MermaidBlock: MermaidDiagram,
    },
  });
  return content;
}

function rehypeResponsiveTables() {
  return (tree: HastNode) => {
    wrapTables(tree);
  };
}

function wrapTables(node: HastNode) {
  if (!node.children?.length) {
    return;
  }

  node.children = node.children.map((child) => {
    wrapTables(child);

    if (child.type === "element" && child.tagName === "table") {
      return {
        type: "element",
        tagName: "div",
        properties: {
          className: ["table-wrap"],
        },
        children: [child],
      } satisfies HastNode;
    }

    return child;
  });
}

export async function listBlogDirectories() {
  const directories = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  return directories.filter((dirent) => dirent.isDirectory()).map((dir) => dir.name);
}
