import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "", // Remplace "/" par "" pour éviter les erreurs de chemin sur Vercel
  build: {
    outDir: "dist", // Assure-toi que le build est bien généré dans dist/
  }
});