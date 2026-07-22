import { describe, expect, it } from "vitest";
import { CacheAside } from "../src/cacheAside.js";

describe("CacheAside.getOrLoad", () => {
  it("calls load() on the first miss and caches the result", async () => {
    let now = 0;
    const cache = new CacheAside<string, string>({ ttlMs: 1_000, now: () => now });
    let loadCalls = 0;
    const load = async () => {
      loadCalls += 1;
      return "value-1";
    };

    await expect(cache.getOrLoad("key-1", load)).resolves.toBe("value-1");
    await expect(cache.getOrLoad("key-1", load)).resolves.toBe("value-1");
    expect(loadCalls).toBe(1);
    expect(cache.stats).toEqual({ hits: 1, misses: 1 });
  });

  it("reloads after the TTL expires, using the injected clock", async () => {
    let now = 0;
    const cache = new CacheAside<string, number>({ ttlMs: 100, now: () => now });
    let loadCalls = 0;
    const load = async () => {
      loadCalls += 1;
      return loadCalls;
    };

    await expect(cache.getOrLoad("key-1", load)).resolves.toBe(1);
    now += 100; // exactly at expiry boundary
    await expect(cache.getOrLoad("key-1", load)).resolves.toBe(2);
    expect(loadCalls).toBe(2);
  });

  it("joins an in-flight load instead of starting a second one (stampede lock)", async () => {
    const cache = new CacheAside<string, number>({ ttlMs: 1_000 });
    let loadCalls = 0;
    let resolveLoad!: (value: number) => void;
    const load = () =>
      new Promise<number>((resolve) => {
        loadCalls += 1;
        resolveLoad = resolve;
      });

    const first = cache.getOrLoad("hot-key", load);
    const second = cache.getOrLoad("hot-key", load); // races in before the first load settles
    const third = cache.getOrLoad("hot-key", load);
    expect(loadCalls).toBe(1); // exactly one origin call despite three concurrent callers

    resolveLoad(99);
    await expect(Promise.all([first, second, third])).resolves.toEqual([99, 99, 99]);
    expect(cache.stats.misses).toBe(1);
  });

  it("does not cache a failed load, so the next call retries the origin", async () => {
    const cache = new CacheAside<string, string>({ ttlMs: 1_000 });
    let attempt = 0;
    const load = async () => {
      attempt += 1;
      if (attempt === 1) throw new Error("origin unavailable");
      return "recovered";
    };

    await expect(cache.getOrLoad("key-1", load)).rejects.toThrow("origin unavailable");
    await expect(cache.getOrLoad("key-1", load)).resolves.toBe("recovered");
    expect(attempt).toBe(2);
  });

  it("invalidate() removes a cached entry so the next read re-loads", async () => {
    let now = 0;
    const cache = new CacheAside<string, number>({ ttlMs: 10_000, now: () => now });
    let loadCalls = 0;
    const load = async () => {
      loadCalls += 1;
      return loadCalls;
    };

    await cache.getOrLoad("key-1", load);
    cache.invalidate("key-1");
    await cache.getOrLoad("key-1", load);
    expect(loadCalls).toBe(2);
  });

  it("validates ttlMs", () => {
    expect(() => new CacheAside({ ttlMs: 0 })).toThrow(RangeError);
    expect(() => new CacheAside({ ttlMs: -1 })).toThrow(RangeError);
  });
});
