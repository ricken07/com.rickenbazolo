import { NextResponse } from "next/server";
import { locales } from "@/i18n/config";
import { getAllPosts } from "@/lib/blog/getAllPosts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rickenbazolo.dev";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function urlEntry(
  loc: string,
  options?: { lastmod?: string; priority?: number; changefreq?: ChangeFreq },
) {
  return `
    <url>
      <loc>${loc}</loc>
      ${options?.lastmod ? `<lastmod>${options.lastmod}</lastmod>` : ""}
      ${options?.priority !== undefined ? `<priority>${options.priority.toFixed(1)}</priority>` : ""}
      ${options?.changefreq ? `<changefreq>${options.changefreq}</changefreq>` : ""}
    </url>`;
}

const today = new Date().toISOString().split("T")[0];

const STATIC_PAGES: Array<{ path: string; priority: number; changefreq: ChangeFreq }> = [
  { path: "",             priority: 1.0, changefreq: "weekly"  },
  { path: "/blog",        priority: 0.9, changefreq: "daily"   },
  { path: "/about",       priority: 0.8, changefreq: "monthly" },
  { path: "/opensource",  priority: 0.7, changefreq: "monthly" },
  { path: "/newsletter",  priority: 0.5, changefreq: "yearly"  },
];

export async function GET() {
  const entries: string[] = [];

  for (const locale of locales) {
    for (const { path, priority, changefreq } of STATIC_PAGES) {
      entries.push(
        urlEntry(`${SITE_URL}/${locale}${path}`, {
          lastmod: today,
          priority,
          changefreq,
        }),
      );
    }

    const posts = await getAllPosts(locale);
    for (const post of posts) {
      entries.push(
        urlEntry(`${SITE_URL}/${locale}/blog/${post.slug}`, {
          lastmod: post.publishedAt,
          priority: 0.8,
          changefreq: "yearly",
        }),
      );
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("")}
</urlset>`;

  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
