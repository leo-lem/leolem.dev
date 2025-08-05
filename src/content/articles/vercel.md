---
title: Why We Replaced Our Swift Backend with Vercel
short: Smokes used to use a Swift backend hosted on AWS. Here’s why we replaced it with Vercel
date: 2025-07-31
tags: [Vercel, Deployment, Backend, iOS]
---

Smokes is a privacy-conscious iOS habit tracker I built and released in 2023. One of its features is a little motivator: random facts about the effects of smoking, fetched from a backend. Initially, this backend was implemented using [Vapor](https://vapor.codes/), a Swift server-side framework, and hosted on AWS.

While this worked fine technically, it was also overkill. The backend only had a single route to fetch a fact — no auth, no database, just a tiny JSON source. Managing the deployment, TLS, availability, and updates through AWS quickly became a time sink.

## Why Vercel?

I decided to replace the AWS-based setup with a simple [Vercel](https://vercel.com/) function. One route, deployed from a JSON source, at near-zero cost. It integrates nicely into the repo and deploys automatically with every push.

### Benefits:
- No more server provisioning or certificates
- Zero-cost tier for this simple use case
- Easy preview deployments
- Global edge performance
- CI and updates tied to Git

The full backend is now [open-source on GitHub](https://github.com/leo-lem/Smokes/tree/main/facts/api).

## Conclusion

Vercel isn’t always the right tool — but for small, stateless endpoints like this, it’s a no-brainer. I spend less time thinking about infrastructure and more time shipping actual features in the app.
