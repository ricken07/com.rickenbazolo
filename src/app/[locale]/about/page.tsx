import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Prose } from "@/components/ui/Prose";

const heroSocials = [
  { name: "GitHub", href: "https://github.com/rickenbazolo", icon: GitHubIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/rickenbazolo", icon: LinkedinIcon },
  { name: "X", href: "https://x.com/rickenbazolo", icon: XIcon },
  { name: "Bluesky", href: "https://bsky.app/profile/rickenbazolo.dev", icon: BlueskyIcon },
  { name: "YouTube", href: "https://www.youtube.com/@rickenbazolo", icon: YoutubeIcon },
];

const heroHighlights = [
  { name: "Gad Digital", role: "Founder & CTO", year: "2021", logo: "https://logo.clearbit.com/gad.digital" },
  { name: "LangChain4j", role: "OSS contributor", year: "2023", logo: "https://avatars.githubusercontent.com/u/121501861?s=200&v=4" },
  { name: "Java / Spring", role: "Engineer & trainer", year: "2014", logo: null },
];

const aboutProjects = [
  {
    name: "Gad Digital",
    description: {
      fr: "Studio produit qui conçoit des workflows IA-first, des plateformes et des outils éducatifs.",
      en: "Product studio building AI-first workflows, platforms, and learning tools.",
    },
    url: "https://gad.digital",
    type: { fr: "Startup", en: "Startup" },
  },
  {
    name: "Platform Starter",
    description: {
      fr: "Kit de démarrage avec auth, audit, jobs et observabilité pour livrer vite.",
      en: "Starter kit with auth, audit, jobs, and observability to ship faster.",
    },
    url: "https://gad.digital/platform-starter",
    type: { fr: "Plateforme Web", en: "Web platform" },
  },
  {
    name: "LangChain4j",
    description: {
      fr: "Contributions OSS sur le tooling, les tests et l’industrialisation des assistants.",
      en: "OSS contributions on tooling, testing, and productionizing assistants.",
    },
    url: "https://github.com/langchain4j/langchain4j",
    type: { fr: "Projet OSS", en: "OSS project" },
  },
];

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <main className="py-16">
      <Container className="space-y-8">
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.95fr)] md:items-start">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-muted">
              {locale === "fr"
                ? "Ingénieur logiciel & IA • Fondateur de Gad Digital"
                : "Software & AI Engineer • Founder of Gad Digital"}
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              {locale === "fr" ? "Ricken Bazolo" : "Ricken Bazolo"}
            </h1>

            <p className="max-w-xl text-sm text-muted">
              {locale === "fr"
                ? "Je m'appelle Ricken BAZOLO, technologue Java sénior, développeur full stack, blogueur, formateur, et conférencier avec plus de 10 ans d'expérience dans la conception et le développement de solutions informatiques. Passionné par l'open source, le partage de connaissances, et l'apprentissage continu, je suis aussi mentor et tech leader engagé à faire évoluer la communauté technologique par la transmission de savoir et le soutien aux autres."
                : "I’m Ricken BAZOLO, a senior Java technologist, full‑stack developer, blogger, trainer, and speaker with 10+ years building software solutions. Passionate about open source, knowledge sharing, and lifelong learning, I also mentor and lead teams to grow the tech community through teaching and supporting others."}
            </p>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-card/60 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {locale === "fr" ? "Mes compétences" : "Skills"}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">{locale === "fr" ? "Back-end" : "Back-end"}</p>
                  <p>Java, Spring, Spring AI, LangChain4j</p>
                  <p>REST/GraphQL, messaging, jobs</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">{locale === "fr" ? "Front-end" : "Front-end"}</p>
                  <p>React/Next.js, TypeScript, Tailwind</p>
                  <p>Design systems, documentation</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">{locale === "fr" ? "Plateforme" : "Platform"}</p>
                  <p>CI/CD, observabilité, sécurité</p>
                  <p>Testing, feature flags, rollback</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">{locale === "fr" ? "Transmission" : "Teaching"}</p>
                  <p>{locale === "fr" ? "Formations, mentoring, conférences" : "Training, mentoring, speaking"}</p>
                  <p>OSS, blog, pédagogie</p>
                </div>
              </div>
            </div>

            {/*<div className="flex flex-wrap gap-3">
              <a
                href={`/${locale}/gad-digital`}
                className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:border-accent hover:text-accent"
              >
                {locale === "fr" ? "Découvrir le projet Gad Digital" : "Discover Gad Digital"}
              </a>
            </div>*/}

            <div className="flex items-center gap-2 text-muted-foreground">
              {heroSocials.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/70 transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <EmailIcon className="h-4 w-4" />
              <a
                href="mailto:hello@rickenbazolo.dev"
                className="underline-offset-4 hover:text-accent hover:underline"
              >
                hello@rickenbazolo.dev
              </a>
            </div>

          </div>

          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card text-sm shadow-lg shadow-accent/10">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative h-full w-full min-h-[240px]">
                <img
                  src="https://rickenbazolo.com/images/me/avatar.jpeg"
                  alt="Portrait professionnel de Ricken Bazolo - Ingénieur logiciel et IA, Fondateur de Gad Digital"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm shadow-inner">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted">{locale === "fr" ? "Parcours" : "Highlights"}</p>
              <div className="space-y-3">
                {heroHighlights.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-card/80">
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {locale === "fr" ? "Mes projets" : "My projects"}
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {aboutProjects.map((project) => (
              <article
                key={project.name}
                className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">{project.name}</h3>
                  <span className="rounded-full border border-border/70 bg-background/70 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {locale === "fr" ? project.type.fr : project.type.en}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {locale === "fr" ? project.description.fr : project.description.en}
                </p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-accent"
                >
                  {locale === "fr" ? "Voir le projet" : "View project"}
                  <span aria-hidden>→</span>
                </a>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.11 3.29 9.45 7.86 10.98.58.12.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.35-1.29-1.71-1.29-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.79 2.74 1.27 3.41.97.1-.76.41-1.27.75-1.56-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.51.11-3.15 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.64.23 2.85.11 3.15.75.82 1.19 1.85 1.19 3.1 0 4.42-2.68 5.39-5.24 5.67.42.36.8 1.08.8 2.18 0 1.57-.01 2.83-.01 3.22 0 .31.21.68.8.56A10.53 10.53 0 0 0 23.5 12C23.5 5.65 18.36.5 12 .5Z"
      />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.37c0-1.28-.02-2.92-1.78-2.92-1.78 0-2.05 1.39-2.05 2.83v5.46H9.5V9h3.42v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.65 0 4.33 2.4 4.33 5.52v6.22ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM21.88 0H2.12C.95 0 0 .95 0 2.12v19.76C0 23.05.95 24 2.12 24h19.76c1.17 0 2.12-.95 2.12-2.12V2.12C24 .95 23.05 0 21.88 0Z"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="m3 3 7.78 9.28L3.22 21h3.3l6.07-6.9L17.8 21h3l-7.13-8.46L21 3h-3.3l-5.64 6.41L8.2 3H3Z"
      />
    </svg>
  );
}

function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M12 10.9c-2.4-2.35-5.44-4.3-7.28-4.9-.73-.24-1.37.44-1.28 1.2.38 3.19 1.96 5.13 3.45 6.15-1.8.73-3.25 2.13-2.47 3.96.6 1.4 2.4 1.61 3.82.44 1.15-.95 2.28-2.87 3.76-4.73 1.48 1.86 2.61 3.78 3.76 4.73 1.42 1.17 3.22.96 3.82-.44.78-1.83-.67-3.23-2.47-3.96 1.49-1.02 3.07-2.96 3.45-6.15.09-.76-.55-1.44-1.28-1.2-1.84.6-4.88 2.55-7.28 4.9Z"
      />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M22.54 6.42c-.26-.98-1.02-1.75-2-2.02C18.92 4 12 4 12 4s-6.92 0-8.54.4c-.98.27-1.74 1.04-2 2.02C1 8.04 1 12 1 12s0 3.96.46 5.58c.26.98 1.02 1.75 2 2.02C5.08 20 12 20 12 20s6.92 0 8.54-.4c.98-.27 1.74-1.04 2-2.02.46-1.62.46-5.58.46-5.58s0-3.96-.46-5.58ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z"
      />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v.22l8 5.33 8-5.33V6H4Zm16 2.78-8 5.34-8-5.34V18h16V8.78Z"
      />
    </svg>
  );
}
