/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: 'dist',
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
});
