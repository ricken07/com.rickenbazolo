import type { HTMLAttributes } from "react";
import clsx from "clsx";

export function Prose({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
        <div
          className={clsx(
            [
              "prose prose-invert max-w-none",
              "overflow-x-auto rounded-2xl border border-border/70 bg-card/80 p-4 sm:p-6",
              "prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground",
              "prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg",
              "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
              "prose-strong:text-foreground prose-em:text-foreground",
              "prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-card/60 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-xl prose-blockquote:text-foreground",
              "prose-img:rounded-xl prose-hr:border-border",
              "prose-li:marker:text-accent prose-ul:space-y-2 prose-ol:space-y-2 prose-p:text-muted-foreground prose-p:leading-relaxed",
            ],
            className
          )}
          {...props}
      />
  );
}
