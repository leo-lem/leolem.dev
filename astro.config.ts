import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import icon from 'astro-icon';

export default defineConfig({
  site: 'https://leolem.dev',
  integrations: [tailwind(), sitemap(), icon({
      include: {
        lucide: ["*"],
        "simple-icons": ["*"],
      },
    })],
  prefetch: true,
  trailingSlash: "always",
  output: "static"
});