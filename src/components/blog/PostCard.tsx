import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { formatDate } from "@/lib/utils/date";
import { getCoverGradient } from "@/lib/utils/coverGradient";

interface PostCardProps {
  post: BlogPost;
  locale: string;
  /** When true, renders a hero full-width two-column layout */
  featured?: boolean;
}

export function PostCard({ post, locale, featured = false }: PostCardProps) {
  const gradient = getCoverGradient(post.tags ?? []);

  /* ── Featured / hero variant ─────────────────────────────────────── */
  if (featured) {
    return (
      <article className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition hover:border-accent/70 hover:shadow-md">
        <Link
          href={`/${locale}/blog/${post.slug}`}
          className="grid gap-0 md:grid-cols-2"
        >
          {/* Image / gradient column */}
          <div className="relative min-h-[200px] overflow-hidden md:min-h-[300px]">
            {post.coverImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            ) : (
              <div
                className={`flex h-full min-h-[200px] items-end bg-gradient-to-br ${gradient} p-6 md:min-h-[300px]`}
              >
                <p className="line-clamp-3 text-sm font-medium text-foreground/30">
                  {post.title}
                </p>
              </div>
            )}
          </div>

          {/* Content column */}
          <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              {locale === "fr" ? "Dernier" : "Latest"}
            </span>

            <h2 className="font-heading text-2xl font-bold leading-snug transition group-hover:text-accent">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/70 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt, locale)}
              </time>
              {post.readingTime > 0 && (
                <span>{post.readingTime} min</span>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              {locale === "fr" ? "Lire l'article" : "Read article"} →
            </span>
          </div>
        </Link>
      </article>
    );
  }

  /* ── Default card variant ────────────────────────────────────────── */
  return (
    <article className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition hover:border-accent/70 hover:shadow-md">
      <Link href={`/${locale}/blog/${post.slug}`} className="block">
        {/* Image / gradient header – 16:9 */}
        <div className="aspect-[16/9] overflow-hidden">
          {post.coverImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div
              className={`flex h-full items-end bg-gradient-to-br ${gradient} p-4`}
            >
              <p className="line-clamp-2 text-sm font-medium text-foreground/40">
                {post.title}
              </p>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt, locale)}
            </time>
            {post.readingTime > 0 && <span>{post.readingTime} min</span>}
          </div>

          <h2 className="text-base font-semibold leading-snug transition group-hover:text-accent">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          )}

          {post.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/70 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
