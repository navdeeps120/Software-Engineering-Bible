import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // A couple of labs (job queue retries, real-Express integration) need a
    // bit more headroom than the default 5s.
    testTimeout: 15_000,
    hookTimeout: 15_000,
  },
});
