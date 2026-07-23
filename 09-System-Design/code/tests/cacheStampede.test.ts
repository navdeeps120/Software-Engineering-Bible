import { describe, expect, it } from "vitest";
import { FleetCache, stampedeDemo } from "../src/cacheStampede.js";

describe("FleetCache singleflight", () => {
  it("coalesces concurrent loads for one key", async () => {
    const clock = { t: 0 };
    const cache = new FleetCache<string>(() => clock.t);
    let loads = 0;
    const loader = async () => {
      loads += 1;
      await Promise.resolve();
      return "payload";
    };
    const results = await Promise.all(
      Array.from({ length: 20 }, () => cache.getOrLoad("k", 100, loader)),
    );
    expect(results.every((r) => r === "payload")).toBe(true);
    expect(loads).toBe(1);
    expect(cache.stats().loads).toBe(1);
  });

  it("stampedeDemo shows many loads without singleflight", async () => {
    const clock = { t: 0 };
    const naive = await stampedeDemo(25, false, clock);
    expect(naive.loads).toBeGreaterThan(1);
    const coalesced = await stampedeDemo(25, true, { t: 0 });
    expect(coalesced.loads).toBe(1);
  });
});
