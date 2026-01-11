import { z } from 'astro:content';
import fs from 'fs';
import path from 'path';

const availableIcons = fs.readdirSync("src/assets/icons/").map(f => path.parse(f).name);

export const zIcon = z.string().refine(icon => availableIcons.includes(icon), (icon) => ({
  message: `Icon '${icon}' not found in src/assets/icons directory. Available icons: ${availableIcons.join(', ')}`
}));

export const zTopic = z.string();