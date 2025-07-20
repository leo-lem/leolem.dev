import { defineCollection, z } from "astro:content";
import zIcon from "../zIcon";
import { file } from "astro/loaders";

export default defineCollection({
  loader: file("src/content/topics/topics.json"),
  schema: z.object({
    id: z.string(),
    icon: zIcon.optional(),
    category: z.enum([
      "Cloud & DevOps",
      "Languages & Frameworks",
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