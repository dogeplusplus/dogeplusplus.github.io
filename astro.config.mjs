import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://dogeplusplus.github.io",
  integrations: [sitemap()],
});
