import { defineCollection, z } from "astro:content";

export default defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedOn: z.string().transform(str => new Date(str)),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  })
});