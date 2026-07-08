# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal site and blog for leolem.dev, built with Astro + TailwindCSS, statically generated and deployed to GitHub Pages. Content (blog posts, portfolio entries, and their assets) lives in a **separate private repo** (`leo-lem/content.leolem.dev`) and is merged into `src/` at build time — see "Content sync" below.

## Commands

```bash
npm start           # astro dev --host
npm run build       # astro build (static output to dist/)

npm test            # playwright test (full suite; playwright.config.ts starts/reuses a dev server on :4321 by default)
npm run test:smoke  # playwright test test/smoke.spec.ts only
npm run test:tool   # playwright test -c playwright.tool.config.ts (tool/ unit-style tests, no server needed)
npm run test:co2    # tsx test/check_co2.ts (CO2 regression check against a live URL)

npm run tool:sync    # tsx tool/sync.ts — merge .content/ into src/content and src/assets
npm run tool:icons   # tsx tool/icons.ts — regenerate favicons/social.png into public/
npm run tool:notify  # tsx tool/notify.ts — send OneSignal push for un-notified blog posts
npm run tool:alert   # wrangler deploy -c wrangler.alert.toml — deploy the Cloudflare Worker in tool/alert.ts
```

To run a single Playwright test: `npx playwright test test/page/blog.spec.ts` (add `-g "test name"` to filter by title). `npm test` uses `playwright.config.ts`, which starts/reuses a dev server at `http://localhost:4321` (or `$BASE_URL`) and runs both Desktop and Mobile projects. `npm run test:tool` uses `playwright.tool.config.ts` (testDir `test/tool`, no webServer) for the standalone Node tools in `tool/`. Unit-style specs for `src/lib` live under `test/unit`.

There is no separate lint/typecheck script; `astro build` (via `astro check` internally through the strict tsconfig) is the closest thing to a type-check gate, and it's what CI runs.

## Content sync — read this before touching `src/content` or `src/assets`

Blog posts (`src/content/blog`) and portfolio entries (`src/content/portfolio`), plus their images (`src/assets/blog`, `src/assets/portfolio`), are **not the source of truth** in this repo for content that comes from the content repo. They get overwritten by `npm run tool:sync`, which copies from a checked-out `.content/` directory (cloned from `leo-lem/content.leolem.dev` by `.github/actions/checkout-content` in CI, or manually via `git clone` locally). `.content/` is gitignored here.

- `topics.json`, `about.md`, static pages (`imprint.md`, `privacy.md`) and everything under `src/pages`, `src/components`, `src/layout`, `src/lib` ARE owned by this repo.
- When editing blog/portfolio content for real, it belongs in the content repo, not here — this repo just renders it. Local edits under `src/content/blog|portfolio` will be clobbered by the next sync.
- `tool/sync.ts` is intentionally generic (`from`, `root`, `collections` params) so it's testable without touching the real filesystem layout — see `test/tool/sync.spec.ts`.

## Content model (`src/content.config.ts`)

Three Astro content collections, defined in `src/content/{blog,portfolio,topics}.ts` and re-exported via `src/content/index.ts`:

- **`blog`** — glob-loaded `.md` from `src/content/blog/**`. Schema includes `featured`, `date`, `tags`, `projects` (links a post to portfolio entries by id), optional `author` (for guest posts). Sorted featured-first then by date; `onlyPublished` filters out future-dated posts in production (but not in `astro dev`, so scheduled posts are previewable locally).
- **`portfolio`** — glob-loaded `.md` from `src/content/portfolio/**`. Schema includes `featured`, `tags`, `links` (typed `github`/`appstore`/`webpage`/`document`).
- **`topics`** — single `topics.json` file loaded via `file()` loader, not glob. Represents skill/topic tags grouped by `category` (`Product`/`Systems`/`Engineering`), with `isPriority` and `confidence` driving sort order and `categoriesFromTopics()`/`TopicPills` display.

