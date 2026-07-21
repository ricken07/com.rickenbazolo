import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";

// ─── Types ───────────────────────────────────────────────────────────────────

type Highlight = {
  name: string;
  role: { fr: string; en: string };
  period: string;
  logo: string | null;
  initials: string;
  sector?: { fr: string; en: string };
};

type SkillCategory = {
  labelFr: string;
  labelEn: string;
  pills: string[];
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
    period: "2025 - 2026",
    logo: null,
    initials: "FDJ",
    sector: { fr: "Jeux & plateformes transactionnelles", en: "Gaming & Transactional Platforms" }
  },
  {
    name: "Société Générale",
    role: { fr: "Lead technique & ingénieur IA générative", en: "Tech Lead & Generative AI Engineer" },
    period: "2024 - 2025",
    logo: null,
    initials: "SG",
    sector: { fr: "Services financiers", en: "Financial Services" }
  },
  {
    name: "SCIAM (projet en interne)",
    role: { fr: "Architecte logiciel & ingénieur IA générative", en: "Software Architect & Generative AI Engineer" },
    period: "2023 - 2024",
    logo: null,
    initials: "SC",
    sector: { fr: "Conseil IT", en: "IT Consulting" }
  },
  {
    name: "BNP Paribas",
    role: { fr: "Lead technique", en: "Tech Lead" },
    period: "2023 - 2024",
    logo: null,
    initials: "BNP",
    sector: { fr: "Services financiers", en: "Financial Services" }
  },
  {
    name: "INETUM",
    role: { fr: "Services publics & institutions", en: "Public Services & Institutions" },
    period: "2021 - 2023",
    logo: null,
    initials: "IN",
    sector: { fr: "Justice / Systèmes d’entreprise", en: "Justice / Enterprise Systems" }
  },
  {
    name: "WAPICASH",
    role: { fr: "Référent technique", en: "Technical Referent" },
    period: "2020 - 2021",
    logo: null,
    initials: "WC",
    sector: { fr: "Fintech", en: "Fintech" }
  },
  {
    name: "WAPICASH",
    role: { fr: "CTO", en: "CTO" },
    period: "2018 - 2020",
    logo: null,
    initials: "WC",
    sector: { fr: "Fintech", en: "Fintech" }
  },
  {
    name: "Gad Digital",
    role: { fr: "Fondateur & architecte logiciel", en: "Founder & Software Architect" },
    period: "2022 - Présent",
    logo: null,
    initials: "GD",
    sector: { fr: "Entreprise technologique", en: "Tech Company" }
  },
  {
    name: "FONGWAMA",
    role: { fr: "Développeur & chef de projet technique", en: "Developer & Technical Project Lead" },
    period: "2016 - 2020",
    logo: null,
    initials: "FG",
    sector: { fr: "Santé, impact social, open source", en: "Health, Social Impact, Open Source" }
  },
  {
    name: "YEKOLAB",
    role: { fr: "Lead développeur & responsable de la formation technique", en: "Lead Developer & Head of Technical Training" },
    period: "2016 - 2018",
    logo: null,
    initials: "YK",
    sector: { fr: "Éducation, robotique, domotique", en: "Education, Robotics, Home Automation" }
  },
  {
    name: "NET-TECHNOLOGY",
    role: { fr: "Développeur web & mobile senior", en: "Senior Web & Mobile Developer" },
    period: "2015 - 2017",
    logo: null,
    initials: "NT",
    sector: { fr: "Services publics, industrie, SI", en: "Public Services, Industry, IS" }
  },
];

const skillCategories: SkillCategory[] = [
  {
    labelFr: "Architecture",
    labelEn: "Architecture",
    pills: ["Architecture logicielle", "Architecture hexagonale", "Microservices", "Modulith", "APIs"],
  },
  {
    labelFr: "IA appliquée",
    labelEn: "Applied AI",
    pills: ["LLM", "Spring AI", "RAG", "Function Calling", "Agents IA", "MCP"],
  },
  {
    labelFr: "Back-end",
    labelEn: "Back-end",
    pills: ["Java", "Jakarta EE", "Spring Boot", "Quarkus", "PostgreSQL", "Vector DB"],
  },
  {
    labelFr: "Transmission",
    labelEn: "Sharing",
    pills: ["Formation", "Mentoring", "Conférences", "Articles techniques", "Auteur"],
  },
];

