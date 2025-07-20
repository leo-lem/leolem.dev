import { z } from 'astro:content';
import fs from 'fs';
import path from 'path';

let availableIcons: string[] = [];
const initializeAvailableIcons = async () => {
  const files = await fs.promises.readdir(new URL('../../public/icons/', import.meta.url).pathname);
  availableIcons = files.map(f => path.parse(f).name);
};
initializeAvailableIcons();

export const zIcon = z.string().refine(async icon => {
  if (!icon) return true;
  await initializeAvailableIcons();
  return availableIcons.includes(icon);
},
  (icon) => ({
    message: `Icon '${icon}' not found in public/icons directory. Available icons: ${availableIcons.join(', ')}`
  })
);

import topics from "./topics/topics.json";
const availableTopics = topics.map(t => t.id);

export const zTopic = z.string().refine(
  (topic: string) => availableTopics.includes(topic),
  (topic: string) => ({
    message: `Topic '${topic}' not found in topics.json. Available topics: ${availableTopics.join(", ")}`
  })
);