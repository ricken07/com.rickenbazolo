"use client";

import { useState, useMemo, useTransition } from "react";
import Fuse from "fuse.js";
import type { BlogPost } from "@/lib/blog/types";

interface SearchBarProps {
  posts: BlogPost[];
  locale: string;
  placeholder: string;
  onResults: (results: BlogPost[] | null) => void;
}

export function SearchBar({ posts, locale: _locale, placeholder, onResults }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: "title", weight: 0.6 },
          { name: "excerpt", weight: 0.3 },
          { name: "tags", weight: 0.1 },
        ],
        threshold: 0.35,
        includeScore: true,
      }),
    [posts],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    startTransition(() => {
      if (value.trim() === "") {
        onResults(null);
      } else {
        const results = fuse.search(value).map((r) => r.item);
        onResults(results);
      }
    });
  }

  return (
    <div className="relative flex items-center">
      <svg
        className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border/70 bg-card/80 py-2.5 pl-[2.625rem] pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
      {query && (
        <button
          onClick={() => { setQuery(""); onResults(null); }}
          className="absolute right-2.5 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition hover:bg-border/60 hover:text-foreground"
          aria-label="Clear search"
          type="button"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
