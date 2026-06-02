"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { ThemeToggle } from "../ui/ThemeToggle";

interface SiteHeaderProps {
  locale: string;
}

const NAV_ITEMS = [
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "speaking", href: "/speaking" },
  { key: "gad-digital", href: "/gad-digital" },
];

export function SiteHeader({ locale }: SiteHeaderProps) {
  const t = useTranslations("common");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="sr-only">Ricken Bazolo</span>
          <Image
            src="/avatar.jpeg"
            alt="Photo de profil de Ricken Bazolo - Senior Java & AI Technologist"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border border-border object-cover"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className="text-muted-foreground transition hover:text-foreground"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <LocaleSwitcher locale={locale} />
          <ThemeToggle />
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher locale={locale} />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 bg-card/70 text-muted-foreground transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border/60 bg-background md:hidden">
          <Container>
            <nav className="flex flex-col gap-1 py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-card/60 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const target = locale === "fr" ? "en" : "fr";
  const flagUrls: Record<"fr" | "en", string> = {
    fr: "https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f1eb-1f1f7.svg",
    en: "https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f1fa-1f1f8.svg",
  };

  // Replace the locale segment in the current path (e.g. /fr/blog → /en/blog)
  const targetPath = pathname.replace(/^\/(fr|en)/, `/${target}`);

  return (
    <Link
      href={targetPath}
      className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:border-accent hover:text-accent"
      aria-label={`Switch language to ${target.toUpperCase()}`}
    >
      <span className="flex items-center gap-2">
        <Image
          src={flagUrls[target as "fr" | "en"]}
          alt={target === "fr" ? "Drapeau français - Changer la langue" : "US flag - Switch language"}
          width={20}
          height={20}
          className="h-5 w-5"
        />
        <span>{target}</span>
      </span>
    </Link>
  );
}
