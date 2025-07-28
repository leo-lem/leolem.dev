import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { zTopic } from "./zTypes";

export default defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/pages/blog/" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default("Leopold Lemmermann"),
    date: z.date(),
    tags: z.array(zTopic).optional(),
    draft: z.boolean().default(false),
    cover: z.string().optional()
  })
});