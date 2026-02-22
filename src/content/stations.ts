import { defineCollection, z, getCollection, type CollectionEntry } from "astro:content";

import { byDateDesc } from "../lib";

export default defineCollection({
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