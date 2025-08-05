---
title: Why I Use Devcontainers
short: Isolated, reproducible, and clean environments for modern development
date: 2025-07-30
tags: ["Devcontainers", "VS Code", "Productivity"]
---

When I first started experimenting with Devcontainers a couple of years ago, it was mostly to avoid polluting my local machine with LaTeX dependencies for university assignments. That small pain point quickly became a broader realization: I want all my projects to be self-contained and reproducible—across machines, across time.


## A Modern Development Backbone

Fast forward to today, I use Devcontainers almost daily. Most of my heavier work lives inside [custom Ubuntu-based containers](/projects#sid), tailored for cloud-native development. That includes Docker-in-Docker, Minikube, OpenTofu, Terragrunt, gcloud CLI, Postgres, InfluxDB, and a host of other utilities that would be a nightmare to manage manually. These containers are not just for convenience—they form the backbone of the infrastructure development for [SID](/projects#sid) and [Astro](/projects#astro), two projects that demand a clean and consistent environment for testing and deployment.


## Key Benefits

The benefits are obvious:
- Clean separation of concerns
- Reproducible environments for onboarding and CI
- No system pollution or version conflicts
- Quick iteration with pre-installed tooling


## Final Thoughts

If you're tired of setup scripts, broken environments, or "works on my machine" issues, Devcontainers are a no-brainer. You define your development environment once, and it works everywhere VS Code or Codespaces does. No more manual provisioning, no more dependency chaos—just spin up the container and you're ready to go. Whether you're onboarding a new team member, jumping into an old project, or spinning up a cloud-native lab, it's all reproducible, fast, and clean.