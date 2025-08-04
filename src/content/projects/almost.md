---
title: Almost?
tags: [iOS, Swift, SwiftUI, Firebase, "App Store"]
links:
  - type: github
    url: "https://github.com/leo-lem/almost"
  - type: appstore
    url: "https://apps.apple.com/de/app/keepinon/id6742201361?l=en-GB"
  - type: webpage
    url: "https://almost.leolem.dev"
articles:
  - almost
---

## Brief

- **Goal:** Help users reflect on failures and emotional patterns through a lightweight, structured journaling experience.
- **Stack:** Swift, SwiftUI, Firebase (Auth, Firestore, Remote Config, Analytics), GitHub Actions
- **Challenges:** Managing Firebase integration with previews and maintaining a responsive UI using feature flags, haptics, and live filters.
- **✅ Outcome:** Live on the App Store with a supporting marketing page, serving as a Firebase showcase app.

## Details

Almost? is a reflective iOS journaling app built around the idea of learning from near-misses — those moments when you almost did the right thing. It’s designed to help users log small failures, reflect constructively, and identify emotional patterns over time.

The app was originally developed as a CloudKit-based portfolio project under the name *KeepinOn*, with iterations dating back to 2021. After multiple rewrites, a minimal local version was published to the App Store in early 2025. The current version is a Firebase-powered rewrite that emphasizes simplicity, reliability, and clean UX.

### My Contributions

1. Designed and implemented the iOS app using SwiftUI and modern Apple architecture practices.
2. Integrated Firebase services for authentication, Firestore sync, analytics, and remote config.
3. Built an adaptive user interface with dark mode, haptics, and feature flags.
4. Created a lightweight settings interface and real-time data filters.
5. Designed and deployed a responsive marketing site with GitHub Actions CI/CD.
6. Shipped the app to TestFlight and the App Store, including branding, screenshots, and legal policies.