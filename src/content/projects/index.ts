import { defineCollection, z } from 'astro:content';

export default defineCollection({
  schema: z.object({
    title: z.string(),
    links: z.array(z.object({
      type: z.enum(['github', 'appstore', 'webpage', 'document']),
      url: z.string().url()
    })).optional(),
    posts: z.array(z.string()).optional(),
    tags: z.array(z.string()),
    images: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    featured: z.boolean().default(false),
  })
});