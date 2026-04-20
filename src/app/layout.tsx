import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/prose.css";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale } from "@/i18n/config";

// Polices Google Fonts selon charte graphique
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteTitle = "Ricken Bazolo — Software & AI Engineer";
const siteDescription =
  "Personal website, bilingual blog, and project hub for Ricken Bazolo. Java, AI, open source, and product delivery insights.";

export const metadata: Metadata = {
  metadataBase: new URL("https://rickenbazolo.dev"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  title: {
    default: siteTitle,
    template: "%s | Ricken Bazolo",
  },
  description: siteDescription,
  keywords: ["Ricken Bazolo", "Java", "AI", "Spring", "Next.js", "TypeScript", "Open Source", "Gad Digital", "Conférences"],
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/fr",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "https://rickenbazolo.dev",
    siteName: "Ricken Bazolo",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@rickenbazolo",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0693e3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
