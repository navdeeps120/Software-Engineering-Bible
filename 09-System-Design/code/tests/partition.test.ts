import { describe, expect, it } from "vitest";
import { analyzeSkew, partitionOf, saltedKeys } from "../src/partition.js";

describe("partition skew", () => {
  it("detects hotspot when all keys override to one partition", () => {
    const overrides = new Map(
      Array.from({ length: 100 }, (_, i) => [`k${i}`, 0] as const),
    );
    const report = analyzeSkew(
      [...overrides.keys()],
      { partitions: 4, overrides },
    );
    expect(report.hotPartition).toBe(0);
    expect(report.imbalanceRatio).toBe(4);
    expect(report.counts[0]).toBe(100);
  });

  it("partitionOf is stable", () => {
    const plan = { partitions: 8 };
    expect(partitionOf("user:9", plan)).toBe(partitionOf("user:9", plan));
  });

  it("saltedKeys spreads a hot key", () => {
    const salts = saltedKeys("celebrity", 4);
    expect(salts).toEqual([
      "celebrity#0",
      "celebrity#1",
      "celebrity#2",
      "celebrity#3",
    ]);
    const plan = { partitions: 16 };
    const parts = new Set(salts.map((k) => partitionOf(k, plan)));
    expect(parts.size).toBeGreaterThan(1);
  });
});
