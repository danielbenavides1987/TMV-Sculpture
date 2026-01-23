import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Como el archivo está afuera, le decimos que entre a 'client/src'
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  // Le indicamos que el código de la web está en la carpeta 'client'
  root: "./client",
  build: {
    // Esto hará que la carpeta 'dist' se cree dentro de 'client'
    outDir: "../dist",
    emptyOutDir: true,
  },
});
