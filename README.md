Mon Blog personnel. Un espace bilingue (FR/EN) pour publier des articles tech. Le design reste sobre, optimisé pour la lecture, avec un widget d'archives par date et un mode clair/sombre.

## Stack principale
- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS 4 pour le style
- MDX + remark/remark-gfm pour le contenu
- next-intl pour l'i18n sans duplication de pages
- next-themes pour le thème clair/sombre

## Contenu et sections
- Blog multilingue (FR/EN) avec filtres par tags, recherche client et archives par année/mois.

## Démarrage rapide
```bash
npm install
npm run dev
```
Ouvre `http://localhost:3000` puis commence dans `src/app/[locale]`.

## Scripts utiles
- `npm run dev` : serveur de développement
- `npm run build` : build de production
- `npm run start` : serveur après build
- `npm run lint` : linting ESLint
- `npm run typecheck` : vérification TypeScript
