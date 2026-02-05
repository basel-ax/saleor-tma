import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@config': resolve(__dirname, 'src/config'),
      '@services': resolve(__dirname, 'src/services'),
      '@handlers': resolve(__dirname, 'src/handlers'),
      '@routes': resolve(__dirname, 'src/routes'),
      '@types': resolve(__dirname, 'src/types'),
    },
  },
  root: 'frontend',
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/telegram': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
