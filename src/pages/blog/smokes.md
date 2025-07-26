---
title: Building Smokes - From MVP to the App Store
description: How a small smoking tracker app turned into a published SwiftUI project, and what I learned from it.
date: 2025-07-20
tags: ["iOS", "SwiftUI", "MVP", "App Store", "Personal Project"]
layout: ../../layout/BlogLayout.astro
---

Smokes is a simple smoking tracker app. But behind its simplicity lies a long journey that started back in 2021. This article walks through the evolution of the app, what I learned, and how I finally got it onto the App Store.

## A Need, and an MVP

Back in 2021, I had an Android phone and used a minimal app called “Ashtray” to track when I smoked. When I later switched to iOS, I couldn’t find anything that matched the same simplicity. So I started building my own.

The first prototype used UIKit and was... rough. But it worked. I never thought of it as an MVP at the time, but that’s what it was.

## Rebuilding in SwiftUI

Eventually, I rewrote the app using SwiftUI. This gave me more flexibility and cleaner UI, though I still wasn’t thinking of public release. It was a personal tool — but one I now had on both my iPhone and my Mac.

## Publishing Challenges

While on exchange in Auckland in 2023, I decided to clean up the app and finally publish it. That took more effort than expected.

Apple’s App Review flagged the app due to its connection with smoking. It took several resubmissions and reframing the app as a quitting aid to finally get accepted. In the end, Smokes went live on the App Store, a small personal victory.

## Going Further: A Vapor Backend

At one point, I explored adding a Vapor backend to serve random facts on the app’s loading screen. This ran on an AWS VM, but I later shut it down. The value just didn’t justify the running cost — some facts are now cached in the app instead.

## Architecture Improvements

In 2024, I spent some time reworking the codebase using [Point-Free’s Composable Architecture](https://www.pointfree.co). This helped clean up state management and made the app more maintainable. You can find the full source code on [GitHub](https://github.com/leo-lem/Smokes).

## Where Things Stand

The app is still available on the [App Store](https://apps.apple.com/de/app/smokes/id6446227741?l=en-GB), and I’ve recently updated the [marketing page](https://smokes.leolem.dev) to better reflect the app — it now includes screenshots and a proper layout, though still staying lightweight.

## Lessons Learned

- MVPs can take you far, even if they don’t start with that name.
- Publishing is its own challenge, especially with sensitive topics.
- A small app can be a great playground for trying out patterns like TCA or hosting backends.
- Sometimes you just need to finish something and ship it.

---
Want to see the code? [Check out the repo.](https://github.com/leo-lem/Smokes)
