---
title: Smokes
short: "Smokes is a privacy-conscious iOS habit tracker I built and released in 2023. It helps users track their smoking habits with visual feedback and structured habit tracking"
tags: ["iOS", "Swift Vapor", "SwiftUI", "Swift", "App Store", "Vercel"]
links:
  - type: appstore
    url: "https://apps.apple.com/de/app/smokes/id6446227741?l=en-GB"
  - type: github
    url: "https://github.com/leo-lem/smokes"
  - type: webpage
    url: "https://smokes.leolem.dev"
articles: [smokes, vercel]
---

## Brief

- **Goal:** Support users in reducing smoking habits through visual feedback and structured habit tracking.
- **Stack:** Swift, SwiftUI, Composable Architecture, local storage, Vercel-hosted API
- **Challenges:** Rebuilding the app architecture and deciding against a custom backend due to cost. Built a working Swift Vapor prototype, later replaced by a simpler local-first approach.
- **✅ Outcome:** Active App Store presence with an in-app facts API; still maintained, though no longer a personal priority.

## Details

Smokes is an iOS application designed to help users track their smoking habits by visualizing statistics and providing insights for behavioral improvement. The app offers a user-friendly interface, detailed analytics, and customization options to support users in monitoring and reducing their smoking habits.

Originally prototyped in UIKit and rebuilt in SwiftUI, the app underwent multiple architectural overhauls before its release to the App Store in 2023. A major iteration introduced a foundation based on the Composable Architecture, providing a more scalable and testable structure. A Swift Vapor backend was also explored to serve educational content, though ultimately discontinued due to cost.

### My Contributions

1. Designed and developed the app using Swift and SwiftUI, ensuring a seamless, intuitive user experience.
2. Re-architected the app using Point-Free's [Composable Architecture](https://pointfree.co/collections/composable-architecture).
3. Implemented key features such as habit tracking, data visualization, and insights.
4. Built out a custom Swift Vapor backend prototype to deliver contextual facts.
5. Utilized CI/CD pipelines and Amazon Web Services (AWS) for efficient deployment and scalability.
6. Managed the app's release on the App Store, including licensing and compliance challenges.