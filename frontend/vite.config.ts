import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: "dist",
  },
  server: {
    allowedHosts: [
      "5173-jatinpanesi-dynamicform-s2ga0u6e8br.ws-us118.gitpod.io",
    ],
  },
});
