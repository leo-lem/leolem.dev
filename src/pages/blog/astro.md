---
title: Building my website with Astro
description: A journey through creating my personal website using Astro
date: 2025-07-16
tags: ["Astro", "Web Development", "Personal Website"]
layout: ../../layout/BlogLayout.astro
---

Building this website was one of the first steps I took toward building my professional presence online. I had a few goals in mind: I wanted something fast, clean, easy to maintain, and flexible enough to grow into a portfolio, blog, and maybe even more. After some research, I landed on [Astro](https://astro.build) — and it turned out to be a great decision.

## Why Astro?

I was drawn to Astro for a few reasons:
- It's optimized for content-heavy sites (like blogs and portfolios)
- It delivers zero-JS by default, making performance a non-issue
- It supports Markdown, MDX, and a variety of frontend frameworks
- It fits well with static site generation and GitHub Pages deployment

Plus, the DX (developer experience) is modern and intuitive. The component model is familiar, and TailwindCSS integrated seamlessly.

## Development Setup

I bootstrapped the project using the Astro CLI, added TailwindCSS for styling, and configured a GitHub Actions workflow to deploy to GitHub Pages. The site lives in a devcontainer, which allows me to reproduce the environment easily across machines — especially helpful when switching contexts.

Here’s a high-level view of the stack:
- **Astro** for site generation
- **TailwindCSS** for styling
- **Markdown** for content
- **GitHub Pages** for hosting
- **GitHub Actions** for CI/CD
- **VSCode Dev Containers** for development

## Challenges

No project goes without some bumps. I spent time tuning Tailwind’s color palette to give the site a distinctive visual identity that’s still easy on the eyes — especially in dark mode. I also added metadata handling, routing logic, and content collections for portfolio entries and blog posts.

One of the trickier parts was getting the mobile navigation to behave properly, especially with animations and layout shifts. Eventually I settled on a collapsible layout that feels consistent across screen sizes.

## What I Learned

Astro’s simplicity encouraged me to focus more on structure and content rather than setup and boilerplate. I also deepened my understanding of static site workflows, CI/CD pipelines, and Tailwind theming.

More than anything, this project served as a personal sandbox — a place to test ideas quickly and iterate publicly.

## What's Next

The site is live, but I see it as a living project. Upcoming changes will include:
- A blog (which you're reading now!)
- More detailed project pages.
- Search!
- Integration with analytics or a headless CMS

Stay tuned — and if you’re curious about anything in particular, feel free to [reach out](/services#schedule-a-call)!