Cross-linking between collections is by convention, not a schema relation: a blog post's `projects: string[]` array holds portfolio entry ids; `src/lib/related.ts` (`relatedArticlesFor`, `relatedProjectsFor`, `relatedArticlesByTags`) resolves these both ways for "related content" sections. Blog series are inferred from the post id path prefix (`id.split("/")[0]`, e.g. `blog/vigil/part-1` → series `vigil`), which `relatedArticlesByTags` uses to weight same-series posts higher.

## Routing

File-based Astro routes in `src/pages`:
- `index.astro` — homepage (portfolio + blog highlights)
- `blog/[...article].astro` — individual post pages (catch-all on the content id, so series posts like `vigil/part-1` route correctly)
- `blog/[series].astro` — series index page
- `portfolio/[...project].astro` — individual project pages
- `rss.xml.ts`, `404.astro`, and plain markdown pages `imprint.md` / `privacy.md` (rendered through `MarkdownLayout`)

`src/layout/BaseLayout.astro` is the shared shell: sets SEO/OpenGraph/Twitter meta and JSON-LD (defaulting to a Person schema built from `about.md` frontmatter), wires up the OneSignal web push SDK and Cloudflare Turnstile script, and renders `NavBar` + footer. Redirects for old URLs live in `astro.config.ts` (`redirects`) and `src/pages/blog/redirects.json`.

## Images / thumbnails

`src/lib/image.ts` resolves a content entry's thumbnail from a loose `src` string (e.g. a portfolio/blog id) by globbing `src/assets/**/*` via `import.meta.glob` and trying, in order: an exact-name match with common extensions, a `default.*` in the same directory, then a `default.*` at the top-level of that asset root. This is why every `src/assets/blog/<series>/` and `src/assets/portfolio/` directory has a `default.png` — it's the fallback thumbnail. Covered by `test/unit/image.spec.ts` via the pure `pickThumbnailKey` helper (the glob/import side is not unit tested).

## Tools (`tool/`)

Standalone Node/tsx scripts, each with a `default export` function (for testing/composition) plus an `if (isExecuted(import.meta.url))` guard (in `tool/lib/isExecuted.ts`) so they also run directly via `tsx tool/x.ts`. This pattern lets `test/tool/*.spec.ts` import and call the function directly instead of shelling out.

- **`sync.ts`** — content repo → `src/` merge, see above.
- **`icons.ts`** — generates favicons/manifest/social.png from `src/assets/profile.jpg` + `header-dark.png` using the `favicons` package, output to `public/`.
- **`notify.ts`** — reads blog markdown directly out of `.content/content/blog` (its own lightweight frontmatter parser, not Astro's content layer, since it runs standalone), diffs against `.content/.notified.json`, and sends OneSignal push notifications (template + a plain custom notification) for newly-published, non-future-dated posts. Run from `main.yml`'s `notify` job after a successful deploy; commits the updated `.notified.json` back to the content repo afterward.
- **`alert.ts`** — a Cloudflare Worker (deployed separately via `wrangler deploy -c wrangler.alert.toml` to `alert.leolem.dev`) handling a `/subscribe` webhook used by client-side interest/CTA tracking; validates `x-webhook-secret`, forwards to OneSignal with a "Staging" segment, and handles CORS against `ALLOWED_ORIGINS`. This worker is independent of the Astro site's own build/deploy.

## CI (`.github/workflows`)

- **`pr.yml`** — on PRs to `main`: build, then (needing content checked out + synced) `npm test` and `npm run test:tool`.
- **`main.yml`** — scheduled (weekly) + manual deploy: bootstrap → checkout content → sync → `astro build` → upload/deploy to GitHub Pages, then in parallel a `smoke` job (Playwright smoke tests against the deployed URL) and a `co2` job (`test:co2` regression check against `vars.CO2_BASELINE`), then `notify` (OneSignal push for new posts + commits `.notified.json` back to the content repo).
- Both workflows use composite actions `.github/actions/bootstrap` (Node 24 + `npm ci`) and `.github/actions/checkout-content` (clones the content repo into `.content` using `CONTENT_REPO_TOKEN`).
- Since this repo deploys on a weekly *schedule* rather than on push to `main`, pushing a merge to `main` does not by itself publish new content — either wait for the schedule or trigger `main.yml` manually (`workflow_dispatch`).
