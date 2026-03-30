import type { Talk } from "@/lib/speaking/getTalks";
import { formatDate } from "@/lib/utils/date";
import { Badge } from "../ui/Badge";

export function TalkCard({ talk, locale }: { talk: Talk; locale: string }) {
  return (
    <article className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase text-muted-foreground">
          {formatDate(talk.date, locale)} · {talk.event}
        </p>
        <h3 className="text-xl font-semibold">{talk.title}</h3>
        <p className="text-sm text-muted-foreground">{talk.location}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {talk.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="flex gap-3 text-sm text-primary">
          {talk.slidesUrl && (
            <a href={talk.slidesUrl} target="_blank" rel="noreferrer" className="hover:underline">
              Slides
            </a>
          )}
          {talk.videoUrl && (
            <a href={talk.videoUrl} target="_blank" rel="noreferrer" className="hover:underline">
              Replay
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
