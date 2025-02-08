import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: ".",
  build: {
    sourcemap: false, 
  },
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
  
});
