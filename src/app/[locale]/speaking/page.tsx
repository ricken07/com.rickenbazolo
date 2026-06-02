import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { getTalks } from "@/lib/speaking/getTalks";
import { formatDate } from "@/lib/utils/date";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "speaking.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SpeakingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "speaking" });
  const talks = await getTalks(locale);

  const upcomingTalks = talks
    .filter((talk) => talk.status === "upcoming" && talk.date)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const pastTalks = talks.filter((talk) => talk.status === "past");

  return (
    <section className="py-16">
      <Container className="space-y-12">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">{t("eyebrow")}</p>
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl font-bold sm:text-5xl">{t("title")}</h1>
            <p className="text-lg leading-relaxed text-muted-foreground">{t("intro")}</p>
          </div>
        </header>

        <section className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{t("upcoming.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("upcoming.description")}</p>
          </div>

          {upcomingTalks.length ? (
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/40">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-card/70 text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 font-medium">{t("upcoming.table.title")}</th>
                    <th className="px-5 py-4 font-medium">{t("upcoming.table.host")}</th>
                    <th className="px-5 py-4 font-medium">{t("upcoming.table.date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTalks.map((talk) => (
                    <tr key={talk.slug} className="border-t border-border/60">
                      <td className="px-5 py-4 font-medium text-foreground">{talk.localizedTitle}</td>
                      <td className="px-5 py-4 text-muted-foreground">{talk.host}</td>
                      <td className="px-5 py-4 text-muted-foreground">{formatDate(talk.date!, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/70 bg-card/30 px-6 py-8 text-sm text-muted-foreground">
              {t("upcoming.empty")}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{t("past.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("past.description")}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {pastTalks.map((talk) => (
              <article key={talk.slug} className="rounded-2xl border border-border/70 bg-card/50 p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("past.label")}</p>
                    <h3 className="text-xl font-semibold text-foreground">{talk.localizedTitle}</h3>
                    <p className="text-sm font-medium text-accent">{talk.host}</p>
                  </div>

                  {talk.localizedSummary ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">{talk.localizedSummary}</p>
                  ) : null}

                  {talk.tags?.length ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {talk.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-border/70 bg-card/30 p-8 md:p-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("topics.title")}</h2>
            <p className="max-w-3xl text-muted-foreground">{t("topics.intro")}</p>
          </div>

          <div className="flex flex-wrap gap-3">
             {/* Note: In a real app with next-intl, we'd use t.raw('topics.items') but here we'll assume standard translation handling or use a workaround if needed. 
                 Since I can't easily use t.raw here without knowing the exact setup, I'll list them or use a safer way. 
                 Actually, I'll just map them if they are available as an array in the JSON.
             */}
             {(t.raw("topics.items") as string[]).map((topic) => (
                <div key={topic} className="rounded-full border border-border/60 bg-background/50 px-5 py-2.5 text-sm font-medium transition hover:border-accent/40">
                  {topic}
                </div>
             ))}
          </div>
        </section>
      </Container>
    </section>
  );
}
