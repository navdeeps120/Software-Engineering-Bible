/**
 * miniRedis.ts
 *
 * An in-memory key/value dictionary (`SET`/`GET`/`DEL` subset) with an
 * **AOF** (append-only file) write log and `replay()` recovery. See
 * [[08-Databases/10-Redis-and-In-Memory-Engines/RDB Snapshots and AOF]].
 *
 * Mechanism: `store` is the live `Map<string, string>` Redis actually
 * serves reads from. Every mutating command (`SET`, `DEL`) is also
 * appended to `aofLog` — modeling the AOF file Redis appends each write
 * command to before (or, with `appendfsync everysec`, shortly after)
 * acknowledging the client, so the log always reflects exactly what
 * happened to the dataset, in order. `exportAof()` is the equivalent of
 * reading the AOF file off disk; `MiniRedis.replay(log)` is exactly what
 * Redis does on restart — it re-executes every logged command from
 * scratch against a fresh empty dataset, in order, which is why AOF
 * replay time scales with the *number of write commands ever issued*,
 * not the size of the current dataset (this is precisely why Redis
 * supports AOF rewrite/compaction in production — not modeled here).
 *
 * `GET` on a missing key returns `undefined` (Redis's `nil`) — that is
 * normal, expected behavior, not an error. Malformed *input* (a
 * non-string key or value) throws `TypeError` immediately, per this
 * lab's "fail loudly on invalid input" rule.
 *
 * Intentional simplification: no TTL/expiry, no other Redis data types
 * (lists, hashes, sets, sorted sets), no RDB snapshotting, no partial/
 * corrupted-AOF recovery, and no `BGREWRITEAOF` compaction — the AOF here
 * only ever grows. See
 * [[08-Databases/10-Redis-and-In-Memory-Engines/Redis Data Structures as Persistence API]]
 * for the full command surface this is a subset of.
 */

export type AofOperation = { op: "SET"; key: string; value: string } | { op: "DEL"; key: string };

function assertKey(key: unknown): asserts key is string {
  if (typeof key !== "string" || key.length === 0) {
    throw new TypeError(`key must be a non-empty string, got ${JSON.stringify(key)}`);
  }
}

function assertValue(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`value must be a string, got ${JSON.stringify(value)}`);
  }
}

/** A minimal Redis-like SET/GET/DEL store with AOF append + replay. */
export class MiniRedis {
  private readonly store = new Map<string, string>();
  private readonly aofLog: AofOperation[] = [];

  set(key: string, value: string): void {
    assertKey(key);
    assertValue(value);
    this.store.set(key, value);
    this.aofLog.push({ op: "SET", key, value });
  }

  get(key: string): string | undefined {
    assertKey(key);
    return this.store.get(key);
  }

  /** Returns `true` if the key existed and was removed, `false` if it was already absent. Only an actual removal is appended to the AOF, mirroring real Redis (a no-op `DEL` need not be replayed). */
  del(key: string): boolean {
    assertKey(key);
    const existed = this.store.delete(key);
    if (existed) this.aofLog.push({ op: "DEL", key });
    return existed;
  }

  has(key: string): boolean {
    assertKey(key);
    return this.store.has(key);
  }

  keys(): string[] {
    return [...this.store.keys()];
  }

  get size(): number {
    return this.store.size;
  }

  /** A copy of every durable write command ever applied, in order — the in-memory stand-in for reading the AOF file off disk. */
  exportAof(): AofOperation[] {
    return [...this.aofLog];
  }

  /** Rebuilds a fresh `MiniRedis` by re-executing an AOF log from an empty dataset, in order — exactly what a real Redis restart does. */
  static replay(log: readonly AofOperation[]): MiniRedis {
    const redis = new MiniRedis();
    for (const entry of log) {
      if (entry.op === "SET") redis.set(entry.key, entry.value);
      else redis.del(entry.key);
    }
    return redis;
  }
}
