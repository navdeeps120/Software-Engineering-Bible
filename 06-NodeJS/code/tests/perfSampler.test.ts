import { describe, expect, it } from "vitest";
import {
  createEventLoopDelaySampler,
  mean,
  percentile,
  PerformanceNowSampler,
} from "../src/perfSampler.js";

describe("mean", () => {
  it("computes the arithmetic mean", () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
    expect(mean([10])).toBe(10);
  });

  it("rejects an empty sample set", () => {
    expect(() => mean([])).toThrow(RangeError);
  });
});

describe("percentile", () => {
  const samples = [1, 2, 3, 4, 5];

  it("returns exact order statistics at the boundaries", () => {
    expect(percentile(samples, 0)).toBe(1);
    expect(percentile(samples, 100)).toBe(5);
    expect(percentile(samples, 50)).toBe(3);
  });

  it("linearly interpolates between order statistics", () => {
    // rank = 0.25 * 4 = 1 -> exact index 1 -> value 2
    expect(percentile(samples, 25)).toBe(2);
    // rank = 0.1 * 4 = 0.4 -> interpolate between samples[0]=1 and samples[1]=2
    expect(percentile(samples, 10)).toBeCloseTo(1.4, 5);
  });

  it("is independent of input order", () => {
    expect(percentile([5, 1, 3, 2, 4], 50)).toBe(percentile(samples, 50));
  });

  it("rejects an empty sample set and an out-of-range percentile", () => {
    expect(() => percentile([], 50)).toThrow(RangeError);
    expect(() => percentile(samples, -1)).toThrow(RangeError);
    expect(() => percentile(samples, 101)).toThrow(RangeError);
  });
});

describe("createEventLoopDelaySampler", () => {
  it("produces a finite, non-negative snapshot after a period of activity", async () => {
    const sampler = createEventLoopDelaySampler(2);
    sampler.start();

    // Give the loop some real ticks to measure, including a bit of
    // synchronous work so the histogram has non-trivial data.
    for (let i = 0; i < 5; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 5));
      let sum = 0;
      for (let j = 0; j < 1e5; j += 1) sum += j;
      void sum;
    }

    const snapshot = sampler.stop();
    for (const value of Object.values(snapshot)) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
    }
    expect(snapshot.maxMs).toBeGreaterThanOrEqual(snapshot.meanMs);
  });

  it("rejects a non-positive resolution", () => {
    expect(() => createEventLoopDelaySampler(0)).toThrow(RangeError);
    expect(() => createEventLoopDelaySampler(-1)).toThrow(RangeError);
  });
});

describe("PerformanceNowSampler", () => {
  it("collects inter-tick gaps while running", async () => {
    const sampler = new PerformanceNowSampler(10);
    sampler.start();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const samples = sampler.stop();

    expect(samples.length).toBeGreaterThan(0);
    for (const gap of samples) {
      expect(gap).toBeGreaterThan(0);
    }
  });

  it("rejects a non-positive interval", () => {
    expect(() => new PerformanceNowSampler(0)).toThrow(RangeError);
  });

  it("throws when started twice or stopped without starting", () => {
    const sampler = new PerformanceNowSampler(10);
    expect(() => sampler.stop()).toThrow(/never started/);
    sampler.start();
    expect(() => sampler.start()).toThrow(/already running/);
    sampler.stop();
  });
});
