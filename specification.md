Voici le **document de spécification clair, propre et finalisé**, intégrant :

* ton blog Next.js,
* l’internationalisation sans duplication,
* les articles en Markdown/MDX,
* **et le widget “Archives par date”** (année → mois → posts),
* tout dans un seul document Markdown structuré.

---

# 📘 **Spécification Fonctionnelle & Technique – Blog Personnel de Ricken Bazolo**

*(Next.js 16 · React 19 · TypeScript 5 · Tailwind 4 · Markdown/MDX · i18n FR/EN)*

---

## 🏗️ **1. Stack Technique**

* **Next.js 16.0.5** (App Router)
* **React 19.2.0**
* **TypeScript 5**
* **Tailwind CSS 4**
* **MDX** pour les articles
* **next-intl** pour l’internationalisation SANS duplication de pages
* **Contentlayer** (optionnel) pour indexer le contenu MDX
* Production :

    * SSG/ISR
    * `next/image`
    * SEO avancé (metadata automatique par locale)
    * RSS + sitemap

---

# 🎯 **2. Objectifs & Positionnement**

## 2.1. Objectif

Créer un **site personnel bilingue** (FR/EN), moderne, rapide et agréable à lire, servant de hub pour :

* Blog technique
* Présentation des produits de **Gad Digital** (startup)
* Présentation des projets **open-source**
* Conférences / prise de parole
* Outils / ressources
* Page "About" professionnelle

## 2.2. Audience

* Développeurs & architectes
* CTO, Head of Innovation
* Événements / conférences
* Public francophone & anglophone

## 2.3. ADN & identité

* Professionnel
* Moderne
* Tech & pédagogique
* Positionnement clair :
  **Software & AI Engineer — Founder of Gad Digital — Open-Source Author**

---

# 🧭 **3. Architecture Fonctionnelle des Pages**

> Toutes les pages existent **une seule fois** dans le code.
> L’internationalisation se fait via `[locale]` + fichiers de messages.

Routes principales :

```
/[locale]
/[locale]/blog
/[locale]/blog/[slug]
/[locale]/speaking
/[locale]/gad-digital
/[locale]/opensource
/[locale]/tools
/[locale]/about
/[locale]/newsletter (optionnel)
```

---

## 3.1. **Home – `/{locale}`**

Sections :

1. **Hero** (photo + intro + CTA)
2. **Latest Articles** (3–6 récents dans la langue courante)
3. **Gad Digital – Products** (produits startup)
4. **Open-Source Projects** (toon4j, momo4j…)
5. **Speaking** (2–3 talks récents)
6. **Newsletter** (optionnel)

---

## 3.2. **Blog – `/{locale}/blog`**

Fonctionnalités :

* Liste des articles filtrés par `language === locale`
* Carte article :

    * titre · excerpt · date · tags · readingTime
* Filtres :

    * **par tag**
    * **par langue** (optionnel)
* Recherche client-side
* **Widget “Archives par date”** (voir section 5)

---

## 3.3. **Article – `/{locale}/blog/[slug]`**

Détails :

* Contenu MDX
* Frontmatter :

  ```md
  ---
  title: "Titre"
  slug: "titre-unique"
  language: "fr" | "en"
  publishedAt: "2025-01-15"
  tags: ["Java", "Spring AI"]
  readingTime: 8
  excerpt: "Résumé…"
  status: "published"
  ---
  ```

Fonctionnalités :

* Mise en forme Tailwind Typography (`prose`)
* Table des matières automatique
* Code blocks avec coloration syntaxique
* Callouts (Info, Tip, Warning)
* Articles liés (même tags)
* Navigation précédent / suivant
* Bloc auteur
* Partage social

---

## 3.4. **Speaking – `/{locale}/speaking`**

* Liste des conférences :

    * Titre
    * Événement
    * Date & lieu
    * Tags (Spring, AI…)
    * Slides & replay (si disponibles)
* Filtre :

    * par année
    * par thème

---

## 3.5. **Gad Digital – `/{locale}/gad-digital`**

Présente les produits de ta startup tech :

* EMI AI
* Oukaley
* Haraka Payment
* Digi-Resto

Chaque produit :

* Nom, logo
* Tagline
* Description (FR/EN si nécessaire)
* Rôle (Founder, Architect…)
* Stack
* Lien vers site / docs / démo

---

## 3.6. **Open-Source – `/{locale}/opensource`**

Projets OSS :

* Toon4j
* momo4j
* mcp-server

Pour chaque projet :

* Nom
* Tagline
* Description courte & longue
* Tags (Java, AI, Serialization…)
* Badges GitHub (version, stars…)
* Lien vers repo

---

## 3.7. **Tools – `/{locale}/tools`**

Outils pratiques :

* JSON → Java Record generator
* TOON viewer
* HTTP signature encoder
* Etc.

---

## 3.8. **About – `/{locale}/about`**

