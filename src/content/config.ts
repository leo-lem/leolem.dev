import projects from "./projects";
import stations from "./stations";
import services from "./services";
import blog from "./blog";

import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";
import { zIcon, zTopic } from "./zTypes";

const topics = defineCollection({
  loader: file("src/content/topics.json"),
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
  })
});


export const collections = { projects, stations, topics, services, blog };