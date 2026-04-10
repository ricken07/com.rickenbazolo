import { readdir } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
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
  { name: "Bluesky", href: "https://bsky.app/profile/rickenbazolo.dev", icon: BlueskyIcon },
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
                {locale === "fr" ? "Java, IA, plateforme" : "Java, AI, platform"}
              </p>

              <h1 className="font-heading text-5xl font-bold leading-tight text-foreground md:text-7xl">
                {locale === "fr" ? (
                  <>
                    Technologue <span className="text-accent">Java & IA</span>
                  </>
                ) : (
                  <>
                    Java & AI <span className="text-accent">Technologist</span>
                  </>
                )}
              </h1>

              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
                {locale === "fr"
                  ? "Technologue Java senior, développeur full-stack et tech entrepreneur. Je conçois des architectures modernes, intègre des LLM dans les applications métier et accompagne les développeurs à travers la formation et le mentoring."
                  : "Senior Java technologist, full-stack developer and tech entrepreneur. I design modern architectures, integrate LLMs into business applications, and support developers through training and mentoring."}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`/${locale}/blog`}
                className="group inline-flex items-center gap-2 rounded-full bg-[#0693e3] px-8 py-3.5 font-semibold text-white shadow-md shadow-[#0693e3]/25 transition hover:scale-[1.01] hover:bg-[#0576c2] hover:shadow-lg hover:shadow-[#0693e3]/30"
              >
                {locale === "fr" ? "Lire le blog" : "Read the blog"}
                <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-8 py-3 font-semibold text-foreground backdrop-blur-sm transition hover:border-accent/40 hover:bg-card"
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
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background/65 text-muted-foreground backdrop-blur-sm transition hover:-translate-y-1 hover:border-accent/40 hover:bg-card hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
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
