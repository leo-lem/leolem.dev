import { defineCollection, z, getCollection, type CollectionEntry } from "astro:content";

import { byFeaturedThenTitle } from "../lib";

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

export async function getOffering(): Promise<CollectionEntry<"offering">[]> {
  return (await getCollection("offering"))
    .sort(byFeaturedThenTitle);
}