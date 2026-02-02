import { defineCollection, z } from 'astro:content';

export default defineCollection({
  schema: z.object({
    featured: z.boolean().default(false),
    title: z.string(),
    short: z.string(),
    tags: z.array(z.string()),
    articles: z.array(z.string()).default([]),
    links: z.array(z.object({
      type: z.enum(['github', 'appstore', 'webpage', 'document']),
      url: z.string().url()
    })).default([])
  })
});