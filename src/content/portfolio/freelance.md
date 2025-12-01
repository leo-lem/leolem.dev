---
title: Pet Care MVP
short: A compact web-based MVP built with Firebase and Next.js, focused on simple pet management, document storage, and shareable emergency info.
tags: [Freelancing, Firebase, Next.js, Web Development]
articles: [freelance]
---

## Brief

- **Goal:** Build the foundation of a lightweight pet-management MVP with document uploads, a public emergency profile, and simple sharing flows.
- **Stack:** Firebase (Auth, Firestore, Storage, Cloud Functions), Next.js, TypeScript, Figma
- **Challenges:** Adapting to shifting scopes while keeping the data model clean, refining the UX across multiple iterations, and balancing core features against feasibility.
- **🟦 Outcome:** A well-scoped technical foundation and revised architecture ready for implementation before the project direction changed.

## Details

Over a few weeks I worked on a small web-based MVP focused on pet information management. The concept evolved several times which meant the technical plan had to stay flexible. Firebase and Next.js made that easier by letting us iterate quickly without heavy backend work.

The first version was built around a simple structure: one user, one pet, basic details, and document uploads stored in Firebase Storage. A public emergency profile could be opened through a link, supported by Firestore rules and a small set of Cloud Functions.

As the idea matured we added task handling, ICS export, and a minimal family-sharing flow based on invite links. At the same time the design went through several rounds in Figma. Once we looked at existing services we decided to narrow the scope toward a lean owner focused tool, which led to a trimmed backend model and the removal of some early features.

Before development of the final scope began the project was discontinued and we prepared to explore a new idea instead.

### My Contributions

1. Set up the Firebase backend with Auth, Firestore, Storage, and Cloud Functions.
2. Designed and implemented the basic Next.js frontend structure with TypeScript.
3. Developed flows for document uploads, public profile access, and invite based sharing.
4. Iterated across several Figma design rounds and helped refine the scoped feature set.
5. Produced a revised architecture and contract for the simplified MVP before the pivot.