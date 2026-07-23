import { describe, expect, it } from "vitest";
import { LagQueue, shouldApplyBackpressure } from "../src/queueLag.js";

describe("LagQueue", () => {
  it("tracks depth, sheds at maxDepth, and reports oldest age", () => {
    let t = 0;
    const q = new LagQueue(2, () => t);
    expect(q.enqueue("a")).toBe(true);
    t = 10;
    expect(q.enqueue("b")).toBe(true);
    expect(q.enqueue("c")).toBe(false);
    expect(q.stats().shed).toBe(1);
    expect(q.oldestAgeMs()).toBe(10);
    const batch = q.consume(1);
    expect(batch).toHaveLength(1);
    expect(batch[0]!.body).toBe("a");
    expect(q.depth()).toBe(1);
  });

  it("shouldApplyBackpressure at high watermark", () => {
    expect(shouldApplyBackpressure(50, 50)).toBe(true);
    expect(shouldApplyBackpressure(49, 50)).toBe(false);
  });
});
