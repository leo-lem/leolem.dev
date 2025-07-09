import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  reporter: [['junit', { outputFile: 'test-results.xml' }]],
});