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

export const collections = { projects, stations };