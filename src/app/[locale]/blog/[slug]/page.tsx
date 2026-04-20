import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Prose } from "@/components/ui/Prose";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { getPost } from "@/lib/blog/getPost";
import { renderMarkdown, listBlogDirectories } from "@/lib/utils/mdx";
import { extractTocHeadings } from "@/lib/utils/toc";
import { formatDate } from "@/lib/utils/date";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { locales } from "@/i18n/config";
import { getCoverGradient } from "@/lib/utils/coverGradient";

export async function generateStaticParams() {
  const slugs = await listBlogDirectories();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const post = await getPost(slug, locale);
    const postTags = Array.isArray(post.tags) ? post.tags : [];
    const canonicalUrl = post.canonical ?? `https://rickenbazolo.dev/${locale}/blog/${slug}`;
    const ogImage = `https://rickenbazolo.dev/og-image-blog.png`;

    return {
      title: post.title,
      description: post.excerpt || `${post.title} - Article par Ricken Bazolo`,
      keywords: postTags,
      authors: [{ name: "Ricken Bazolo", url: "https://rickenbazolo.com" }],
      creator: "Ricken Bazolo",
      publisher: "Ricken Bazolo",
      alternates: {
        canonical: canonicalUrl,
        languages: {
          "fr-FR": `/fr/blog/${slug}`,
          "en-US": `/en/blog/${slug}`,
        },
      },
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        url: canonicalUrl,
        siteName: "Ricken Bazolo",
        locale: locale === "fr" ? "fr_FR" : "en_US",
        type: "article",
        publishedTime: post.publishedAt,
        authors: ["Ricken Bazolo"],
        tags: postTags,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.title,
        creator: "@rickenbazolo",
        images: [ogImage],
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  const post = await getPost(slug, locale).catch(() => null);
  if (!post) notFound();

  const [mdx, allPosts] = await Promise.all([
    renderMarkdown(post.content),
    getAllPosts(locale),
  ]);

  const currentTags = Array.isArray(post.tags) ? post.tags : [];
  const tocHeadings = extractTocHeadings(post.content);

  // Related articles (same tags, exclude current)
  const related = allPosts
    .filter(
      (candidate) =>
        candidate.slug !== slug &&
        Array.isArray(candidate.tags) &&
        candidate.tags.some((tag: string) => currentTags.includes(tag)),
    )
    .slice(0, 2);

  // Prev / Next navigation
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Schema.org JSON-LD pour SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: `https://rickenbazolo.dev/og-image-blog.png`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Ricken Bazolo",
      url: "https://rickenbazolo.dev",
      jobTitle: "Senior Java & AI Technologist",
      sameAs: [
        "https://github.com/rickenbazolo",
        "https://linkedin.com/in/rickenbazolo",
        "https://x.com/rickenbazolo",
      ],
    },
    publisher: {
      "@type": "Person",
      name: "Ricken Bazolo",
      logo: {
        "@type": "ImageObject",
        url: "https://rickenbazolo.dev/avatar.jpeg",
      },
    },
    keywords: currentTags.join(", "),
    articleSection: currentTags[0] || "Technology",
    inLanguage: locale,
    timeRequired: `PT${post.readingTime}M`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://rickenbazolo.dev/${locale}/blog/${slug}`,
    },
  };

  const breadcrumbItems = [
    { label: t("home"), href: `/${locale}` },
    { label: "Blog", href: `/${locale}/blog` },
    { label: post.title },
  ];

  return (
    <>
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="py-16">
        <Container className="max-w-7xl space-y-12">
          <Breadcrumb items={breadcrumbItems} />
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0693e3]/20 bg-[#0693e3]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0693e3]">
              {t("articleLabel")}
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
              <span aria-hidden>·</span>
              <span>{t("readingTime", { minutes: post.readingTime })}</span>
              {currentTags.length > 0 && (
                <>
                  <span aria-hidden>·</span>
                  <div className="flex flex-wrap gap-2">
                    {currentTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#0693e3]/10 px-3 py-1 text-xs font-semibold text-[#0693e3]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Cover banner ─────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl">
            {post.coverImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-[320px] w-full object-cover md:h-[420px]"
              />
            ) : (
              <div
                className={`flex h-[180px] items-end bg-gradient-to-br ${getCoverGradient(currentTags)} p-6 md:h-[240px]`}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {currentTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Two-column layout: article + TOC sidebar */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2.5fr)_minmax(220px,1fr)]">
            <div className="space-y-12">
              <Prose className="shadow-xl shadow-black/15 dark:shadow-black/40">
                {mdx}
              </Prose>

              {/* Author + Share */}
              <div className="space-y-4 border-t border-border pt-8">
                <ShareButtons
                  url={`https://rickenbazolo.com/${locale}/blog/${slug}`}
                  title={post.title}
                  locale={locale}
                />
                {/*<AuthorCard locale={locale} />*/}
              </div>

              {/* Prev / Next navigation */}
              {(prevPost || nextPost) && (
                <nav
                  aria-label={t("prevNextLabel")}
                  className="grid grid-cols-2 gap-4"
                >
                  {prevPost ? (
                    <Link
                      href={`/${locale}/blog/${prevPost.slug}`}
                      className="group flex flex-col gap-1 rounded-2xl border border-border/70 bg-card/80 p-5 transition hover:border-[#0693e3]/50"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        ← {t("prev")}
                      </span>
                      <span className="font-heading text-sm font-bold leading-snug text-foreground group-hover:text-[#0693e3] line-clamp-2">
                        {prevPost.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextPost ? (
                    <Link
                      href={`/${locale}/blog/${nextPost.slug}`}
                      className="group flex flex-col items-end gap-1 rounded-2xl border border-border/70 bg-card/80 p-5 text-right transition hover:border-[#0693e3]/50"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("next")} →
                      </span>
                      <span className="font-heading text-sm font-bold leading-snug text-foreground group-hover:text-[#0693e3] line-clamp-2">
                        {nextPost.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                </nav>
              )}

              {/* Related articles */}
              {related.length > 0 && (
                <aside className="border-t border-border pt-12">
                  <div className="mb-6 text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider text-[#0693e3]">
                      {t("related")}
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {related.map((item) => (
                      <article
                        key={item.slug}
                        className="hover-lift group rounded-2xl border border-border bg-card p-6 transition"
                      >
                        <h3 className="font-heading text-xl font-bold leading-tight">
                          <Link
                            href={`/${locale}/blog/${item.slug}`}
                            className="transition group-hover:text-[#0693e3]"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        {item.excerpt && (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {item.excerpt}
                          </p>
                        )}
                        <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0693e3]">
                          {t("readMore")}
                          <svg
                            className="h-4 w-4 transition group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </article>
                    ))}
                  </div>
                </aside>
              )}
            </div>

            {/* Sticky TOC sidebar */}
            {tocHeadings.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents headings={tocHeadings} locale={locale} />
                </div>
              </aside>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
