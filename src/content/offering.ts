import { defineCollection, z, getCollection } from "astro:content";

export default defineCollection({
  schema: z.object({
    featured: z.boolean().default(false),
    title: z.string(),
    short: z.string(),
    icon: z.string(),
    tags: z.array(z.string()),
    cta: z.array(z.object({
      type: z.enum(['fiverr', 'upwork', 'email']),
      url: z.string().url()
    })).default([])
  })
});

export async function getOffering() {
  return (await getCollection("offering")).sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return a.data.title.localeCompare(b.data.title, undefined, { sensitivity: "base" });
  });
}

export async function getFeaturedOffering() {
  return (await getOffering()).filter(({ data: { featured } }) => featured === true);
}