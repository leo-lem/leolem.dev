import { defineCollection, z } from "astro:content";

export default defineCollection({
  schema: z.object({
    featured: z.boolean().default(false),
    title: z.string(),
    short: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    author: z.string().default("Leopold Lemmermann")
  })
});