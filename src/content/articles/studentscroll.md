---
title: StudentScroll?
short: A full-stack social platform for students, developed in a five-person team during my exchange semester in New Zealand
date: 2025-08-01
tags: [Full Stack, Spring Boot, React, University]
---

## A Semester Abroad, A Project Delivered

Back in 2023, during my semester abroad at Auckland University of Technology, I teamed up with four other students to build a full-stack social platform for students. We called it **StudentScroll**.

The project was part of a practical software engineering course and challenged us to develop a real product with realistic requirements. It pushed us into full-stack development, agile collaboration, and hands-on team coordination. I took on the role of **technical lead**, but we all cycled through roles like **Scrum Master** and **Product Owner** to practise agile methodology in action.

## What We Built

StudentScroll is a social web app that allows students to connect, post, chat, follow each other, and interact in a dedicated environment. It was built as a full-stack web app consisting of:

### 🧩 The Backend — [StudentScrollAPI](https://github.com/leo-lem/StudentScrollAPI)

A RESTful API built with **Spring Boot** and Java 17. Key features:

- **JWT-based authentication**
- User registration, login, profile management
- Create, like, and comment on posts
- Follow/unfollow other users
- Chat system for real-time message exchange
- PostgreSQL with JPA/Hibernate for persistence
- Swagger UI for interactive API documentation

The full API structure can be explored via the documented endpoints at `/swagger-ui/index.html`.

### 🎨 The Frontend — [StudentScrollApp](https://github.com/leo-lem/StudentScrollApp)

A single-page application using **React** (with Vite and TypeScript). Key components:

- Auth views (login/signup) with form validation
- Post feed with interactive likes and comments
- User profile pages, follow management, and settings
- Chat UI with live message updates via polling
- REST API integration using centralized API abstraction (`lib/api.ts`)
- Client-side routing with React Router

The frontend is responsive, cleanly structured, and focused on a usable student-first experience.

## My Role

As **technical lead**, I focused on system design and integration across the stack. I led backend domain modeling and API design, helped define the REST contract, and coordinated frontend integration.

Alongside that, I contributed heavily to the React client and deployment setup. We practiced agile workflows with daily standups, sprint planning, retrospectives, and role rotations.

## What I Took From It

The experience taught me a lot — not just about Java or React, but about collaborative delivery. I learned how to split up work, define interfaces, iterate under academic deadlines, and keep team quality high across many moving parts.

More than anything, StudentScroll pushed me from solo building into real team engineering — and it made me want to do more of it.