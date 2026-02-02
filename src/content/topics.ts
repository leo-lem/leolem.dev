import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

export default defineCollection({
  loader: file("src/content/topics.json"),
  schema: z.object({
    isPriority: z.boolean().default(false),
    id: z.string(),
    icon: z.string().optional(),
    category: z.enum(["Product", "Systems", "Engineering"]),
    confidence: z.number().min(0).max(100).optional()
  })
});