import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './assets'),
    },
  },
  publicDir: 'assets',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'esnext',
  },
});