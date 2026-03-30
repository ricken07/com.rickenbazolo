import path from "node:path";
import { promises as fs } from "node:fs";
import { Container } from "@/components/layout/Container";
import { getTranslations } from "next-intl/server";

async function getTools() {
  const filePath = path.join(process.cwd(), "src", "content", "tools", "tools.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Array<{ slug: string; name: string; description: string; url: string }>;
}

export default async function ToolsPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools" });
  const tools = await getTools();

  return (
    <section className="py-16">
      <Container className="space-y-8">
        <header>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Tools</p>
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("intro")}</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <article key={tool.slug} className="rounded-2xl border border-border/60 bg-card p-6">
              <h3 className="text-2xl font-semibold">{tool.name}</h3>
              <p className="text-muted-foreground">{tool.description}</p>
              <a href={tool.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                {tool.url}
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