* Bio FR/EN
* Rôle : Founder @ Gad Digital
* Expertise : Java, Spring, AI, Architecture…
* Contributions OSS
* Réseaux sociaux
* Timeline

---

# 🌍 **4. Internationalisation (i18n) sans duplication**

## 4.1. Structure des pages

```
app/
  [locale]/
    layout.tsx
    page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
    speaking/page.tsx
    gad-digital/page.tsx
    opensource/page.tsx
    tools/page.tsx
    about/page.tsx
```

## 4.2. Locales supportées

```ts
export type Language = "fr" | "en";
```

## 4.3. Textes localisés

Dossiers :

```
i18n/
  fr/
    common.json
    home.json
    blog.json
    ...
  en/
    common.json
    home.json
    blog.json
    ...
```

## 4.4. Contenu Markdown multilingue

Structure recommandée :

```
content/
  blog/
    spring-ai-function-calling/
      fr.mdx
      en.mdx
    toon4j-intro/
      fr.mdx
```

Chaque dossier = un article global
Chaque fichier = une version de langue

---

# 🧩 **5. Widget Archives par Date**

## 5.1. Objectif

Afficher dans la sidebar :

* Années (collapsibles)
* Mois (collapsibles)
* Liste des articles publiés dans ce mois

Sans changer l’URL du blog
Sans changer les fichiers Markdown
Sans dupliquer rien

## 5.2. Données utilisées

Frontmatter obligatoire :

```md
publishedAt: "YYYY-MM-DD"
```

## 5.3. Construction de la structure (année → mois → posts)

Fonction `buildArchive(posts, locale)` :

* Récupère tous les posts de la locale
* Trie par date
* Groupe :

    * par année
    * par mois
* Génère un tableau :

```ts
{
  year: "2025",
  months: [
    {
      month: "01",
      monthLabel: "Janvier 2025",
      posts: [ ... ]
    },
    ...
  ]
}
```

## 5.4. Composant React

`<ArchiveWidget locale groups />`

Fonctionnalités :

* Accordion d’années
* Accordion de mois
* Liste des articles
* Liens vers :
  `/{locale}/blog/[slug]`

Ce composant est **client-side** (`"use client"`).

---

# 📁 **6. Structure Technique Finale**

```
app/
  [locale]/
    layout.tsx
    page.tsx
    blog/
      page.tsx
      [slug]/page.tsx
    speaking/
      page.tsx
    gad-digital/
      page.tsx
    opensource/
      page.tsx
    tools/
      page.tsx
    about/
      page.tsx
content/
  blog/
  opensource/
  products/
  speaking/
  tools/
i18n/
components/
lib/
styles/
api/
  sitemap/
  rss/
```

---

# 📦 **7. Types TypeScript**

## 7.1. Base

```ts
export type Language = "fr" | "en";

export interface BaseContent {
  slug: string;
  title: string;
  language: Language;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}
```

## 7.2. BlogPost

```ts
export interface BlogPost extends BaseContent {
  excerpt: string;
  readingTime: number;
  status: "draft" | "published";
  publishedAt: string; // YYYY-MM-DD
}
```

## 7.3. Talk

```ts
export interface Talk {
  slug: string;
  title: string;
  event: string;
  location: string;
  date: string;
  language: Language;
  tags: string[];
  slidesUrl?: string;
  videoUrl?: string;
}
```

## 7.4. StartupProduct

```ts
export interface StartupProduct {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  websiteUrl?: string;
  docsUrl?: string;
  demoUrl?: string;
  featured?: boolean;
}
```

## 7.5. OpenSourceProject

```ts
export interface OpenSourceProject {
  slug: string;
  name: string;
  tagline: string;
  descriptionShort: string;
  descriptionLong?: string;
  tags: string[];
  repoUrl: string;
  latestVersion?: string;
}
```

---

# 🎨 **8. Design System (Tailwind CSS 4)**

## Style général

* Design moderne & épuré
* Typographie large & confortable
* Mode clair/sombre (next-themes)
* Layout aéré, focus sur la lisibilité

## Composants UI

* Header (logo, menu, FR/EN, dark mode)
* Footer
* Cards (blog, projets, produits)
* Prose (articles MDX)
* Tag badges
* Callouts (tips, warnings)
* Widgets (archives, recommendation)
* Animations légères (framer-motion)

---

# 🔍 **9. SEO & Performance**

## SEO

* Metadata dynamique par locale
* Title & description localisées
* alternate/hreflang
* Structured data JSON-LD :

    * Person
    * Organization
    * BlogPosting
    * Event

## Performance

* SSG/ISR
* `next/image`
* Lazy loading intelligent

---

# 🗺️ **10. Roadmap**

### Phase 1 – MVP

* Home bilingue
* Blog FR/EN en Markdown
* Article pages
* About
* i18n complet
* Dark mode
* Widget archives

### Phase 2

* Gad Digital products
* Open-Source projects
* Speaking
* Tools

### Phase 3

* Newsletter
* RSS + sitemap avancé
* Animations UX
* Playground interactifs

---