const sectors = [
  { fr: "Services financiers : banque, assurance, paiement et fintech.", en: "Financial services: banking, insurance, payment and fintech." },
  { fr: "Jeux & plateformes transactionnelles : systèmes à fort volume, parcours utilisateurs.", en: "Gaming & transactional platforms: high-volume systems, user journeys." },
  { fr: "Éducation & transmission : formation, mentoring, robotique et domotique.", en: "Education & sharing: training, mentoring, robotics and home automation." },
  { fr: "Services publics & institutions : justice, administration et systèmes institutionnels.", en: "Public services & institutions: justice, administration and institutional systems." },
  { fr: "Industrie, IoT & systèmes embarqués : objets connectés, robotique et domotique.", en: "Industry, IoT & embedded systems: connected objects, robotics and home automation." },
  { fr: "Santé & impact social : sensibilisation, santé numérique et initiatives open source.", en: "Health & social impact: awareness, digital health and open source initiatives." },
];

const missionTypes = [
  { fr: "Architecture logicielle", en: "Software Architecture" },
  { fr: "Développement Java et fullstack", en: "Java and Fullstack Development" },
  { fr: "APIs et intégration de systèmes", en: "APIs and Systems Integration" },
  { fr: "Modernisation applicative", en: "Application Modernization" },
  { fr: "Qualité logicielle et maintenabilité", en: "Software Quality and Maintainability" },
  { fr: "Leadership technique", en: "Technical Leadership" },
  { fr: "IA générative appliquée", en: "Applied Generative AI" },
  { fr: "RAG et systèmes conversationnels", en: "RAG and Conversational Systems" },
  { fr: "Formation et accompagnement d’équipes", en: "Training and Team Support" },
  { fr: "Documentation technique", en: "Technical Documentation" },
];

