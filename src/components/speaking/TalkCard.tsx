import type { LocalizedTalk } from "@/lib/speaking/getTalks";
import { Badge } from "../ui/Badge";

export function TalkCard({ talk }: { talk: LocalizedTalk }) {
  return (
    <article className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{talk.host}</p>
        <h3 className="text-xl font-semibold">{talk.localizedTitle}</h3>
        {talk.localizedSummary ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{talk.localizedSummary}</p>
        ) : null}
        {talk.tags?.length ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {talk.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ) : null}
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
