import { defineCollection, getCollection, type CollectionEntry } from "astro:content";
import { glob } from 'astro/loaders';
import { z } from "astro/zod";

import { byFeaturedThenTitle } from "../lib";

export default defineCollection({
  loader: glob({ base: "src/content/offering", pattern: "**/*.md" }),
  schema: z.object({
    featured: z.boolean().default(false),
    title: z.string(),
    short: z.string(),
    icon: z.string(),
    tags: z.array(z.string()),
    cta: z.array(z.object({
      type: z.enum(['fiverr', 'upwork', 'email']),
      url: z.url()
    })).default([])
  })
});

export async function getOffering(): Promise<CollectionEntry<"offering">[]> {
  return (await getCollection("offering"))
    .sort(byFeaturedThenTitle);
}