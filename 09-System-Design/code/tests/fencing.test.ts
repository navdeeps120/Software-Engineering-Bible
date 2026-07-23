import { describe, expect, it } from "vitest";
import { FencedResource } from "../src/fencing.js";

describe("FencedResource", () => {
  it("rejects stale fencing tokens after re-acquire", () => {
    let t = 0;
    const res = new FencedResource(() => t);
    const lease1 = res.acquire("node-a", 100);
    expect(res.mutate("node-a", lease1.token, 1)).toBe(true);

    const lease2 = res.acquire("node-b", 100);
    expect(lease2.token).toBeGreaterThan(lease1.token);
    expect(res.mutate("node-a", lease1.token, 1)).toBe(false);
    expect(res.mutate("node-b", lease2.token, 5)).toBe(true);
    expect(res.stats().value).toBe(6);
    expect(res.stats().rejected).toBe(1);
  });

  it("rejects mutate after lease expiry", () => {
    let t = 0;
    const res = new FencedResource(() => t);
    const lease = res.acquire("n", 10);
    t = 11;
    expect(res.mutate("n", lease.token, 1)).toBe(false);
  });
});
