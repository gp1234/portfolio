import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "/portfolio/", // ✅ Add this line
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
});
