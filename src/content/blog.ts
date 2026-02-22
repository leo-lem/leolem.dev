import { defineCollection, z, getCollection, type CollectionEntry } from "astro:content";
import { byFeaturedThenDateDesc, onlyPublished } from "../lib/sort";

export default defineCollection({
  schema: z.object({
    featured: z.boolean().default(false),
    title: z.string(),
    short: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    author: z.object({
      name: z.string(),
      url: z.string().url().optional()
    }).optional()
  })
});

export async function getBlog(): Promise<CollectionEntry<"blog">[]> {
  return (await getCollection("blog"))
    .filter(onlyPublished)
    .sort(byFeaturedThenDateDesc);
}