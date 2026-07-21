import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/api/**/*.{ts,tsx}', 'src/utils/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.ts'],
      thresholds: {
        statements: 85,
        lines: 85,
        functions: 80,
        branches: 75,
      },
    },
  },
});
