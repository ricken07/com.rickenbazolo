import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Prose } from "@/components/ui/Prose";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { getPost } from "@/lib/blog/getPost";
import { renderMarkdown, listBlogDirectories } from "@/lib/utils/mdx";
import { formatDate } from "@/lib/utils/date";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { locales } from "@/i18n/config";

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
    const url = `https://rickenbazolo.dev/${locale}/blog/${slug}`;
    const ogImage = `https://rickenbazolo.dev/og-image-blog.png`;

    return {
      title: post.title,
      description: post.excerpt || `${post.title} - Article par Ricken Bazolo`,
      keywords: post.tags,
      authors: [{ name: "Ricken Bazolo", url: "https://rickenbazolo.dev" }],
      creator: "Ricken Bazolo",
      publisher: "Ricken Bazolo",
      alternates: {
        canonical: url,
        languages: {
          "fr-FR": `/fr/blog/${slug}`,
          "en-US": `/en/blog/${slug}`,
        },
      },
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        url: url,
        siteName: "Ricken Bazolo",
        locale: locale === "fr" ? "fr_FR" : "en_US",
        type: "article",
        publishedTime: post.publishedAt,
        authors: ["Ricken Bazolo"],
        tags: post.tags,
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

  const post = await getPost(slug, locale).catch(() => null);
  if (!post) {
    notFound();
  }

  const mdx = await renderMarkdown(post.content);

  const related = (await getAllPosts(locale))
      .filter(
          (candidate) =>
              candidate.slug !== slug &&
              candidate.tags.some((tag: string) => post.tags.includes(tag)),
      )
      .slice(0, 2);

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
        "https://x.com/rickenbazolo"
      ]
    },
    publisher: {
      "@type": "Person",
      name: "Ricken Bazolo",
      logo: {
        "@type": "ImageObject",
        url: "https://rickenbazolo.com/images/me/avatar.jpeg"
      }
    },
    keywords: post.tags.join(", "),
    articleSection: post.tags[0] || "Technology",
    inLanguage: locale,
    timeRequired: `PT${post.readingTime}M`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://rickenbazolo.dev/${locale}/blog/${slug}`
    }
  };

  const breadcrumbItems = [
    { label: locale === "fr" ? "Accueil" : "Home", href: `/${locale}` },
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
        <Container className="space-y-12">
          <Breadcrumb items={breadcrumbItems} />
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0693e3]/20 bg-[#0693e3]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0693e3]">
              {locale === "fr" ? "Article" : "Article"}
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
              <time>{formatDate(post.publishedAt, locale)}</time>
              <span>·</span>
              <span>{post.readingTime} min</span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>·</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#0693e3]/10 px-3 py-1 text-xs font-semibold text-[#0693e3]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>

          <Prose className="mx-auto shadow-xl shadow-black/15 dark:shadow-black/40">
            {mdx}
          </Prose>

          {!!related.length && (
              <aside className="border-t border-border pt-12">
                <div className="mb-6 text-center">
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#0693e3]">
                    {locale === "fr" ? "Articles connexes" : "Related articles"}
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
                          {locale === "fr" ? "Lire l'article" : "Read article"}
                          <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </article>
                  ))}
                </div>
              </aside>
          )}
        </Container>
      </section>
      </>
  );
}
