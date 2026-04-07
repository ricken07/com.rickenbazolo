import GithubSlugger from "github-slugger";

export interface TocHeading {
  id: string;
  text: string;
  level: number; // 2 or 3
}

/**
 * Strips inline markdown syntax so the displayed text and slug match
 * the plain text that rehype-slug sees after the markdown→HTML pipeline.
 */
function stripInlineMarkdown(raw: string): string {
  return raw
    .replace(/!\[.*?\]\(.*?\)/g, "")          // images
    .replace(/\[(.+?)\]\(.*?\)/g, "$1")        // [text](url) → text
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")       // ***bold-italic***
    .replace(/___(.+?)___/g, "$1")             // ___bold-italic___
    .replace(/\*\*(.+?)\*\*/g, "$1")           // **bold**
    .replace(/__(.+?)__/g, "$1")               // __bold__
    .replace(/\*(.+?)\*/g, "$1")               // *italic*
    .replace(/_(.+?)_/g, "$1")                 // _italic_
    .replace(/~~(.+?)~~/g, "$1")               // ~~strikethrough~~
    .replace(/`(.+?)`/g, "$1")                 // `code`
    .trim();
}

/**
 * Extracts h2/h3 headings from raw MD/MDX content.
 * Uses github-slugger (same algorithm as rehype-slug) so the IDs match
 * the anchors injected into the rendered HTML — enabling TOC navigation.
 */
export function extractTocHeadings(content: string): TocHeading[] {
  // Skip headings that appear inside fenced code blocks
  const stripped = content.replace(/```[\s\S]*?```/g, "").replace(/~~~[\s\S]*?~~~/g, "");

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  // One slugger instance per document — tracks duplicates exactly like rehype-slug
  const slugger = new GithubSlugger();

  for (const match of stripped.matchAll(headingRegex)) {
    const level = match[1].length;
    const raw = match[2].trim();
    const text = stripInlineMarkdown(raw);
    const id = slugger.slug(text);
    headings.push({ id, text, level });
  }

  return headings;
}
