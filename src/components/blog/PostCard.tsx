import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { formatDate } from "@/lib/utils/date";

interface PostCardProps {
  post: BlogPost;
  locale: string;
}

export function PostCard({ post, locale }: PostCardProps) {
  return (
      <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-5 transition hover:border-accent/70 hover:bg-card/70">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(post.publishedAt, locale)}</span>
            {post.readingTime && (
                <span>{post.readingTime} min</span>
            )}
          </div>

          <h2 className="text-lg font-semibold leading-snug">
            <Link
                href={`/${locale}/blog/${post.slug}`}
                className="inline-flex items-center gap-1 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus-visible:rounded-lg"
            >
              {post.title}
              <span className="text-xs opacity-0 transition group-hover:opacity-100">
              ↗
            </span>
            </Link>
          </h2>

          {post.excerpt && (
              <p className="text-sm text-muted-foreground">
                {post.excerpt}
              </p>
          )}

          {post.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
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
      </article>
  );
}
