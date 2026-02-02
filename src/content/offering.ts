import { defineCollection, z } from "astro:content";

export default defineCollection({
  schema: z.object({
    featured: z.boolean().default(false),
    title: z.string(),
    short: z.string(),
    icon: z.string(),
    tags: z.array(z.string()),
    cta: z.array(z.object({
      type: z.enum(['fiverr', 'upwork', 'email']),
      url: z.string().url()
    })).default([])
  })
});