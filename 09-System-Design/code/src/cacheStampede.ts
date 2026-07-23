/**
 * Cache stampede / thundering herd sketch at fleet scale.
 * Singleflight coalesces concurrent loads for the same key.
 */

export type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export class FleetCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private inflight = new Map<string, Promise<T>>();
  private loads = 0;
  private hits = 0;
  private misses = 0;

  constructor(private readonly now: () => number = () => Date.now()) {}

  stats() {
    return {
      loads: this.loads,
      hits: this.hits,
      misses: this.misses,
      inflight: this.inflight.size,
      size: this.store.size,
    };
  }

  get(key: string): T | undefined {
    const e = this.store.get(key);
    if (!e) return undefined;
    if (e.expiresAt <= this.now()) {
      this.store.delete(key);
      return undefined;
    }
    this.hits += 1;
    return e.value;
  }

  set(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: this.now() + ttlMs });
  }

  /**
   * getOrLoad with singleflight: concurrent misses share one loader call.
   */
  async getOrLoad(
    key: string,
    ttlMs: number,
    loader: () => Promise<T>,
  ): Promise<T> {
    const hit = this.get(key);
    if (hit !== undefined) return hit;

    this.misses += 1;
    const existing = this.inflight.get(key);
    if (existing) return existing;

    const p = (async () => {
      this.loads += 1;
      try {
        const value = await loader();
        this.set(key, value, ttlMs);
        return value;
      } finally {
        this.inflight.delete(key);
      }
    })();
    this.inflight.set(key, p);
    return p;
  }
}

/**
 * Simulate N concurrent readers hitting an expired key without singleflight
 * vs with singleflight — returns load counts.
 */
export async function stampedeDemo(
  concurrency: number,
  useSingleflight: boolean,
  clock: { t: number },
): Promise<{ loads: number }> {
  const cache = new FleetCache<string>(() => clock.t);
  cache.set("hot", "v1", 10);
  clock.t = 20; // expire

  let naiveLoads = 0;
  if (!useSingleflight) {
    await Promise.all(
      Array.from({ length: concurrency }, async () => {
        const hit = cache.get("hot");
        if (hit === undefined) {
          naiveLoads += 1;
          await Promise.resolve();
          cache.set("hot", "v2", 100);
        }
      }),
    );
    return { loads: naiveLoads };
  }

  await Promise.all(
    Array.from({ length: concurrency }, () =>
      cache.getOrLoad("hot", 100, async () => {
        await Promise.resolve();
        return "v2";
      }),
    ),
  );
  return { loads: cache.stats().loads };
}
