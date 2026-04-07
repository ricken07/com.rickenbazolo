"use client";

import Link from "next/link";
import { Container } from "./Container";
import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("common");
  const year = new Date().getFullYear();

  const socials = [
      { name: "GitHub", href: "https://github.com/ricken07", icon: GitHubIcon },
      { name: "LinkedIn", href: "https://www.linkedin.com/in/rickenbazolo/", icon: LinkedinIcon },
      { name: "X", href: "https://x.com/RickenBrice", icon: XIcon },
      { name: "Bluesky", href: "https://bsky.app/profile/ricken07.bsky.social", icon: BlueskyIcon },
      { name: "YouTube", href: "https://www.youtube.com/@autourducode", icon: YoutubeIcon },
  ];

  return (
    <footer className="border-t border-border bg-card py-10 text-sm text-muted-foreground">
      <Container className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>
          © {year} Ricken Bazolo · {t("footer.rights")}
        </p>
        <div className="flex items-center gap-2">
          {socials.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={name}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/70 text-muted-foreground transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </Container>
    </footer>
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
