import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { zTopic } from "./zTypes";

export default defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/pages/blog/" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string().default("Leopold Lemmermann"),
    tags: z.array(zTopic).optional()
  })
});