import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Replace REPO_NAME with your GitHub repository name
  build: {
    outDir: 'dist',
  },
});
