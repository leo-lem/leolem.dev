import { defineCollection, z } from "astro:content";
import { zIcon, zTag } from "../enums";

export default defineCollection({
  schema: z.object({
    title: z.string(),
    short: z.string(),
    tags: z.array(zTag),
    icon: zIcon.optional(),
    image: z.string().optional(),
    cta: z.object({
      text: z.string(),
      url: z.string().url(),
    }).optional(),
    featured: z.boolean().default(false),
  })
});