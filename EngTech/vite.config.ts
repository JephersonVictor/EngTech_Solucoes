import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(projectRoot, "index.html"),
        services: resolve(projectRoot, "servicos.html"),
        portfolio: resolve(projectRoot, "portfolio.html"),
        about: resolve(projectRoot, "sobre.html"),
        contact: resolve(projectRoot, "contato.html"),
        admin: resolve(projectRoot, "admin.html")
      }
    }
  }
});