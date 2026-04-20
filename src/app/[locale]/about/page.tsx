import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";

// ─── Types ───────────────────────────────────────────────────────────────────

type Highlight = {
  name: string;
  role: { fr: string; en: string };
  period: string;
  logo: string | null;
  initials: string;
};

type SkillCategory = {
  labelFr: string;
  labelEn: string;
  pills: string[];
};

type Project = {
  name: string;
  description: { fr: string; en: string };
  url: string;
  type: { fr: string; en: string };
  linkIcon: "github" | "external";
};

type ProjectZone = {
  title: { fr: string; en: string };
  projects: Project[];
};

// ─── Static data ─────────────────────────────────────────────────────────────

const heroSocials = [
  { name: "GitHub", href: "https://github.com/ricken07", icon: GitHubIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/rickenbazolo/", icon: LinkedinIcon },
  { name: "X", href: "https://x.com/RickenBrice", icon: XIcon },
  { name: "Bluesky", href: "https://bsky.app/profile/ricken07.bsky.social", icon: BlueskyIcon },
  { name: "YouTube", href: "https://www.youtube.com/@autourducode", icon: YoutubeIcon },
];

const highlights: Highlight[] = [
  {
    name: "FDJ United",
    role: { fr: "Software Engineer", en: "Software Engineer" },
    period: "2025-26",
    logo: null,
    initials: "FDJ",
  },
  {
    name: "Société Générale",
    role: { fr: "Lead technique & ingénieur en IA générative", en: "Technical Lead & Generative AI Engineer" },
    period: "2024-25",
    logo: null,
    initials: "SG",
  },
  {
    name: "SCIAM (PJ)",
    role: { fr: "Lead technique & ingénieur en IA générative", en: "Technical Lead & Generative AI Engineer" },
    period: "2023-24",
    logo: null,
    initials: "SC",
  },
  {
    name: "BNP Paribas",
    role: { fr: "Lead technique", en: "Technical Lead" },
    period: "2023-24",
    logo: null,
    initials: "BNP",
  },
  {
    name: "INETUM",
    role: { fr: "Lead technique", en: "Technical Lead" },
    period: "2021-23",
    logo: null,
    initials: "IN",
  },
  {
    name: "Gad Digital",
    role: { fr: "Fondateur & architecte logiciel", en: "Founder & Software Architect" },
    period: "2020",
    logo: null,
    initials: "GD",
  },
  {
    name: "FONGWAMA",
    role: { fr: "Développeur & chef de projet technique", en: "Developer & Technical Project Lead" },
    period: "2016-20",
    logo: null,
    initials: "FG",
  },
  {
    name: "YEKOLAB",
    role: { fr: "Lead développeur & formateur", en: "Lead Developer & Trainer" },
    period: "2016-18",
    logo: null,
    initials: "YK",
  },
  {
    name: "NET-TECHNOLOGY",
    role: { fr: "Développeur web & mobile senior", en: "Senior Web & Mobile Developer" },
    period: "2015-17",
    logo: null,
    initials: "NT",
  },
];

const skillCategories: SkillCategory[] = [
  {
    labelFr: "Architecture",
    labelEn: "Architecture",
    pills: ["Clean Architecture", "Hexagonal", "Microservices", "Architectures modulaires"],
  },
  {
    labelFr: "Cloud & DevOps",
    labelEn: "Cloud & DevOps",
    pills: ["Azure", "AWS", "Docker", "CI/CD", "Git", "JIRA"],
  },
  {
    labelFr: "IA générative",
    labelEn: "Generative AI",
    pills: ["LLM", "Spring AI", "LangChain", "RAG", "Vector DB", "Azure AI Foundry"],
  },
  {
    labelFr: "Systèmes agentiques",
    labelEn: "Agentic Systems",
    pills: ["Multi-agents", "Orchestration", "Tool calling", "Intégration métier"],
  },
  {
    labelFr: "Back-end",
    labelEn: "Back-end",
    pills: ["Java", "Jakarta EE", "Spring Boot", "Quarkus", "Python", "PostgreSQL", "MongoDB"],
  },
  {
    labelFr: "Front-end",
    labelEn: "Front-end",
    pills: ["React / Next.js", "Vue / Nuxt", "Angular", "JSF", "Flutter / Dart"],
  },
  {
    labelFr: "Soft skills",
    labelEn: "Soft skills",
    pills: ["Leadership technique", "Coordination d'équipe", "Collaboration transverse", "Résolution de problèmes"],
  },
];

const aboutProjectZones: ProjectZone[] = [
  {
    title: {
      fr: "IA appliquée (Projets Gad Digital)",
      en: "Applied AI (Gad Digital Projects)",
    },
    projects: [
      {
        name: "EMI AI",
        description: {
          fr: "Assistante virtuelle éducative propulsée par l'IA pour offrir un accompagnement scolaire personnalisé, aider aux devoirs, préparer les examens et proposer une orientation adaptée à chaque apprenant.",
          en: "AI-powered virtual educational assistant delivering personalized learning support, homework help, exam preparation, and guidance tailored to each learner.",
        },
        url: "https://emi-ai.com",
        type: { fr: "IA appliquée", en: "Applied AI" },
        linkIcon: "external",
      },
      {
        name: "Digi Resto",
        description: {
          fr: "Plateforme pour restaurateurs qui digitalise les menus, simplifie les paiements via QR code et exploite l'IA Écho pour analyser les avis clients et optimiser en continu l'offre et les opérations.",
          en: "Restaurant platform that digitizes menus, streamlines QR-code payments, and uses Echo AI to analyze customer feedback and continuously optimize offerings and operations.",
        },
        url: "https://digi-resto.com",
        type: { fr: "IA appliquée", en: "Applied AI" },
        linkIcon: "external",
      },
    ],
  },
  {
    title: {
      fr: "Projets open source",
      en: "Open source projects",
    },
    projects: [
      {
        name: "Toon4j",
        description: {
          fr: "Implémentation Java de TOON, un format de sérialisation compact conçu pour réduire de 30 à 60 % l'usage de tokens par rapport à JSON lors des interactions avec les LLM.",
          en: "Java implementation of TOON, a compact serialization format designed to reduce token usage by 30 to 60% compared to JSON when interacting with LLMs.",
        },
        url: "https://github.com/ricken07/Toon4j",
        type: { fr: "Librairie Java", en: "Java Library" },
        linkIcon: "github",
      },
      {
        name: "PayMux",
        description: {
          fr: "SDK Java unifié et modulaire qui simplifie l'intégration des API Mobile Money avec une interface cohérente pour plusieurs opérateurs.",
          en: "Unified and modular Java SDK that simplifies Mobile Money API integration through a consistent interface across multiple operators.",
        },
        url: "https://github.com/ricken07/paymux-java",
        type: { fr: "Librairie Java", en: "Java Library" },
        linkIcon: "github",
      },
    ],
  },
  {
    title: {
      fr: "Tech entreprenariat",
      en: "Tech entrepreneurship",
    },
    projects: [
      {
        name: "Gad Digital",
        description: {
          fr: "Entreprise spécialisée dans la conception de solutions numériques, de produits et de services qui simplifient la complexité, améliorent l'efficacité et favorisent la croissance.",
          en: "Company focused on building digital solutions, products, and services that simplify complexity, improve efficiency, and drive growth.",
        },
        url: "http://gaddigital.io",
        type: { fr: "Startup", en: "Startup" },
        linkIcon: "external",
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <main className="py-16">
      <Container className="space-y-8">

        {/* ── Hero grid ─────────────────────────────────────────────────── */}
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.95fr)] md:items-start">

          {/* Left column */}
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-muted">
              {locale === "fr"
                ? "Ingénieur logiciel & IA générative • Tech Entrepreneur"
                : "Software & Generative AI Engineer • Tech Entrepreneur"}
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Ricken Bazolo
            </h1>

            <div className="max-w-xl space-y-3 text-sm text-muted">
              {locale === "fr" ? (
                <>
                  <p>Ricken BAZOLO (@rickenbazolo) est technologue Java senior, blogueur, formateur et speaker, avec plus de dix ans d'expérience dans la conception et le développement de solutions logicielles.</p>
                  <p>Tech entrepreneur, il s'intéresse particulièrement aux architectures modernes et à l'intégration des LLM dans les applications métier. Il contribue également de temps en temps à des projets open source dans l'écosystème Java.</p>
                  <p>Passionné par le partage de connaissances, il intervient aussi comme mentor et leader technique.</p>
                </>
              ) : (
                <>
                  <p>Ricken BAZOLO (@rickenbazolo) is a senior Java technologist, blogger, trainer and speaker, with over ten years of experience designing and building software solutions.</p>
                  <p>A tech entrepreneur, he is particularly interested in modern architectures and the integration of LLMs into business applications. He also occasionally contributes to open source projects in the Java ecosystem.</p>
                  <p>Passionate about knowledge sharing, he also acts as a mentor and technical leader.</p>
                </>
              )}
            </div>

            {/* ── Skills card (pill badges) ─────────────────────────────── */}
            <div className="space-y-3 rounded-2xl border border-border/70 bg-card/60 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {locale === "fr" ? "Mes compétences" : "Skills"}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skillCategories.map((cat) => (
                  <div key={cat.labelEn} className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      {locale === "fr" ? cat.labelFr : cat.labelEn}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.pills.map((pill) => (
                        <span
                          key={pill}
                          className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Social links ─────────────────────────────────────────── */}
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

            {/* ── Email ────────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <EmailIcon className="h-4 w-4" />
              <a
                href="mailto:ricken.bazolo@gaddigital.io"
                className="underline-offset-4 hover:text-accent hover:underline"
              >
                ricken.bazolo@gaddigital.io
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <EmailIcon className="h-4 w-4" />
              <a
                  href="mailto:contact@rickenbazolo.com"
                  className="underline-offset-4 hover:text-accent hover:underline"
              >
                contact@rickenbazolo.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <EmailIcon className="h-4 w-4" />
              <a
                  href="mailto:ricken.bazolo@gmail.com"
                  className="underline-offset-4 hover:text-accent hover:underline"
              >
                ricken.bazolo@gmail.com
              </a>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Avatar */}
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card text-sm shadow-lg shadow-accent/10">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative h-full w-full min-h-[240px]">
                <img
                  src="/avatar.jpeg"
                  alt="Portrait professionnel de Ricken Bazolo - Ingénieur logiciel et IA, Fondateur de Gad Digital"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* ── Timeline / Parcours ───────────────────────────────────── */}
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm shadow-inner">
              <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted">
                {locale === "fr" ? "Parcours" : "Highlights"}
              </p>
              {/* Vertical timeline */}
              <ol className="relative border-l border-border/40">
                {highlights.map((item, idx) => (
                  <li
                    key={item.name + item.period + item.role.en}
                    className={`relative pl-5 ${idx < highlights.length - 1 ? "pb-10" : "pb-0"} pt-1`}
                  >
                    {/* Dot on the timeline line */}
                    <span className="absolute -left-[5px] top-[14px] h-2.5 w-2.5 rounded-full border border-border/60 bg-card" />

                    <div className="flex items-start gap-3">
                      {/* Logo / SVG icon avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-card/80 text-muted-foreground">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                        {!item.logo ? (
                          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
                            {item.initials}
                          </span>
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {locale === "fr" ? item.role.fr : item.role.en}
                        </p>
                      </div>

                      <span className="mt-0.5 shrink-0 whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {item.period}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── Projects section ──────────────────────────────────────────────── */}
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {locale === "fr" ? "Mes projets" : "My projects"}
          </p>
          <div className="space-y-6">
            {aboutProjectZones.map((zone) => (
              <div key={zone.title.en} className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  {locale === "fr" ? zone.title.fr : zone.title.en}
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  {zone.projects.map((project) => (
                    <article
                      key={zone.title.en + project.name}
                      className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-foreground">{project.name}</h3>
                        <span className="shrink-0 rounded-full border border-border/70 bg-background/70 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
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
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-accent"
                      >
                        {project.linkIcon === "github" ? (
                          <GitHubIcon className="h-3.5 w-3.5" />
                        ) : (
                          <ExternalLinkIcon className="h-3.5 w-3.5" />
                        )}
                        {locale === "fr" ? "Voir le projet" : "View project"}
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </Container>
    </main>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

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

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"
      />
    </svg>
  );
}
