import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

const apiTarget = process.env.VITE_DEV_API_PROXY ?? 'http://127.0.0.1:5001';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mp4', '**/*.MP4', '**/*.jpeg', '**/*.JPEG', '**/*.jpg', '**/*.JPG', '**/*.png', '**/*.PNG'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'framer-motion'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          swiper: ['swiper'],
          framer: ['framer-motion'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        timeout: 30000,
      },
      '/assets/uploads': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
