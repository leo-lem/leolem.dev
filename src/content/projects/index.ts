import { defineCollection, z } from 'astro:content';
import { zTopic } from '../zTypes';

export default defineCollection({
  schema: z.object({
    title: z.string(),
    links: z.array(z.object({
      type: z.enum(['github', 'appstore', 'webpage', 'document']),
      url: z.string().url()
    })).optional(),
    articles: z.array(z.string()).optional(),
    tags: z.array(zTopic).optional(),
    images: z.array(z.string()).optional(),
    thumbnail: z.string().optional()
  })
});