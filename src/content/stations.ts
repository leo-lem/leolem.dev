import { defineCollection, z, getCollection } from "astro:content";

export default defineCollection({
  schema: z.object({
    title: z.string(),
    place: z.string(),
    date: z.date(),
    duration: z.string()
  })
});

export async function getStations() {
  return (await getCollection("stations"))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}