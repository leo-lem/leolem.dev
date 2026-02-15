import { defineCollection, getCollection, z } from "astro:content";
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

export async function getTopics() {
  return (await getCollection("topics")).sort((a, b) => {
    if (a.data.isPriority && !b.data.isPriority) return -1;
    if (!a.data.isPriority && b.data.isPriority) return 1;
    return (b.data.confidence ?? 0) - (a.data.confidence ?? 0);
  });
}

export async function getTopicCategories() {
  return [...new Set((await getTopics()).map((s) => s.data.category))];
}