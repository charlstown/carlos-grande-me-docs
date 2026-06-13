import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    // Vitest owns the fast jsdom unit suite only. The Playwright E2E suite
    // under tests/e2e runs through its own runner (npm run test:e2e) and must
    // never enter the default loop.
    include: ['tests/unit/**/*.test.js'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
});
