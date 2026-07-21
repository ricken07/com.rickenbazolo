import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rickenbazolo.com",
      },
      {
        protocol: "https",
        hostname: "www.rickenbazolo.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  // Optimisations de performance
  compress: true,
  productionBrowserSourceMaps: false,
  // Turbopack est utilisé par défaut dans Next.js 16
  experimental: {},
};

// Active l'analyse des bundles uniquement en mode analyse
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyzer(withNextIntl(nextConfig));
