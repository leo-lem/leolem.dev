import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    featured: z.boolean().optional(),
    thumbnail: z.string().optional()
  }),
});

export const collections = { projects };