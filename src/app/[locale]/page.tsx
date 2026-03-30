import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PostCard } from "@/components/blog/PostCard";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import type { BlogPost } from "@/lib/blog/types";
import { BubbleGallery } from "@/components/gallery/BubbleGallery";
import { NewsletterInlineForm } from "@/components/newsletter/NewsletterInlineForm";

const heroSocials = [
  { name: "GitHub", href: "https://github.com/rickenbazolo", icon: GitHubIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/rickenbazolo", icon: LinkedinIcon },
  { name: "X", href: "https://x.com/rickenbazolo", icon: XIcon },
  { name: "Bluesky", href: "https://bsky.app/profile/rickenbazolo.dev", icon: BlueskyIcon },
  { name: "YouTube", href: "https://www.youtube.com/@rickenbazolo", icon: YoutubeIcon },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505238680356-667803448bb6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80",
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = await getAllPosts(locale);
  const latestPosts = posts.slice(0, 4);

  return (
    <main className="py-8 md:py-16">
      <Container className="space-y-16 md:space-y-24">
        {/* HERO - Redesign avec impact visuel (adaptatif light/dark) */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0693e3]/5 via-card to-[#0693e3]/10 px-8 py-16 dark:from-[#273171] dark:via-[#3d4a8f] dark:to-[#0693e3]/20 md:py-24">
          {/* Background Pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          {/* Animated Blobs */}
          <div className="blob absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#0693e3]/20 dark:bg-[#0693e3]/30" />
          <div className="blob blob-delayed absolute -right-16 -top-20 h-80 w-80 rounded-full bg-[#273171]/5 dark:bg-white/10" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
            <div className="fade-in-up space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0693e3]/30 bg-[#0693e3]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0693e3] backdrop-blur-sm dark:border-white/20 dark:bg-white/10 dark:text-white/90">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0693e3] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0693e3]"></span>
                </span>
                {locale === "fr" ? "Disponible pour freelance" : "Available for freelance"}
              </div>

              <h1 className="font-heading text-5xl font-bold leading-tight text-foreground md:text-7xl">
                {locale === "fr" ? (
                  <>
                    Technologue <span className="bg-gradient-to-r from-[#0693e3] to-[#273171] bg-clip-text text-transparent dark:from-[#0693e3] dark:to-white">Java & IA</span>
                  </>
                ) : (
                  <>
                    Java & AI <span className="bg-gradient-to-r from-[#0693e3] to-[#273171] bg-clip-text text-transparent dark:from-[#0693e3] dark:to-white">Technologist</span>
                  </>
                )}
              </h1>

              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
                {locale === "fr"
                  ? "Développeur full stack, mentor et conférencier avec 10+ ans d'expérience. Je construis des solutions IA et accompagne les équipes tech."
                  : "Full-stack developer, mentor, and speaker with 10+ years of experience. I build AI solutions and help tech teams grow."}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`/${locale}/blog`}
                className="group inline-flex items-center gap-2 rounded-full bg-[#0693e3] px-8 py-3.5 font-semibold text-white shadow-lg shadow-[#0693e3]/30 transition hover:scale-105 hover:bg-[#0576c2] hover:shadow-xl hover:shadow-[#0693e3]/40"
              >
                {locale === "fr" ? "Lire le blog" : "Read the blog"}
                <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#0693e3]/30 bg-[#0693e3]/10 px-8 py-3 font-semibold text-foreground backdrop-blur-sm transition hover:border-[#0693e3]/50 hover:bg-[#0693e3]/20 dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:border-white/50 dark:hover:bg-white/20"
              >
                {locale === "fr" ? "En savoir plus" : "Learn more"}
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
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/50 text-muted-foreground backdrop-blur-sm transition hover:-translate-y-1 hover:border-accent hover:bg-accent/20 hover:text-accent hover:shadow-lg hover:shadow-accent/20 dark:border-white/20 dark:bg-white/5 dark:text-white/70"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* LATEST ARTICLES - Grille asymétrique */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">{locale === "fr" ? "Blog" : "Blog"}</p>
              <h2 className="font-heading text-3xl font-bold md:text-4xl">{locale === "fr" ? "Derniers articles" : "Latest articles"}</h2>
            </div>
            <Link
              href={`/${locale}/blog`}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent"
            >
              {locale === "fr" ? "Tout voir" : "View all"}
              <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          {latestPosts.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Featured Post - Large */}
              {latestPosts[0] && (
                <article className="hover-lift group relative col-span-full overflow-hidden rounded-2xl border border-border bg-card transition lg:col-span-2 lg:row-span-2">
                  <Link href={`/${locale}/blog/${latestPosts[0].slug}`} className="block p-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <time>{new Date(latestPosts[0].publishedAt).toLocaleDateString(locale)}</time>
                        {latestPosts[0].readingTime && <span>• {latestPosts[0].readingTime} min</span>}
                      </div>
                      <h3 className="font-heading text-3xl font-bold leading-tight transition group-hover:text-accent md:text-4xl">
                        {latestPosts[0].title}
                      </h3>
                      {latestPosts[0].excerpt && (
                        <p className="text-lg leading-relaxed text-muted-foreground">{latestPosts[0].excerpt}</p>
                      )}
                      {latestPosts[0].tags && latestPosts[0].tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {latestPosts[0].tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              )}

              {/* Regular Posts - Smaller */}
              {latestPosts.slice(1).map((post: BlogPost) => (
                <article key={post.slug} className="hover-lift group relative overflow-hidden rounded-2xl border border-border bg-card transition">
                  <Link href={`/${locale}/blog/${post.slug}`} className="block p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <time>{new Date(post.publishedAt).toLocaleDateString(locale)}</time>
                        {post.readingTime && <span>• {post.readingTime} min</span>}
                      </div>
                      <h3 className="font-heading text-xl font-bold leading-tight transition group-hover:text-accent">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{locale === "fr" ? "Aucun article pour le moment." : "No articles yet."}</p>
          )}
        </section>

        {/* NEWSLETTER - Redesign moderne */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0693e3]/10 via-card to-[#273171]/5 p-8 md:p-12">
          <div className="blob absolute -right-16 top-0 h-64 w-64 rounded-full bg-[#0693e3]/20" />
          <div className="blob blob-delayed absolute -left-12 bottom-0 h-48 w-48 rounded-full bg-[#273171]/10" />

          <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0693e3]/20 bg-[#0693e3]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0693e3]">
              📬 Newsletter
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
