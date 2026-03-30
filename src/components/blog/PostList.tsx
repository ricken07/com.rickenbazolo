import type { BlogPost } from "@/lib/blog/types";
import { PostCard } from "./PostCard";

interface PostListProps {
  posts: BlogPost[];
  locale: string;
  emptyLabel: string;
}

export function PostList({ posts, locale, emptyLabel }: PostListProps) {
  if (!posts.length) {
    return (
        <p className="text-sm text-muted-foreground">
          {emptyLabel}
        </p>
    );
  }

  return (
      <div className="grid gap-4">
        {posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
  );
}
