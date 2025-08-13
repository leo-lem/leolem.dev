import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://leolem.dev/',
  integrations: [tailwind(), sitemap()],
  prefetch: true,
  trailingSlash: "always",
  output: "static"
});
