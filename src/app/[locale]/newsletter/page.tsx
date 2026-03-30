import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsletter.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function NewsletterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: "newsletter.hero" });
  const tFeatures = await getTranslations({ locale, namespace: "newsletter.features" });
  const tMeta = await getTranslations({ locale, namespace: "newsletter" });

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-20 top-0 h-72 w-72 animate-float-slow rounded-full bg-accent/20 blur-3xl"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute -left-20 top-40 h-96 w-96 animate-float-slow rounded-full bg-accent/10 blur-3xl"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <Container className="relative max-w-2xl text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">{tHero("tag")}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{tHero("title")}</h1>
          <p className="mt-6 text-lg text-muted-foreground">{tHero("description")}</p>

          {/* Form */}
          <div className="mt-10">
            <NewsletterForm locale={locale} />
          </div>

          {/* Privacy & Frequency */}
          <div className="mt-6 flex flex-col items-center gap-4 text-sm text-muted-foreground sm:flex-row sm:justify-center sm:gap-6">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>{tMeta("privacy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{tMeta("frequency")}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="mt-24">
        <Container className="max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">{tFeatures("title")}</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="group rounded-2xl border border-border/60 bg-card/40 p-6 transition hover:border-accent/50 hover:bg-card/60"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-accent/20">
                  {index === 0 && (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{tFeatures(`items.${index}.title`)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {tFeatures(`items.${index}.description`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
