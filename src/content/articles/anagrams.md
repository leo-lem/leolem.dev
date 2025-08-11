---
title: ngrms - Simplifying Anagrams with SwiftData and CloudKit
short: A journey from complexity to simplicity in building a collaborative anagrams game
date: 2025-08-12
tags: [Swift, SwiftData, CloudKit, iOS]
---

## Origins

The ngrms project started as an exploration into word play and pattern recognition, initially named "ngrams" to hint at the linguistic concept of n-grams. However, the name quickly felt misleading since the app's core focus was on anagrams rather than statistical language models. To better reflect its purpose and avoid confusion, it was renamed to "ngrms," a subtle nod to anagrams without the baggage of n-gram associations.

## Simplifying the Architecture

Early on, ngrms was built using The Composable Architecture (TCA) to manage state and side effects. While TCA offers powerful tools for building predictable apps, it proved too complex for this project’s needs. Moreover, integrating TCA with SwiftData and CloudKit was cumbersome and inefficient. After some experimentation, the decision was made to remove TCA entirely and adopt a simpler architecture that better aligned with SwiftData’s native capabilities and CloudKit's syncing features. This shift significantly reduced complexity and improved maintainability.

## Adding Persistence and Cloud

One pleasant surprise was how straightforward it was to add persistence using SwiftData and enable cloud synchronization with CloudKit. Despite initial concerns about integrating these technologies, the process was smoother than expected. SwiftData’s declarative approach to data modeling and CloudKit’s seamless syncing capabilities allowed ngrms to maintain user data effortlessly across devices, enhancing the app’s usability and reliability.

## UX Improvements

The user experience has improved substantially over the course of development. The interface is cleaner and more intuitive, making it easier for players to engage with the game. However, the game still requires further refinement to fully realize its potential. Additional iterations will focus on polishing gameplay mechanics, enhancing feedback, and introducing new features to keep the experience fresh and engaging.

## Branding and Web Presence

Alongside the app itself, a website was created to showcase ngrms. The site’s design follows a similar style to those of Smokes and Almost, two previous projects. This consistent aesthetic helps establish a recognizable brand identity. If more apps are developed in the future, this website layout may be turned into a reusable template to streamline the launch of additional projects.

## Release Challenges

The release process encountered unexpected hurdles when using an Xcode beta version. The beta introduced blocking issues that prevented a timely submission to the App Store. As a result, it was necessary to roll back to a stable version of Xcode to complete the release. This experience reinforced the importance of using production-ready tools when preparing for launch.

## What's Next

Looking ahead, the focus will be on further refining the gameplay and expanding the feature set. Continued improvements to the UX and exploring new ways to engage users are top priorities. Additionally, there is interest in leveraging the existing web template for future projects, potentially creating a small ecosystem of apps with shared branding and infrastructure. The journey of ngrms is just beginning, and there are many exciting developments on the horizon.