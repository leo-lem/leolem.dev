import { defineCollection, z } from 'astro:content';
import { zTopic } from './zTypes';

export default defineCollection({
  schema: z.object({
    title: z.string(),
    short: z.string(),
    articles: z.array(z.string()).default([]),
    tags: z.array(zTopic).default([]),
    links: z.array(z.object({
      type: z.enum(['github', 'appstore', 'webpage', 'document']),
      url: z.string().url()
    })).default([])
  })
});