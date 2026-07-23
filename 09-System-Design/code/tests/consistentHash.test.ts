import { describe, expect, it } from "vitest";
import { ConsistentHashRing, fnv1a32 } from "../src/consistentHash.js";

describe("fnv1a32", () => {
  it("is deterministic", () => {
    expect(fnv1a32("user:42")).toBe(fnv1a32("user:42"));
    expect(fnv1a32("a")).not.toBe(fnv1a32("b"));
  });
});

describe("ConsistentHashRing", () => {
  it("locates keys stably and redistributes only a fraction on node add", () => {
    const ring = new ConsistentHashRing(50);
    ring.add({ id: "a", weight: 1 });
    ring.add({ id: "b", weight: 1 });
    const keys = Array.from({ length: 200 }, (_, i) => `k${i}`);
    const before = new Map(keys.map((k) => [k, ring.locate(k)]));

    ring.add({ id: "c", weight: 1 });
    let moved = 0;
    for (const k of keys) {
      if (ring.locate(k) !== before.get(k)) moved += 1;
    }
    // With 3 nodes, ideally ~1/3 move — allow wide educational band
    expect(moved).toBeGreaterThan(20);
    expect(moved).toBeLessThan(120);
  });

  it("histogram sums to key count", () => {
    const ring = new ConsistentHashRing(20);
    ring.add({ id: "n1", weight: 1 });
    ring.add({ id: "n2", weight: 2 });
    const keys = Array.from({ length: 300 }, (_, i) => `x${i}`);
    const hist = ring.histogram(keys);
    const sum = [...hist.values()].reduce((a, b) => a + b, 0);
    expect(sum).toBe(300);
    expect(hist.get("n2")!).toBeGreaterThan(hist.get("n1")!);
  });
});
