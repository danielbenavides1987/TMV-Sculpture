import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // "@" apunta a client/src
      "@": path.resolve(__dirname, "./src"),
      // "@shared" sale de client y busca shared en la raíz
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
