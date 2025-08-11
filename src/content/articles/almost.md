---
title: Almost? From Portfolio to Product
short: A retrospective on building and rebuilding one of my first iOS apps
date: 2025-07-27
tags: [iOS, Firebase, SwiftUI, Personal Project]
---

*Almost?* has a surprisingly long history for such a minimal app.

## Origins: A Swift Showcase

Back in 2021 or 2022, I started a side project called *KeepinOn*. It began as a portfolio app, loosely inspired by Paul Hudson’s *Hacking with Swift* curriculum. The goal was to build something that could showcase my proficiency with Apple technologies, SwiftUI, CoreData, CloudKit, and eventually even social features and cross-platform support (everything but tvOS and, of course, visionOS, which didn't exist yet). I had a full feature set built out, but I stopped short of releasing it. Life got in the way.

## Attempt #2: The False Restart

A few years later, I tried to pick it up again. But a lot had changed, SwiftUI had moved on, some of the third-party integrations were broken or deprecated, and it just felt out of reach. I attempted a rewrite from scratch, but again, the effort ballooned. I put it down once more.

## Attempt #3: Minimal and Published

Earlier this year, I returned to it again, but this time with a different goal: publish something small. I built a minimal version with only local storage and a basic tracker UI. I experimented with *pointfreeco* libraries, like `SharingGRDB` and `StructuredQuery`, but quickly found myself in a familiar trap: overengineering.

As usual, the fun parts of building — architectural decisions, abstraction layers — started to take over. And once again, it became hard to ship. But I pushed through. I stripped away everything unnecessary, published the app to the App Store, and called it done. *Almost?* (previously *KeepinOn*) was born.

## From Utility to Reflection

But the app still felt like a stub. A featureless to-do tracker with no real value proposition. I realized that what I was really interested in wasn't productivity tracking, it was **reflection**. Not what I *did*, but what I *almost did* — and what I could learn from it.

The result was a conceptual pivot. I redesigned the app around the idea of learning from failure and hesitation. I added mood tagging, favorites, emotional journaling. The app became personal.

## A Firebase-Powered Rebuild

With a clearer scope in mind, I rebuilt the app from scratch:
- ✅ Real-time sync with Firestore
- ✅ Feature flags with Remote Config
- ✅ Optional Firebase Analytics
- ✅ SwiftUI-based architecture using `@Observable` and dependency injection
- ✅ Haptics, animations, and polish across iOS and iPadOS

I kept things tight and testable. I used GitHub Actions for CI, Firebase CLI for deploying rules and indexes, and a hand-coded landing page with marketing assets and privacy policy.

## What I Learned

- Don’t let architecture overshadow product
- It's fine to ship a small feature set if it's cohesive
- Firebase is a good fit for solo projects, but tradeoffs exist (especially around privacy)
- Product positioning matters — *Almost?* resonates more than *KeepinOn* ever did

## What's Next

Starting mid-August, I’ll kick off a small marketing campaign to get the app into users’ hands. The plan includes:
- A launch-focused landing page and blog content
- Organic reach via GitHub, TestFlight, and indie forums
- Possibly submitting *Almost?* for app award listings or nominations

More importantly, I’ll keep using the app myself. After all, it's built for me too.

---

You can [download *Almost?* on the App Store](https://apps.apple.com/de/app/almost/id6742201361?l=en-GB) or [join the TestFlight beta](https://testflight.apple.com/join/Z8hzF2qr).