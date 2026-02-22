import { defineCollection, z, getCollection, type CollectionEntry } from 'astro:content';

import { byFeaturedThenTitle } from '../lib';

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

export async function getPortfolio(): Promise<CollectionEntry<'portfolio'>[]> {
  return (await getCollection("portfolio"))
    .sort(byFeaturedThenTitle);
}