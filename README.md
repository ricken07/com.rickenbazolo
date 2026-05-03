Personal blog — bilingual FR/EN. This repository powers my personal website and blog accessible at: https://rickenbazolo.com (formerly autourducode.net).

## Main stack
- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS 4
- MDX (+ remark, remark-gfm) for articles
- next-intl for i18n (no page duplication)
- next-themes for light/dark theme

## Features
- Articles in MDX, frontmatter support (title, date, tags, locale)
- Tag filtering, client-side search, archives by year/month
- International navigation under /[locale] (fr / en)
- Theme toggle with preference persistence

## Google Analytics
- Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to your GA4 measurement ID to enable analytics.
- When configured, the app asks for consent before loading Google Analytics.
- After consent, the app sends page views on App Router navigations and tracks article share actions.
