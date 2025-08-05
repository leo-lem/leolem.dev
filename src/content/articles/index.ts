import { defineCollection, z } from "astro:content";
import { zTopic } from "../zTypes";

export default defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string().default("Leopold Lemmermann"),
    tags: z.array(zTopic).optional()
  })
});