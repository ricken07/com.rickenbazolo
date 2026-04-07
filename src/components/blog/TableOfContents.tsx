"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/utils/toc";

interface TableOfContentsProps {
  headings: TocHeading[];
  locale: string;
}

export function TableOfContents({ headings, locale }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 },
    );

    for (const { id } of headings) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const label = locale === "fr" ? "Table des matières" : "Table of contents";

  return (
    <nav
      aria-label={label}
      className="rounded-2xl border border-border/70 bg-card/80 p-5 text-sm"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#0693e3]">
        {label}
      </p>
      <ul className="space-y-1.5">
        {headings.map(({ id, text, level }) => (
          <li key={id} className={level === 3 ? "pl-4" : ""}>
            <a
              href={`#${id}`}
              className={[
                "block rounded-lg px-2 py-1 transition-colors hover:text-[#0693e3]",
                activeId === id
                  ? "font-semibold text-[#0693e3] bg-[#0693e3]/8"
                  : "text-muted-foreground",
              ].join(" ")}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
