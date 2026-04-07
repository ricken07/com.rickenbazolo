import Link from "next/link";

interface TagFilterWidgetProps {
  locale: string;
  tags: Array<{ tag: string; count: number }>;
  activeTag?: string;
  clearLabel: string;
  title: string;
}

export function TagFilterWidget({ locale, tags, activeTag, clearLabel, title }: TagFilterWidgetProps) {
  if (!tags.length) return null;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map(({ tag }) => {
          const isActive = tag === activeTag;
          const href = `/${locale}/blog?tag=${encodeURIComponent(tag)}`;
          return (
            <Link
              key={tag}
              href={href}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive
                  ? "border-accent bg-accent/20 text-foreground"
                  : "border-border/70 text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {tag}
            </Link>
          );
        })}
      </div>
      {activeTag && (
        <div className="mt-3">
          <Link
            href={`/${locale}/blog`}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {clearLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
