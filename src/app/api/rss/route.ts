import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { locales } from "@/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rickenbazolo.dev";

function buildRssFeed(items: string[], locale?: string) {
  const title = locale
    ? `Ricken Bazolo — ${locale === "fr" ? "Articles en français" : "English articles"}`
    : "Ricken Bazolo";
  const description = locale
    ? locale === "fr"
      ? "Articles techniques sur Java, l'IA et l'architecture logicielle"
      : "Technical articles on Java, AI and software architecture"
    : "Blog posts and updates from Ricken Bazolo";

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${SITE_URL}${locale ? `/${locale}` : ""}</link>
    <description>${description}</description>
    ${locale ? `<language>${locale === "fr" ? "fr-FR" : "en-US"}</language>` : ""}
    <atom:link href="${SITE_URL}/api/rss${locale ? `?locale=${locale}` : ""}" rel="self" type="application/rss+xml" />
    ${items.join("\n    ")}
  </channel>
</rss>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const targetLocale = locales.includes(localeParam as (typeof locales)[number])
    ? (localeParam as (typeof locales)[number])
    : undefined;

  const fetchLocales = targetLocale ? [targetLocale] : locales;
  const posts = (await Promise.all(fetchLocales.map((l) => getAllPosts(l)))).flat();

  const items = posts.map(
    (post) => `<item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/${post.language}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${post.language}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <language>${post.language === "fr" ? "fr-FR" : "en-US"}</language>
    </item>`,
  );

  return new NextResponse(buildRssFeed(items, targetLocale), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
