import { formatDate } from "@/lib/utils/date";
import type { BlogPost } from "@/lib/blog/types";

interface PostMetaProps {
  post: BlogPost;
  locale: string;
}

export function PostMeta({ post, locale }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-widest text-muted-foreground">
      <span>{formatDate(post.publishedAt, locale)}</span>
      <span>·</span>
      <span>{post.readingTime} min</span>
    </div>
  );
}
