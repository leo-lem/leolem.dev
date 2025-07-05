import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    featured: z.boolean().optional(),
    thumbnail: z.string().optional()
  }),
});

const stations = defineCollection({
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.string(), // YYYY-MM or YYYY-MM-DD
    duration: z.string(),
  }),
});

const skills = defineCollection({
  schema: z.object({
    name: z.string(),
    category: z.string(),
    icon: z.string(),
    confidence: z.number().min(0).max(100),
  }),
});

const highlights = defineCollection({
  schema: z.object({
    title: z.string(),
    icon: z.string(),
  }),
});

export const collections = { projects, stations, skills, highlights };