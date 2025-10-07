import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "src/popup.jsx", // Popup entry point
      output: {
        entryFileNames: "popup.js",
        chunkFileNames: "chunk.js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    rollupOptions: {
      output: {
        format: "es", // For module support in extension
      },
    },
  },
  css: {
    postcss: "./postcss.config.js", // For Tailwind
  },
});
