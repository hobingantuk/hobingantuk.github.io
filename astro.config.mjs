// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://hobingantuk.github.io",
  base: "/", // Required for root-level deployment
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap()],
});
