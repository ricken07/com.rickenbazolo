import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { OpenSourceProjectCard } from "@/components/projects/OpenSourceProjectCard";
import { getOpenSourceProjects } from "@/lib/opensource/getOpenSourceProjects";

export default async function OpenSourcePage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "opensource" });
  const projects = await getOpenSourceProjects(locale);

  return (
    <section className="py-16">
      <Container className="space-y-8">
        <header>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Open Source</p>
          <h1 className="text-4xl font-bold">{t("title")}</h1>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <OpenSourceProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
