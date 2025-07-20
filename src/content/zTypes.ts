import { z } from 'astro:content';
import fs from 'fs';
import path from 'path';

const availableIcons = fs.readdirSync("public/icons/").map(f => path.parse(f).name);

export const zIcon = z.string().refine(icon => availableIcons.includes(icon), (icon) => ({
  message: `Icon '${icon}' not found in public/icons directory. Available icons: ${availableIcons.join(', ')}`
}));

import topics from "./topics/topics.json";
const availableTopics = topics.map(t => t.id);

export const zTopic = z.string().refine(
  (topic: string) => availableTopics.includes(topic),
  (topic: string) => ({
    message: `Topic '${topic}' not found in topics.json. Available topics: ${availableTopics.join(", ")}`
  })
);