import { defineCollection, z } from 'astro:content';
import { zTag } from '../enums';

export default defineCollection({
  schema: z.object({
    title: z.string(),
    links: z.array(z.object({
      type: z.enum(['github', 'appstore', 'webpage', 'document']),
      url: z.string().url()
    })).optional(),
    tags: z.array(zTag),
    images: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    featured: z.boolean().default(false),
  })
});