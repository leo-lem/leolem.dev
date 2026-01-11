import { defineCollection, z } from "astro:content";

export default defineCollection({
  schema: z.object({
    title: z.string(),
    place: z.string(),
    date: z.date(),
    duration: z.string()
  })
});