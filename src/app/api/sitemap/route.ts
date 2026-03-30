import { NextResponse } from "next/server";
import { locales } from "@/i18n/config";
import { getAllPosts } from "@/lib/blog/getAllPosts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rickenbazolo.dev";
const STATIC_PAGES = ["", "/blog", "/speaking", "/gad-digital", "/opensource", "/tools", "/about", "/newsletter"];

export async function GET() {
  const urls: string[] = [];

  for (const locale of locales) {
    for (const page of STATIC_PAGES) {
      urls.push(`${SITE_URL}/${locale}${page}`);
    }
    const posts = await getAllPosts(locale);
    posts.forEach((post) => {
      urls.push(`${SITE_URL}/${locale}/blog/${post.slug}`);
    });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
      <url>
        <loc>${url}</loc>
      </url>`,
      )
      .join("\n")}
  </urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
