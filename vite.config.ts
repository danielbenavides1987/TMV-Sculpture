import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Esto le dice a Vite: cuando veas "@", busca dentro de "client/src"
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  // IMPORTANTE: Le decimos que la raíz de la aplicación web es la carpeta 'client'
  root: path.resolve(__dirname, "client"),
  build: {
    // Esto sacará la carpeta 'dist' a la raíz para que Vercel la vea fácil
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
