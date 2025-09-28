import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // @ts-expect-error: viewTransitions not in types yet, but supported in runtime
  viewTransitions: true,
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@components": "src/components",
        "@styles": "src/styles",
        "@layouts": "src/layouts",
        "@lib": "src/lib",
        "@pages": "src/pages",
      },
    },
  },
});