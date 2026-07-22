/**
 * cacheAside.ts
 *
 * The **cache-aside** (lazy-loading) pattern with a TTL backstop and a
 * per-key **singleflight / stampede lock**: see
 * [[07-Backend/07-Caching-Jobs-and-Messaging/Cache-Aside and TTL Strategies]]
 * and
 * [[07-Backend/07-Caching-Jobs-and-Messaging/Cache Stampede and Soft Expiry]].
 *
 * On a cache miss, the first caller for a key runs `load()`; every other
 * caller that misses on the *same* key while that load is in flight awaits
 * the same promise instead of re-triggering `load()` — this is exactly the
 * mechanism that prevents a "thundering herd" of duplicate origin requests
 * when a hot key expires under concurrent traffic.
 *
 * Intentional simplification: single in-memory `Map`, so this only
 * dedupes within one process. A distributed stampede lock needs a
 * shared-store `SETNX`/lock token (Redis-backed, typically) — the
 * algorithm is the same; only the lock's visibility scope changes.
 */

export interface CacheAsideOptions {
  ttlMs: number;
  now?: () => number;
}

interface Entry<V> {
  value: V;
  expiresAt: number;
}

export class CacheAside<K, V> {
  private readonly store = new Map<K, Entry<V>>();
  private readonly inFlight = new Map<K, Promise<V>>();
  private readonly ttlMs: number;
  private readonly now: () => number;
  private hits = 0;
  private misses = 0;

  constructor(options: CacheAsideOptions) {
    if (!Number.isFinite(options.ttlMs) || options.ttlMs <= 0) {
      throw new RangeError(`ttlMs must be a positive finite number, got ${options.ttlMs}`);
    }
    this.ttlMs = options.ttlMs;
    this.now = options.now ?? Date.now;
  }

  private readFresh(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (this.now() >= entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /**
   * Cache-aside read: returns the cached value if fresh; otherwise joins an
   * in-flight `load()` for this key, or starts one if none is running.
   * Only a successful `load()` populates the cache — a rejected load is
   * not cached, so the next call retries against the origin.
   */
  async getOrLoad(key: K, load: () => Promise<V>): Promise<V> {
    const cached = this.readFresh(key);
    if (cached !== undefined) {
      this.hits += 1;
      return cached;
    }

    const pending = this.inFlight.get(key);
    if (pending) return pending;

    this.misses += 1;
    const promise = load()
      .then((value) => {
        this.store.set(key, { value, expiresAt: this.now() + this.ttlMs });
        return value;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });
    this.inFlight.set(key, promise);
    return promise;
  }

  /** Removes `key` from the cache (e.g. after a write to the source of truth). Does not affect an in-flight load for the same key. */
  invalidate(key: K): void {
    this.store.delete(key);
  }

  get stats(): { hits: number; misses: number } {
    return { hits: this.hits, misses: this.misses };
  }

  get size(): number {
    return this.store.size;
  }
}
