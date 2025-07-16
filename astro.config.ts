import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'http://leolem.dev',
  integrations: [tailwind(), sitemap()],
});