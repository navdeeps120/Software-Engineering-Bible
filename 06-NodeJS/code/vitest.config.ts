import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Worker-thread and real-timer labs need more headroom than the default 5s.
    testTimeout: 15_000,
    hookTimeout: 15_000,
  },
});
