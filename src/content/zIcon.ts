import { z } from 'astro:content';
import fs from 'fs';
import path from 'path';

const iconsDir = new URL('../../public/icons/', import.meta.url).pathname;
const availableIcons = fs.readdirSync(iconsDir).map(f => path.parse(f).name);

export default z.string().refine(icon => !icon || availableIcons.includes(icon), "Ensure the icon exists in the public/icons directory");
