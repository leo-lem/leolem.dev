import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    links: z.array(z.object({
      type: z.enum(['github', 'appstore', 'webpage', 'document']),
      url: z.string().url()
    })).optional(),
    featured: z.boolean().optional(),
    thumbnail: z.string().optional(),
    images: z.array(z.string()).optional(),
  }),
});

const stations = defineCollection({
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/),
    duration: z.string(),
  }),
});

const skills = defineCollection({
  schema: z.object({
    name: z.string(),
    category: z.string(),
    icon: z.string(),
    confidence: z.number().min(0).max(100),
  }),
});

const highlights = defineCollection({
  schema: z.object({
    title: z.string(),
    icon: z.string(),
  }),
});

export const collections = { projects, stations, skills, highlights };