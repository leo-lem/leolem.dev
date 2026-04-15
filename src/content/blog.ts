import { defineCollection, getCollection, type CollectionEntry } from "astro:content";
import { glob } from 'astro/loaders';
import { z } from "astro/zod";
import { byFeaturedThenDateDesc, onlyPublished } from "../lib/sort";

export default defineCollection({
  loader: glob({ base: "src/content/blog", pattern: "**/*.md" }),
  schema: z.object({
    featured: z.boolean().default(false),
    title: z.string(),
    short: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    projects: z.array(z.string()).default([]),
    author: z.object({
      name: z.string(),
      url: z.url().optional()
    }).optional()
  })
});

export async function getBlog(): Promise<CollectionEntry<"blog">[]> {
  return (await getCollection("blog"))
    .filter(onlyPublished)
    .sort(byFeaturedThenDateDesc);
}