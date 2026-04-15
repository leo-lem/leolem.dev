import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://leolem.dev",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("?"),
    }),
    icon({
      include: {
        lucide: ["*"],
        "simple-icons": ["*"],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  prefetch: true,
  trailingSlash: "always",
  output: "static",
});