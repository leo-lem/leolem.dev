import { defineCollection, z } from "astro:content";
import { zIcon } from "../enums";

export default defineCollection({
  schema: z.object({
    name: z.string(),
    icon: zIcon,
    category: z.enum([
      "Cloud & DevOps", "Languages & Frameworks", "AI & Data"
    ]),
    confidence: z.number().min(0).max(100),
    isPriority: z.boolean().default(false)
  }),
});
