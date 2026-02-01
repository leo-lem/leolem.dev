import { defineCollection, z } from "astro:content";

export default defineCollection({
  schema: z.object({
    title: z.string(),
    short: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    author: z.string().default("Leopold Lemmermann")
  })
});