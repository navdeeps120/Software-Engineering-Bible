import { describe, expect, it } from "vitest";
import { aggregateLatency, sequentialTailRisk } from "../src/latency.js";

describe("aggregateLatency", () => {
  it("computes percentiles with nearest-rank on a fixed fixture", () => {
    const samples = Array.from({ length: 100 }, (_, i) => i + 1); // 1..100
    const r = aggregateLatency(samples);
    expect(r.count).toBe(100);
    expect(r.min).toBe(1);
    expect(r.max).toBe(100);
    expect(r.p50).toBe(50);
    expect(r.p90).toBe(90);
    expect(r.p99).toBe(99);
  });

  it("rejects empty samples", () => {
    expect(() => aggregateLatency([])).toThrow(/non-empty|empty/i);
  });
});

describe("sequentialTailRisk", () => {
  it("scales hop p99 by hop count as educational budget", () => {
    expect(sequentialTailRisk(10, 3)).toBe(30);
  });
});
