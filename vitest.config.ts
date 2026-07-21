import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: [
        'src/api/**/*.{ts,tsx}',
        'src/lib/**/*.{ts,tsx}',
        'src/features/**/search-params.ts',
        'src/features/**/search-view-state.ts',
        'src/features/**/reaction-state.ts',
      ],
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
