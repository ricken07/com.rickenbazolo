import type { LocalizedOpenSourceProject } from "@/lib/opensource/getOpenSourceProjects";
import { Badge } from "../ui/Badge";

interface Props {
  project: LocalizedOpenSourceProject;
}

export function OpenSourceProjectCard({ project }: Props) {
  return (
    <article className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="space-y-3">
        <h3 className="text-2xl font-semibold">{project.name}</h3>
        <p className="text-muted-foreground">{project.localizedDescription ?? project.description.en}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
          GitHub
        </a>
      </div>
    </article>
  );
}
