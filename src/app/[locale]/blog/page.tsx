// src/app/[locale]/blog/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { buildArchive } from "@/lib/blog/buildArchive";
import { ArchiveWidget } from "@/components/blog/ArchiveWidget";
import { PostList } from "@/components/blog/PostList";
import { TagFilterWidget } from "@/components/blog/TagFilterWidget";
import { Language } from "@/lib/types";

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
  const archive = buildArchive(posts, locale as Language);
  const activeTag = sp.tag;

  const filteredPosts = activeTag ? posts.filter((post) => post.tags.includes(activeTag)) : posts;
  const pageSize = 3;
  const currentPage = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const start = (page - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(start, start + pageSize);

  const tagCounts = posts.reduce<Record<string, number>>((acc, post) => {
    post.tags.forEach((tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
    });
    return acc;
  }, {});
  const tags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));

  return (
      <main className="py-16">
        <Container>
          {/* Header */}
          <header className="mb-10 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#0693e3]">
              {locale === "fr" ? "Blog" : "Blog"}
            </p>
            <h1 className="font-heading text-4xl font-bold sm:text-5xl">
              {t("title")}
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              {t("description")}
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,2.1fr)_minmax(260px,1fr)]">
            <section>
              <PostList posts={paginatedPosts} locale={locale} emptyLabel={t("empty")} />

              {filteredPosts.length > 0 && (
                <div className="mt-8 flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <PaginationLink
                    href={page > 1 ? `/${locale}/blog?page=${page - 1}${activeTag ? `&tag=${activeTag}` : ""}` : undefined}
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
            </section>

            <aside className="lg:pl-4 space-y-6">
              <ArchiveWidget archive={archive} locale={locale} />
              <TagFilterWidget
                locale={locale}
                tags={tags}
                activeTag={activeTag}
                title={t("tags")}
                clearLabel={t("clearFilters")}
              />
            </aside>
          </div>
        </Container>
      </main>
  );
}

function PaginationLink({ href, label, disabled }: { href?: string; label: string; disabled: boolean }) {
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
      className="inline-flex items-center gap-2 rounded-full border border-[#0693e3]/30 bg-[#0693e3]/10 px-3 py-1.5 font-semibold text-[#0693e3] transition hover:border-[#0693e3] hover:bg-[#0693e3]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0693e3]"
    >
      {label}
    </Link>
  );
}
