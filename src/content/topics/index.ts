import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";
import { zIcon, zTopic } from "../zTypes";

export default defineCollection({
  loader: file("src/content/topics/topics.json"),
  schema: z.object({
    id: zTopic,
    icon: zIcon.optional(),
    category: z.enum([
      "Cloud & DevOps",
      "AI & Data",
      "Mobile Apps",
      "Web Development",
      "Community",
      "Research"
    ]),
    confidence: z.number().min(0).max(100).optional(),
    isPriority: z.boolean().default(false).optional()
  }),
});