const contributions = [
  {
    title: "Spring AI",
    description: {
      fr: "Contribution au projet Spring AI, dans une logique de participation à l’écosystème Java et Spring autour de l’intégration de l’intelligence artificielle dans les applications d’entreprise.",
      en: "Contribution to the Spring AI project, as part of participating in the Java and Spring ecosystem around integrating AI into enterprise applications."
    }
  },
  {
    title: "Toon4j",
    description: {
      fr: "Création de Toon4j, une bibliothèque Java dédiée à la représentation compacte de données structurées pour les usages liés aux LLM.",
      en: "Creation of Toon4j, a Java library dedicated to the compact representation of structured data for LLM-related uses."
    }
  },
  {
    title: "EduPalu & DensiPara",
    description: {
      fr: "Participation à des initiatives open source orientées sensibilisation, éducation et impact social autour du paludisme et de la santé.",
      en: "Participation in open source initiatives focused on awareness, education and social impact around malaria and health."
    }
  }
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="py-16 md:py-24">
      <Container className="space-y-24">

        {/* 1. INTRODUCTION */}
        <section className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
               <h1 className="font-heading text-4xl font-bold leading-tight sm:text-6xl">
                 {locale === "fr" ? "À propos de Ricken Bazolo" : "About Ricken Bazolo"}
               </h1>
               <p className="text-xl font-medium text-accent">
                 {locale === "fr" ? "Consultant IT, architecte logiciel et technologue Java senior" : "IT Consultant, Software Architect and Senior Java Technologist"}
               </p>
            </div>

            <div className="prose prose-lg dark:prose-invert text-muted-foreground">
              {locale === "fr" ? (
                <>
                    <p>Je suis Ricken Bazolo, consultant IT, architecte logiciel et technologue Java senior. Depuis plus de 10 ans, j’interviens dans la conception, la modernisation et l’industrialisation de systèmes logiciels. Mon parcours couvre l’architecture, le développement logiciel, la performance, le cloud et le leadership technique, dans des secteurs tels que la banque, l’assurance, la fintech, l’éducation, les services publics et l’industrie.</p>
                    <p>Mon approche associe ingénierie logicielle, pragmatisme et compréhension des enjeux métier. J’accompagne les organisations dans leurs choix techniques, l’évolution de leurs plateformes, l’amélioration de la qualité logicielle et la structuration de leurs processus de delivery. J’interviens également sur l’intégration de l’IA générative dans les activités métier et les pratiques de conception, de développement, de modernisation et de livraison des logiciels.</p>
                    <p>Auteur de Ultimate Java Design Patterns, formateur, speaker et JUG Leader, je partage régulièrement mon expérience à travers des articles, des conférences, des formations, du mentoring et des contributions ponctuelles à l’open source. Je suis également le fondateur de Gad Digital, une entreprise technologique à travers laquelle je développe des produits, des solutions numériques et des services en ingénierie logicielle et en intelligence artificielle appliquée.</p>
                </>
              ) : (
                <>
                    <p>I am Ricken Bazolo, an IT consultant, software architect and senior Java technologist. For more than 10 years, I have worked on the design, modernization and industrialization of software systems. My background covers software architecture, software development, performance, cloud platforms and technical leadership across industries including banking, insurance, fintech, education, public services and manufacturing.</p>
                    <p>My approach combines software engineering, pragmatism and a strong understanding of business challenges. I support organizations in making technical decisions, evolving their platforms, improving software quality and structuring their delivery processes. I also work on integrating generative AI into business activities and into the design, development, modernization and delivery of software.</p>
                    <p>As the author of Ultimate Java Design Patterns, a trainer, speaker and JUG Leader, I regularly share my experience through articles, conferences, training, mentoring and occasional open-source contributions. I am also the founder of Gad Digital, a technology company through which I develop digital products, business solutions and services in software engineering and applied artificial intelligence.</p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {heroSocials.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card transition hover:-translate-y-1 hover:border-accent hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border/80 shadow-2xl">
             <img
               src="/avatar.jpeg"
               alt="Ricken Bazolo"
               className="h-full w-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
        </section>

        {/* 2. RICKEN BAZOLO, CONSULTANT IT */}
        <section className="rounded-3xl border border-border/70 bg-card/50 p-8 md:p-16">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              {locale === "fr" ? "Ricken Bazolo, Consultant IT" : "Ricken Bazolo, IT Consultant"}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {locale === "fr"
                ? "J’accompagne les entreprises et les organisations dans la conception, la modernisation et l’évolution de leurs applications et plateformes numériques. Mes interventions portent principalement sur l’architecture logicielle, la qualité des systèmes, les choix techniques, le leadership technique et l’amélioration des processus de delivery. J’interviens également dans l’intégration de l’IA générative au service des activités métier et de l’ingénierie logicielle."
                : "I support companies and organizations in designing, modernizing and evolving their digital applications and platforms. My work primarily focuses on software architecture, system quality, technical decision-making, technical leadership and the improvement of software delivery processes. I also support the integration of generative AI into business activities and software engineering."}
            </p>
          </div>
        </section>

        {/* 3. SECTEURS D'INTERVENTION */}
        <section className="space-y-12">
           <div className="space-y-4">
              <h2 className="font-heading text-3xl font-bold">
                {locale === "fr" ? "Secteurs d’intervention" : "Sectors of Intervention"}
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                {locale === "fr"
                  ? "Mon expérience couvre plusieurs secteurs où les enjeux de fiabilité, de sécurité, de performance et de maintenabilité sont essentiels."
                  : "My experience covers several sectors where issues of reliability, security, performance and maintainability are essential."}
              </p>
           </div>

           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sectors.map((sector) => (
                <div key={sector.en} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                   <p className="text-sm font-medium leading-relaxed">
                     {locale === "fr" ? sector.fr : sector.en}
                   </p>
                </div>
              ))}
           </div>
        </section>

        {/* 4. PARCOURS PROFESSIONNEL (TIMELINE) */}
        <section className="space-y-12">
           <div className="space-y-4">
              <h2 className="font-heading text-3xl font-bold">
                {locale === "fr" ? "Parcours professionnel" : "Professional Journey"}
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                {locale === "fr"
                  ? "Synthèse de mon parcours entre missions en entreprise, responsabilités techniques, formation et entrepreneuriat."
                  : "Synthesis of my journey between corporate missions, technical responsibilities, training and entrepreneurship."}
              </p>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full border-collapse text-left text-sm">
               <thead>
                 <tr className="border-b border-border">
                   <th className="py-4 font-semibold text-foreground">{locale === "fr" ? "Période" : "Period"}</th>
                   <th className="py-4 font-semibold text-foreground">{locale === "fr" ? "Organisation" : "Organization"}</th>
                   <th className="py-4 font-semibold text-foreground">{locale === "fr" ? "Rôle" : "Role"}</th>
                   <th className="hidden py-4 font-semibold text-foreground md:table-cell">{locale === "fr" ? "Secteur" : "Sector"}</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border">
                 {highlights.map((item) => (
                   <tr key={item.name + item.period} className="transition-colors hover:bg-card/30">
                     <td className="whitespace-nowrap py-4 text-muted-foreground">{item.period}</td>
                     <td className="py-4 font-medium text-foreground">{item.name}</td>
                     <td className="py-4 text-muted-foreground">{locale === "fr" ? item.role.fr : item.role.en}</td>
                     <td className="hidden py-4 text-xs text-muted-foreground md:table-cell">{locale === "fr" ? item.sector?.fr : item.sector?.en}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </section>

        {/* 5. TYPES DE MISSIONS */}
        <section className="grid gap-12 lg:grid-cols-[1fr_2fr]">
           <div className="space-y-6">
              <h2 className="font-heading text-3xl font-bold">
                {locale === "fr" ? "Types de missions" : "Mission Types"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {locale === "fr"
                  ? "Mes missions couvrent tout le cycle de vie logiciel : architecture, développement, modernisation, qualité et IA. J’interviens avec une approche orientée métier et maintenabilité."
                  : "My missions cover the entire software life cycle: architecture, development, modernization, quality and AI. I intervene with a business-oriented and maintainability approach."}
              </p>
           </div>
           <div className="flex flex-wrap gap-3">
              {missionTypes.map((type) => (
                <div key={type.en} className="rounded-full border border-border/80 bg-card px-6 py-3 text-sm font-medium shadow-sm transition hover:border-accent/40">
                  {locale === "fr" ? type.fr : type.en}
                </div>
              ))}
           </div>
        </section>

        {/* 6. OPEN SOURCE & CONTRIBUTIONS */}
        <section className="space-y-12">
           <h2 className="font-heading text-3xl font-bold">
             {locale === "fr" ? "Open source & contributions" : "Open Source & Contributions"}
           </h2>
           <div className="grid gap-6 md:grid-cols-3">
              {contributions.map((contribution) => (
                <div key={contribution.title} className="rounded-2xl border border-border/60 bg-card p-8 space-y-4 shadow-sm">
                   <h3 className="font-heading text-xl font-bold">{contribution.title}</h3>
                   <p className="text-sm leading-relaxed text-muted-foreground">
                     {locale === "fr" ? contribution.description.fr : contribution.description.en}
                   </p>
                </div>
              ))}
           </div>
        </section>

        {/* 7. FORMATION & TRANSMISSION */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-accent/5 p-8 md:p-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
             <div className="space-y-6">
                <h2 className="font-heading text-3xl font-bold">
                  {locale === "fr" ? "Formation & transmission" : "Training & Sharing"}
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {locale === "fr"
                    ? "La transmission occupe une place importante dans mon parcours. J’ai formé et accompagné des développeurs, des formateurs et des jeunes talents autour du développement logiciel, de Java, de l'IoT et de la robotique."
                    : "Sharing knowledge occupies an important place in my career. I have trained and supported developers, trainers and young talents around software development, Java, IoT and robotics."}
                </p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {[
                  locale === "fr" ? "Formation de développeurs" : "Developer Training",
                  locale === "fr" ? "Mentoring technique" : "Technical Mentoring",
                  locale === "fr" ? "Articles techniques" : "Technical Articles",
                  locale === "fr" ? "Conférences & Talks" : "Conferences & Talks",
                  locale === "fr" ? "Robotique & Domotique" : "Robotics & Home Automation",
                  locale === "fr" ? "Formation de formateurs" : "Trainer Training",
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-border/40 bg-background/50 p-4 text-center text-sm font-medium">
                    {item}
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* 8. AUTEUR SECTION (Livre) */}
        <section className="overflow-hidden rounded-3xl bg-[#1a1d2e] text-white">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center p-8 md:p-16">
              <h2 className="mb-6 font-heading text-3xl font-bold md:text-4xl">
                Auteur de Ultimate Java Design Patterns
              </h2>
              <p className="mb-8 text-lg text-slate-300">
                {locale === "fr"
                  ? "Publié chez Orange AVA, ce livre reflète mon intérêt pour l’architecture logicielle, les design patterns Java et la transmission de bonnes pratiques d’ingénierie logicielle."
                  : "Published by Orange AVA, this book reflects my interest in software architecture, Java design patterns and sharing good software engineering practices."}
              </p>
              <Link
                href="https://orangeava.com/products/ultimate-java-design-patterns"
                target="_blank"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-[#1a1d2e] transition hover:bg-slate-100"
              >
                {locale === "fr" ? "Voir le livre" : "View the book"}
              </Link>
            </div>
            <div className="flex items-center justify-center p-12 md:p-12 bg-accent/10 min-h-[400px]">
               <div className="relative aspect-[3/4] w-64 rotate-2 rounded-lg shadow-2xl">
                  <Image
                    src="/book_cover_a.png"
                    alt="Ultimate Java Design Patterns Cover"
                    fill
                    className="rounded-lg object-cover"
                  />
               </div>
            </div>
          </div>
        </section>

        {/* 9. GAD DIGITAL */}
        <section className="space-y-8">
           <div className="mx-auto max-w-3xl space-y-2 text-center">
              <div className="relative mx-auto h-48 w-48 items-center justify-center overflow-hidden">
                 <Image
                   src="/logo_gd_a.png"
                   alt="Gad Digital Logo"
                   fill
                   className="object-contain"
                 />
              </div>
              <h2 className="font-heading text-3xl font-bold">Gad Digital</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {locale === "fr"
                  ? "En parallèle de mon parcours de consultant, je développe Gad Digital, une entreprise technologique que j’ai fondée pour accompagner les organisations dans la conception, le développement et l’intégration de solutions numériques modernes."
                  : "Alongside my consulting career, I am developing Gad Digital, a technology company I founded to support organizations in the design, development and integration of modern digital solutions."}
              </p>
              <Link
                href={`/${locale}/gad-digital`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-semibold text-white transition hover:bg-accent/90"
              >
                {locale === "fr" ? "Découvrir Gad Digital" : "Discover Gad Digital"}
              </Link>
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
