"use client";

import { useState } from "react";
import type { BlogPost } from "@/lib/blog/types";
import { SearchBar } from "./SearchBar";
import { PostList } from "./PostList";

interface BlogSearchWrapperProps {
  allPosts: BlogPost[];
  locale: string;
  placeholder: string;
  emptyLabel: string;
}

export function BlogSearchWrapper({
  allPosts,
  locale,
  placeholder,
  emptyLabel,
}: BlogSearchWrapperProps) {
  const [searchResults, setSearchResults] = useState<BlogPost[] | null>(null);

  const isSearchActive = searchResults !== null;
  const displayedPosts = isSearchActive ? searchResults : null;

  return (
    <div className="space-y-4">
      <SearchBar
        posts={allPosts}
        locale={locale}
        placeholder={placeholder}
        onResults={setSearchResults}
      />
      {isSearchActive && (
        <div className="text-xs text-muted-foreground">
          {displayedPosts!.length === 0
            ? emptyLabel
            : `${displayedPosts!.length} résultat${displayedPosts!.length > 1 ? "s" : ""}`}
        </div>
      )}
      {isSearchActive && (
        <PostList posts={displayedPosts!} locale={locale} emptyLabel={emptyLabel} />
      )}
    </div>
  );
}
