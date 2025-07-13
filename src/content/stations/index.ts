import { defineCollection, z } from "astro:content";

export default defineCollection({
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.string().transform(str => new Date(str)),
    duration: z.string()
  })
});