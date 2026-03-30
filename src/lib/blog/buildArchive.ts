import type { Archive, BlogPost, Language } from "./types";

export function buildArchive(posts: BlogPost[], locale: Language): Archive {
  const archive: Archive = {};

  for (const post of posts) {
    const [year, month] = post.publishedAt.split("-"); // "YYYY-MM-DD"
    if (!year || !month) continue;

    const date = new Date(`${post.publishedAt}T00:00:00Z`);
    const monthLabel = date.toLocaleDateString(
        locale === "fr" ? "fr-FR" : "en-US",
        { month: "long" }
    );

    archive[year] ??= {};
    archive[year][monthLabel] ??= [];
    archive[year][monthLabel].push(post);
  }

  return archive;
}
