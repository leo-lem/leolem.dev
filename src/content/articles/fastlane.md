---
title: Why I Ditched Fastlane for Screenshot Automation
short: When convenience tools become inconvenient
date: 2025-10-02
tags: [iOS, CI/CD]
---

I spent the better part of an afternoon trying to set up Fastlane for automated screenshot generation in my Anagrams app. It seemed like the obvious choice for a solo developer who wanted to streamline App Store submissions. But after wrestling with Ruby dependencies, UI test configurations, and Swift concurrency errors, I realized I was solving the wrong problem.

## Why Fastlane Seemed Like a Good Idea

The promise was compelling: run one command and get perfectly formatted screenshots for all device sizes, ready for App Store Connect. Since I'm already using Xcode Cloud for builds and deployments, I thought Fastlane could handle the one piece of the puzzle that Apple doesn't automate well.

The setup looked straightforward. Install Fastlane, configure a few files, write some UI tests that call `snapshot()` at the right moments, and boom automated screenshots. What could go wrong?

## The Setup Tax

Getting Fastlane working wasn't particularly difficult, but it came with overhead I hadn't anticipated. Ruby gems, Bundler configuration, UI test targets, scheme setup. The technical pieces were straightforward enough, just a matter of following the documentation and fixing a few Swift concurrency annotations.

But as I was setting up the UI tests and configuring device lists, I started questioning what problem I was actually solving.

## The Moment of Clarity

I already have Xcode Cloud handling builds, testing, and deployments. The only gap was screenshots, but Fastlane's automated screenshots are just raw simulator captures with clean status bars. They're not the styled, branded marketing screenshots you see in most App Store listings.

For actual marketing screenshots, I'd still need to:
- Design layouts and backgrounds
- Add marketing text and call to action overlays
- Choose representative app states that tell a story
- Manually curate the best shots

Fastlane could generate dozens of sterile simulator screenshots, but I only needed a handful of compelling ones. The automation was optimizing for the wrong metric.

## What I'm Doing Instead

I deleted everything Fastlane related. The Ruby gems, the configuration files, the UI tests, the GitHub Actions workflow. All of it.

Now when I need new screenshots, I:
1. Open the simulator in the sizes I care about (usually just iPhone and iPad Pro)
2. Navigate to the interesting parts of my app
3. Take screenshots manually using Cmd+S
4. Import them into whatever design tool I'm using for final polish

This takes maybe 10 minutes total, and I only need to do it when I have significant UI changes. The manual approach also forces me to think about what story I'm telling with each screenshot.

## The Lesson

Fastlane solves real problems for teams shipping multiple apps or needing complex release workflows. But I already have Xcode Cloud for CI/CD, and raw simulator screenshots don't help with marketing materials. The automation would have optimized for quantity over quality.

The setup tax wasn't worth paying for a tool that wouldn't address my actual needs. Sometimes recognizing what you don't need is as valuable as finding what you do.

Tools should solve real problems, not create new ones. Sometimes the simple solution is the right solution.