import { defineConfig } from 'vitest/config';

export default defineConfig({
  // The public check hashes every short run of words in dist/, which takes several seconds.
  test: { include: ['tests/**/*.test.ts'], environment: 'node', testTimeout: 30_000 },
});
