import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', timeout: 45000, expect: { timeout: 10000 }, fullyParallel: false,
  workers: 1, reporter: [['list']],
  use: { baseURL: process.env.TEST_URL ?? 'http://127.0.0.1:5173/StockTradingRampUp/', viewport: { width: 1440, height: 1000 }, headless: true, trace: 'retain-on-failure' },
  outputDir: process.env.QA_OUTPUT ?? 'C:/Users/aswin/.codex/visualizations/2026/10/09/01a122fc-caa1-7b61-aa15-e60f2e1a3540/test-results',
});
