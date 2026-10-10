import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
  base: '/StockTradingRampUp/',
  build: { outDir: 'docs', emptyOutDir: false, rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom', 'react-router-dom'] } } } },
});
