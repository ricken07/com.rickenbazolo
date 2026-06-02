import { readdir } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { Container } from "@/components/layout/Container";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import type { BlogPost } from "@/lib/blog/types";
import { BubbleGallery } from "@/components/gallery/BubbleGallery";
import type { GalleryImage } from "@/components/gallery/BubbleGallery";
import { NewsletterInlineForm } from "@/components/newsletter/NewsletterInlineForm";
import youtubeVideos from "@/content/videos/youtube-videos.json";
import { PostCard } from "@/components/blog/PostCard";

const heroSocials = [
  { name: "GitHub", href: "https://github.com/rickenbazolo", icon: GitHubIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/rickenbazolo", icon: LinkedinIcon },
  { name: "X", href: "https://x.com/rickenbazolo", icon: XIcon },
  { name: "Bluesky", href: "https://bsky.app/profile/ricken07.bsky.social", icon: BlueskyIcon },
  { name: "YouTube", href: "https://www.youtube.com/@rickenbazolo", icon: YoutubeIcon },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  noStore();

  const { locale } = await params;
  const posts = await getAllPosts(locale);
  const latestPosts = posts.slice(0, 3);
  const galleryImages = await getGalleryImages();

  return (
    <main className="py-8 md:py-16">
      <Container className="space-y-16 md:space-y-24">
        {/* HERO - Redesign avec impact visuel (adaptatif light/dark) */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-background via-card to-card px-8 py-16 shadow-sm md:py-24 dark:from-background dark:via-card dark:to-card">
          {/* Background Pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          {/* Animated Blobs */}
          <div className="blob absolute -left-24 top-12 h-64 w-64 rounded-full bg-[#0693e3]/8 dark:bg-[#0693e3]/10" />
          <div className="blob blob-delayed absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#1a1d2e]/[0.04] dark:bg-white/[0.05]" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
            <div className="fade-in-up space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                {locale === "fr" ? "Expertise & Transmission" : "Expertise & Sharing"}
              </p>

              <h1 className="font-heading text-5xl font-bold leading-tight text-foreground md:text-7xl">
                {locale === "fr" ? (
                  <>
                    Tech entrepreneur & <span className="text-accent">architecte logiciel</span>
                  </>
                ) : (
                  <>
                    Tech entrepreneur & <span className="text-accent">software architect</span>
                  </>
                )}
              </h1>

              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
                {locale === "fr"
                  ? "Je suis Ricken Bazolo, Consultant IT, auteur, speaker, contributeur open source et fondateur de Gad Digital. Avec plus de 10 ans d’expérience professionnelle, je conçois des applications et plateformes numériques robustes, avec une expertise forte en architecture logicielle, Java, développement fullstack, ainsi que les agents IA et systèmes agentiques."
                  : "I am Ricken Bazolo, IT Consultant, author, speaker, open source contributor and founder of Gad Digital. With over 10 years of professional experience, I design robust digital applications and platforms, with strong expertise in software architecture, Java, fullstack development, as well as AI agents and agentic systems."}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`/${locale}/blog`}
                className="group inline-flex items-center gap-2 rounded-full bg-[#0693e3] px-8 py-3.5 font-semibold text-white shadow-md shadow-[#0693e3]/25 transition hover:scale-[1.01] hover:bg-[#0576c2] hover:shadow-lg hover:shadow-[#0693e3]/30"
              >
                {locale === "fr" ? "Lire mes articles" : "Read my articles"}
                <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                href={`/${locale}/speaking`}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-8 py-3 font-semibold text-foreground backdrop-blur-sm transition hover:border-accent/40 hover:bg-card"
              >
                {locale === "fr" ? "Voir mes conférences" : "See my talks"}
              </Link>

              <Link
                href={`/${locale}/gad-digital`}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-8 py-3 font-semibold text-foreground backdrop-blur-sm transition hover:border-accent/40 hover:bg-card"
              >
                {locale === "fr" ? "Découvrir Gad Digital" : "Discover Gad Digital"}
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {heroSocials.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background/65 text-muted-foreground backdrop-blur-sm transition hover:-translate-y-1 hover:border-accent/40 hover:bg-card hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* DOMAINES D'EXPERTISE */}
        <section className="space-y-12">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              {locale === "fr" ? "Domaines d’expertise" : "Areas of Expertise"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {locale === "fr"
                ? "Mon expertise se situe à l’intersection de l’ingénierie logicielle, de l’architecture des systèmes, du développement fullstack, de l’intelligence artificielle appliquée et de la transmission technique."
                : "My expertise lies at the intersection of software engineering, systems architecture, fullstack development, applied artificial intelligence, and technical sharing."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: locale === "fr" ? "Architecture logicielle" : "Software Architecture",
                description: locale === "fr"
                  ? "Conception d’applications robustes, architectures modulaires, APIs, backend Java, Spring, Quarkus, architecture hexagonale, microservices et systèmes d’entreprise."
                  : "Design of robust applications, modular architectures, APIs, Java backend, Spring, Quarkus, hexagonal architecture, microservices and enterprise systems.",
                icon: "🏗️"
              },
              {
                title: locale === "fr" ? "IA appliquée" : "Applied AI",
                description: locale === "fr"
                  ? "Intégration des LLM, du RAG, des agents IA, de Spring AI et des systèmes conversationnels dans des applications métier concrètes."
                  : "Integration of LLMs, RAG, AI agents, Spring AI and conversational systems into concrete business applications.",
                icon: "🤖"
              },
              {
                title: locale === "fr" ? "Développement fullstack" : "Fullstack Development",
                description: locale === "fr"
                  ? "Développement d’applications web, mobiles et backend avec une approche orientée qualité, maintenabilité, performance et valeur métier."
                  : "Web, mobile and backend application development with an approach oriented towards quality, maintainability, performance and business value.",
                icon: "💻"
              },
              {
                title: locale === "fr" ? "Transmission technique" : "Technical Sharing",
                description: locale === "fr"
                  ? "Articles, conférences, formations et contenus pédagogiques autour de l’ingénierie logicielle et de l’IA appliquée."
                  : "Articles, conferences, training and educational content around software engineering and applied AI.",
                icon: "📚"
              }
            ].map((expertise) => (
              <div key={expertise.title} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-md">
                <div className="mb-4 text-4xl">{expertise.icon}</div>
                <h3 className="mb-3 font-heading text-xl font-bold">{expertise.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{expertise.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MISSIONS, CONTRIBUTIONS & TRANSMISSION */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/30 px-8 py-12 md:px-16 md:py-20">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#273171]/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#0693e3]/5 blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl font-bold md:text-4xl">
                {locale === "fr" ? "Missions, contributions & transmission" : "Missions, Contributions & Sharing"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {locale === "fr"
                  ? "Mon parcours s’est construit entre missions en entreprise, contributions open source, formation technique et projets entrepreneuriaux. J’interviens à la fois comme consultant IT, architecte logiciel, développeur fullstack, formateur, speaker et fondateur de Gad Digital."
                  : "My path has been built between corporate missions, open source contributions, technical training and entrepreneurial projects. I intervene as an IT consultant, software architect, fullstack developer, trainer, speaker and founder of Gad Digital."}
              </p>
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 font-semibold text-accent transition hover:translate-x-1"
              >
                {locale === "fr" ? "En savoir plus sur mon parcours" : "Learn more about my background"}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid gap-6">
              {[
                {
                  title: locale === "fr" ? "Missions en entreprise" : "Corporate Missions",
                  text: locale === "fr"
                    ? "Accompagnement d’entreprises dans des secteurs variés : services financiers, fintech, jeux, éducation, services publics, industrie et santé."
                    : "Supporting companies in various sectors: financial services, fintech, games, education, public services, industry and health."
                },
                {
                  title: locale === "fr" ? "Contributions open source" : "Open Source Contributions",
                  text: locale === "fr"
                    ? "Participation active à des projets Java et IA (Spring AI) et publication de bibliothèques comme Toon4j."
                    : "Active participation in Java and AI projects (Spring AI) and publication of libraries like Toon4j."
                },
                {
                  title: locale === "fr" ? "Formation & jeunesse" : "Training & Youth",
                  text: locale === "fr"
                    ? "Mentoring de développeurs et initiation des jeunes à la robotique, domotique et aux systèmes embarqués."
                    : "Mentoring developers and introducing young people to robotics, home automation and embedded systems."
                }
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border/40 bg-background/50 p-6 backdrop-blur-sm">
                  <h3 className="mb-2 font-heading font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION LIVRE */}
        <section className="overflow-hidden rounded-3xl bg-[#1a1d2e] text-white">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center p-8 md:p-16">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
                Auteur
              </div>
              <h2 className="mb-6 font-heading text-3xl font-bold md:text-4xl">
                Ultimate Java Design Patterns
              </h2>
              <p className="mb-8 text-lg text-slate-300">
                {locale === "fr"
                  ? "Publié chez Orange AVA, ce livre est consacré aux design patterns Java, à l’architecture logicielle moderne et à la conception d’applications robustes, maintenables et évolutives."
                  : "Published by Orange AVA, this book is dedicated to Java design patterns, modern software architecture and the design of robust, maintainable and scalable applications."}
              </p>
              <Link
                href="https://orangeava.com/products/ultimate-java-design-patterns"
                target="_blank"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-[#1a1d2e] transition hover:scale-[1.02] hover:bg-slate-100"
              >
                {locale === "fr" ? "Voir le livre" : "View the book"}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
            <div className="relative h-96 md:h-auto">
               <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
               <div className="flex h-full items-center justify-center p-8">
                  {/* Couverture du livre */}
                  <div className="relative aspect-[3/4] w-64 rotate-3 rounded-lg shadow-2xl transition group-hover:rotate-0">
                    <Image
                      src="/book_cover_a.png"
                      alt="Ultimate Java Design Patterns Cover"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* SECTION GAD DIGITAL */}
        <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-background via-card to-card p-8 md:p-16">
          <div className="relative z-10 mx-auto max-w-3xl space-y-4 text-center">
            <div className="relative mx-auto h-48 w-48 items-center justify-center overflow-hidden">
               <Image
                 src="/logo_gd_a.png"
                 alt="Gad Digital Logo"
                 fill
                 className="object-contain"
               />
            </div>
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              {locale === "fr" ? "Fondateur de Gad Digital" : "Founder of Gad Digital"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {locale === "fr"
                ? "Gad Digital est l’entreprise technologique que j’ai fondée pour transformer mon expertise en solutions, produits et accompagnements concrets. À travers Gad Digital, je porte des initiatives autour du développement de solutions numériques, de l’IA appliquée et de la formation technique."
                : "Gad Digital is the technology company I founded to transform my expertise into concrete solutions, products and support. Through Gad Digital, I lead initiatives around digital solution development, applied AI and technical training."}
            </p>
            <Link
              href={`/${locale}/gad-digital`}
              className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-8 py-3.5 font-semibold text-accent transition hover:bg-accent/10"
            >
              {locale === "fr" ? "Découvrir Gad Digital" : "Discover Gad Digital"}
            </Link>
          </div>
        </section>

        {/* LATEST ARTICLES ─────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Blog
              </p>
              <h2 className="font-heading text-3xl font-bold md:text-4xl">
                {locale === "fr" ? "Derniers articles" : "Latest articles"}
              </h2>
            </div>
            <Link
              href={`/${locale}/blog`}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent"
            >
              {locale === "fr" ? "Tout voir" : "View all"}
              <svg
                className="h-4 w-4 transition group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {latestPosts.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post: BlogPost) => (
                <PostCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {locale === "fr"
                ? "Aucun article pour le moment."
                : "No articles yet."}
            </p>
          )}
        </section>

        {/* VIDEOS - Section éditoriale YouTube */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                YouTube
              </p>
              <h2 className="font-heading text-3xl font-bold md:text-4xl">
                {locale === "fr" ? "Vidéos récentes" : "Recent videos"}
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {youtubeVideos.map((video) => (
              <div
                key={video.id}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
              >
                <div className="aspect-video">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY - Redesign moderne */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                {locale === "fr" ? "Galerie" : "Gallery"}
              </p>
              <h2 className="font-heading text-3xl font-bold md:text-4xl">
                {locale === "fr" ? "Moments & Projets" : "Moments & Projects"}
              </h2>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-background to-card p-8 md:p-12">
            <div className="blob absolute -left-6 -top-6 h-32 w-32 rounded-full bg-[#0693e3]/20" />
            <div className="blob blob-delayed absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-[#273171]/15" />

            <div className="relative">
              <BubbleGallery images={galleryImages} />
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                {locale === "fr"
                    ? "Cliquez sur les bulles pour voir les images en plein écran"
                    : "Click on bubbles to view images fullscreen"}
              </p>
            </div>
          </div>
        </section>

        {/* NEWSLETTER - Redesign moderne */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0693e3]/10 via-card to-[#273171]/5 p-8 md:p-12">
          <div className="blob absolute -right-16 top-0 h-64 w-64 rounded-full bg-[#0693e3]/20" />
          <div className="blob blob-delayed absolute -left-12 bottom-0 h-48 w-48 rounded-full bg-[#273171]/10" />

          <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0693e3]/20 bg-[#0693e3]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0693e3]">
              Newsletter
            </div>

            <h3 className="font-heading text-3xl font-bold md:text-4xl">
              {locale === "fr"
                ? "Restez à jour avec mes derniers articles"
                : "Stay updated with my latest articles"}
            </h3>

            <p className="text-muted-foreground">
              {locale === "fr"
                ? "Recevez mes notes sur Java, l'IA et l'ingénierie logicielle directement dans votre boîte mail."
                : "Get my notes on Java, AI, and software engineering delivered straight to your inbox."}
            </p>

            <NewsletterInlineForm locale={locale} />

            <p className="text-xs text-muted-foreground">
              {locale === "fr"
                ? "Sans spam. Désabonnement en un clic."
                : "No spam. Unsubscribe anytime."}
            </p>
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

const GALLERY_DIRECTORY = path.join(process.cwd(), "public", "gallery");
const IMAGE_FILE_PATTERN = /\.(avif|gif|jpe?g|png|webp)$/i;

async function getGalleryImages(): Promise<GalleryImage[]> {
  const files = await readdir(GALLERY_DIRECTORY, { withFileTypes: true }).catch(() => []);

  return files
    .filter((entry) => entry.isFile() && IMAGE_FILE_PATTERN.test(entry.name))
    .map((entry) => ({
      src: `/gallery/${encodeURIComponent(entry.name)}`,
      priority: extractImagePriority(entry.name),
    }))
    .sort((left, right) => right.priority - left.priority || left.src.localeCompare(right.src));
}

function extractImagePriority(filename: string): number {
  const match = filename.match(/(\d+)(?=\.[^.]+$)/);
  return Number(match?.[1] ?? 0);
}
