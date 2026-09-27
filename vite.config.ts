import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    rolldownOptions: {
      external:
        /^(?:react(?:-dom)?(?:\/.*)?|@floating-ui\/react|lucide-react|react-markdown|remark-gfm)$/,
      output: { banner: '"use client";' },
    },
  },
});
