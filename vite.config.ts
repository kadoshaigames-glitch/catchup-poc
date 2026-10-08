import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/catchup-deploy/", // GitHub Pages base path for catchup-deploy
  server: {
    port: 5173,
    strictPort: true,
  },
});
