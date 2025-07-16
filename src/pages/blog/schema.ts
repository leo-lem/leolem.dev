import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { zTag } from "../../content/enums";


export default defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/pages/blog/" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(zTag).optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  })
});