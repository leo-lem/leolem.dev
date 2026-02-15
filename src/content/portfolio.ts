import { defineCollection, z, getCollection } from 'astro:content';

export default defineCollection({
  schema: z.object({
    featured: z.boolean().default(false),
    title: z.string(),
    short: z.string(),
    tags: z.array(z.string()),
    articles: z.array(z.string()).default([]),
    links: z.array(z.object({
      type: z.enum(['github', 'appstore', 'webpage', 'document']),
      url: z.string().url()
    })).default([])
  })
});

export async function getPortfolio() {
  return (await getCollection("portfolio")).sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return a.data.title.localeCompare(b.data.title, undefined, { sensitivity: "base" });
  });
}

export async function getFeaturedPortfolio() {
  return (await getPortfolio()).filter(({ data: { featured } }) => featured === true);
}