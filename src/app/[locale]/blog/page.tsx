// src/app/[locale]/blog/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { PostCard } from "@/components/blog/PostCard";
import { TagFilterWidget } from "@/components/blog/TagFilterWidget";
import { ArchiveWidget } from "@/components/blog/ArchiveWidget";
import { buildArchive } from "@/lib/blog/buildArchive";
import type { Language } from "@/lib/blog/types";
import { locales } from "@/i18n/config";

// Pre-render all locale variants at build time
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function BlogIndex({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ page?: string; tag?: string }>;
}) {
  const { locale } = await params;
  const sp = (await searchParams) ?? {};
  const t = await getTranslations({ locale, namespace: "blog" });

  const posts = await getAllPosts(locale);
  const activeTag = sp.tag;

  const filteredPosts = activeTag
    ? posts.filter((post) => post.tags.includes(activeTag))
    : posts;

  const pageSize = 7; // 1 featured + up to 6 in the grid
  const currentPage = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const start = (page - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(start, start + pageSize);

  // Tag counts for filter pills (sorted by frequency)
  const tagCounts = posts.reduce<Record<string, number>>((acc, post) => {
    post.tags.forEach((tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
    });
    return acc;
  }, {});
  const tags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
  const archive = buildArchive(posts, locale as Language);

  return (
    <section className="py-16">
      <Container className="max-w-7xl">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Blog
          </p>
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {t("description")}
          </p>
        </header>

        {/* ── Content + Sidebar ────────────────────────────────────── */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* ── Main content ──────────────────────────────────────────── */}
          <div className="min-w-0 flex-1">
            {activeTag && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm">
                <span className="font-semibold text-foreground">
                  {locale === "fr" ? `Filtré par : ${activeTag}` : `Filtered by: ${activeTag}`}
                </span>
                <Link
                  href={`/${locale}/blog`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t("clearFilters")}
                </Link>
              </div>
            )}

            {/* ── Posts ───────────────────────────────────────────────────── */}
            {paginatedPosts.length > 0 ? (
              <div className="space-y-8">
                <PostCard post={paginatedPosts[0]} locale={locale} featured={true} />

                {paginatedPosts.length > 1 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {paginatedPosts.slice(1).map((post) => (
                      <PostCard key={post.slug} post={post} locale={locale} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {t("empty")}
              </p>
            )}

            {/* ── Pagination ──────────────────────────────────────────────── */}
            {filteredPosts.length > pageSize && (
              <div className="mt-10 flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <PaginationLink
                  href={
                    page > 1
                      ? `/${locale}/blog?page=${page - 1}${activeTag ? `&tag=${activeTag}` : ""}`
                      : undefined
                  }
                  label={t("prev")}
                  disabled={page === 1}
                />
                <span className="text-[11px]">
                  {t("pageOf", { current: page, total: totalPages })}
                </span>
                <PaginationLink
                  href={
                    page < totalPages
                      ? `/${locale}/blog?page=${page + 1}${activeTag ? `&tag=${activeTag}` : ""}`
                      : undefined
                  }
                  label={t("next")}
                  disabled={page === totalPages}
                />
              </div>
            )}
          </div>

          {/* ── Sidebar : Tags + Archives ─────────────────────────────── */}
          <aside className="w-full shrink-0 space-y-5 lg:w-72 xl:w-80 lg:sticky lg:top-24">
            <TagFilterWidget
              locale={locale}
              tags={tags}
              activeTag={activeTag}
              clearLabel={t("clearFilters")}
              title={t("tags")}
            />
            <ArchiveWidget archive={archive} locale={locale} />
          </aside>
        </div>
      </Container>
    </section>
  );
}

function PaginationLink({
  href,
  label,
  disabled,
}: {
  href?: string;
  label: string;
  disabled: boolean;
}) {
  if (disabled || !href) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-muted-foreground">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 font-semibold text-accent transition hover:border-accent hover:bg-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {label}
    </Link>
  );
}
