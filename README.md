# Albert Chung - personal website

Portfolio and technical writing site for
[dogeplusplus.github.io](https://dogeplusplus.github.io). It is a static
[Astro](https://astro.build) site deployed to GitHub Pages.

## Local preview

Install Node.js 22 or newer, then run:

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). Astro watches the source
files and refreshes the site as you edit.

To test the production output locally:

```bash
npm run build
npm run preview
```

The production preview is served at
[http://localhost:4321](http://localhost:4321) unless that port is already in
use.

## Common updates

The homepage content lives in [`src/pages/index.astro`](src/pages/index.astro).
The `projects` array near the top controls the selected work cards. Update that
array to add, remove or reorder projects.

Shared styling lives in [`src/styles/global.css`](src/styles/global.css).
The site-wide header, footer and metadata live under [`src/components`](src/components)
and [`src/layouts`](src/layouts).

## Add a technical article

Create a Markdown file in [`src/content/blog`](src/content/blog). Use this
frontmatter shape:

```md
---
title: "A useful title"
description: "A one-sentence summary for the writing index and search previews."
publishedAt: 2026-05-31
tags: ["PyTorch", "Computer vision"]
draft: false
---

Write the article here.
```

The filename becomes the URL slug. For example,
`src/content/blog/model-notes.md` is published at `/writing/model-notes/`.
Set `draft: true` to keep an unfinished post out of the build.

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
The workflow builds the site and deploys the generated `dist` directory using
GitHub's official Pages actions.

In the GitHub repository settings, set **Pages > Build and deployment > Source**
to **GitHub Actions** once. No generated site files need to be committed.

## Checks before publishing

```bash
npm run build
```

The production build catches broken content frontmatter and Astro template
errors. It also generates the sitemap.
