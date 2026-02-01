---
title: Building leolem.dev
short: My personal website and writing space, built as a fast, static Astro project to showcase work, document projects, and support regular blogging.
tags: [Astro, Product, Systems]
articles: [astro, devcontainers]
links:
  - type: github
    url: "https://github.com/leo-lem/leolem.dev"
  - type: webpage
    url: "https://leolem.dev"
---

## Goal
Create a simple, fast personal website that serves as both a portfolio and a writing space, with an emphasis on clarity, low maintenance, and a workflow that supports regular publishing.

## Stack
The site is built with Astro and TailwindCSS, deployed via GitHub Pages with GitHub Actions handling CI/CD. Content is written in Markdown and organised using Astro Content Collections, with a lightweight asset pipeline for images and thumbnails.

The setup prioritises static rendering, minimal dependencies, and predictable builds.

## Key Decisions
Rather than using a traditional CMS, the site relies on a Git-based content workflow, later split into a separate content repository to reduce friction when publishing blog posts and updating projects. Stable content lives in the main codebase, while frequently changing content is synced during deployment.

I deliberately avoided complex frontend frameworks in favour of Astro’s component model and static output, keeping the site easy to reason about and inexpensive to host.

Over time, the structure evolved to support weekly blogging, RSS feeds, content tagging, and consistent visual defaults for posts and projects.

## Outcome
The site is live and actively maintained, serving as the central hub for my work, writing, and ongoing projects. It supports regular publishing, lightweight experimentation, and provides a stable public presence without the overhead of a full CMS.

### Further Details

leolem.dev is designed as a quiet, practical home on the web. It brings together blog posts, project write-ups, and service descriptions in a single static site, optimised for performance and readability across devices.

Beyond the visible UI, much of the work went into building a sustainable content workflow: automated deployments, a clean separation between code and content, and tooling that makes writing and iteration feel lightweight rather than ceremonial. The project continues to evolve alongside my work, acting both as a portfolio and as a long-running personal system.