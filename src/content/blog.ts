import { defineCollection, z, getCollection } from "astro:content";

export default defineCollection({
  schema: z.object({
    featured: z.boolean().default(false),
    title: z.string(),
    short: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    author: z.object({
      name: z.string(),
      url: z.string().url().optional()
    }).optional()
  })
});

export async function getBlog() {
  return (await getCollection("blog"))
  .filter(({ data: { date } }) => import.meta.env.DEV || date <= new Date())
  .sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}

export async function getFeaturedBlog() {
  return (await getBlog()).filter(({ data: { featured } }) => featured === true)[0];
}