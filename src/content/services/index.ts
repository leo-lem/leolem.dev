import { defineCollection, z } from "astro:content";
import { zIcon, zTopic } from "../zTypes";

export default defineCollection({
  schema: z.object({
    title: z.string(),
    short: z.string(),
    tags: z.array(zTopic),
    icon: zIcon.optional(),
    cta: z.object({
      text: z.string(),
      url: z.string().url(),
    }).optional()
  })
});