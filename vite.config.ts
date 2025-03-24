import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Add this import for path resolution

export default defineConfig({
  plugins: [react()],
  base: '/', // Already set for Vercel
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion'
    ]
  },
  server: {
    port: 3007,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // Add this to support @/ imports
    }
  }
});
