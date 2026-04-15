import { defineCollection, getCollection, type CollectionEntry } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from "astro/zod";

import { byFeaturedThenTitle } from '../lib';

export default defineCollection({
  loader: glob({ base: "src/content/portfolio", pattern: "**/*.md" }),
  schema: z.object({
    featured: z.boolean().default(false),
    title: z.string(),
    short: z.string(),
    tags: z.array(z.string()),
    links: z.array(z.object({
      type: z.enum(['github', 'appstore', 'webpage', 'document']),
      url: z.url()
    })).default([])
  })
});

export async function getPortfolio(): Promise<CollectionEntry<"portfolio">[]> {
  return (await getCollection("portfolio"))
    .sort(byFeaturedThenTitle);
}