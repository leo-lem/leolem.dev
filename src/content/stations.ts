import { defineCollection, getCollection, type CollectionEntry } from "astro:content";
import { glob } from 'astro/loaders';
import { z } from "astro/zod";

import { byDateDesc } from "../lib";

export default defineCollection({
  loader: glob({ base: "src/content/stations", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    place: z.string(),
    date: z.date(),
    duration: z.string()
  })
});

export async function getStations(): Promise<CollectionEntry<"stations">[]> {
  return (await getCollection("stations"))
    .sort(byDateDesc);
}