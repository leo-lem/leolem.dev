import { defineCollection, getCollection, z, type CollectionEntry } from "astro:content";
import { file } from "astro/loaders";

import { byPriorityThenConfidence } from "../lib";

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

export async function getTopics(): Promise<CollectionEntry<"topics">[]> {
  return (await getCollection("topics"))
    .sort(byPriorityThenConfidence);
}