import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    links: z.array(z.object({
      type: z.enum(['github', 'appstore', 'webpage', 'document']),
      url: z.string().url()
    })).optional(),
    featured: z.boolean().default(false), // true for featured projects
    thumbnail: z.string().optional(),
    images: z.array(z.string()).optional(),
  })
});

const stations = defineCollection({
  schema: z.object({
    title: z.string(),                                     // e.g. "Frontend Developer at XYZ"
    subtitle: z.string(),                                 // e.g. "Building modern web applications"
    date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/),  // ISO date format, e.g. "2023-01-01" or "2023"
    duration: z.string(),                                 // e.g. "6 months" or "1 year"
  }),
});

const skills = defineCollection({
  schema: z.object({
    name: z.string(),                       // e.g. "React"
    category: z.string(),                   // e.g. "Languages & Frameworks"    
    icon: z.string(),                       // e.g. "react.svg"
    confidence: z.number().min(0).max(100), // percentage confidence in skill level
    isPriority: z.boolean().default(false)     // true for priority skills
  }),
});

const highlights = defineCollection({
  schema: z.object({
    title: z.string(),                     // e.g. "Top 10% in JavaScript on Codewars"
    emoji: z.string(),                     // e.g. "🏆"
  }),
});

const services = defineCollection({
  schema: z.object({
    title: z.string(),                     // e.g. "CI/CD Pipeline Setup"
    short: z.string(),                     // short description for cards
    tags: z.array(z.string()),             // e.g. ["devops", "ci/cd"]
    image: z.string().optional(),          // local path or static image
    ctaLabel: z.string().optional(),       // e.g. "View on Fiverr"
    ctaUrl: z.string().url().optional(),   // external link
  })
});

export const collections = { projects, stations, skills, highlights, services };