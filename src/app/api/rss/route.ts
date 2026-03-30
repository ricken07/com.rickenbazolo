import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { locales } from "@/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rickenbazolo.dev";

export async function GET() {
  const posts = (await Promise.all(locales.map((locale) => getAllPosts(locale)))).flat();
  const items = posts
    .map(
      (post) => `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${SITE_URL}/${post.language}/blog/${post.slug}</link>
          <guid isPermaLink="true">${SITE_URL}/${post.language}/blog/${post.slug}</guid>
          <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
          <description><![CDATA[${post.excerpt}]]></description>
        </item>
      `,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Ricken Bazolo</title>
      <link>${SITE_URL}</link>
      <description>Blog posts and updates from Ricken Bazolo</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
