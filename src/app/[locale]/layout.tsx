// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GoogleAnalyticsWithConsent } from "@/components/analytics/GoogleAnalyticsWithConsent";

const siteName = "Ricken Bazolo";
const baseUrl = "https://rickenbazolo.dev";
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const consentCookieName = "ricken-analytics-consent";
const localeDescriptions: Record<string, string> = {
    fr: "Blog personnel bilingue (FR/EN) de Ricken Bazolo : Java, IA, open source et produits Gad Digital.",
    en: "Ricken Bazolo's bilingual (FR/EN) blog: Java, AI, open source, and Gad Digital products.",
};

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    if (!locales.includes(locale as (typeof locales)[number])) {
        notFound();
    }

    const description = localeDescriptions[locale] ?? localeDescriptions.en;
    const ogLocale = locale === "fr" ? "fr_FR" : "en_US";
    const title =
        locale === "fr"
            ? "Ricken Bazolo — Ingénierie logicielle & IA"
            : "Ricken Bazolo — Software & AI Engineer";

    return {
        title: {
            default: title,
            template: "%s | Ricken Bazolo",
        },
        description,
        alternates: {
            canonical: `/${locale}`,
            languages: {
                "fr-FR": "/fr",
                "en-US": "/en",
            },
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}`,
            siteName,
            locale: ogLocale,
            alternateLocale: ogLocale === "fr_FR" ? ["en_US"] : ["fr_FR"],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            creator: "@rickenbazolo",
        },
    };
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const cookieStore = await cookies();
    const initialConsent = cookieStore.get(consentCookieName)?.value === "granted"
        ? "granted"
        : cookieStore.get(consentCookieName)?.value === "denied"
            ? "denied"
            : null;

    if (!locales.includes(locale as (typeof locales)[number])) {
        notFound();
    }

    setRequestLocale(locale);

    return (
        <NextIntlClientProvider>
            <GoogleAnalyticsWithConsent measurementId={gaMeasurementId} initialConsent={initialConsent} />
            <a href="#main-content" className="skip-to-content">
                {locale === "fr" ? "Aller au contenu principal" : "Skip to main content"}
            </a>
            <div className="flex min-h-screen flex-col bg-background">
                <SiteHeader locale={locale} />
                <main id="main-content" className="flex-1">{children}</main>
                <SiteFooter />
            </div>
        </NextIntlClientProvider>
    );
}
