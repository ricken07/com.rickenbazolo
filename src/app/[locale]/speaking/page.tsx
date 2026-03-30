import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { TalkCard } from "@/components/speaking/TalkCard";
import { getTalks } from "@/lib/speaking/getTalks";

export default async function SpeakingPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "speaking" });
  const talks = await getTalks(locale);

  return (
    <section className="py-16">
      <Container className="space-y-8">
        <header>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Speaking</p>
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("intro")}</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {talks.map((talk) => (
            <TalkCard key={talk.slug} talk={talk} locale={locale} />
          ))}
        </div>
      </Container>
    </section>
  );
}
