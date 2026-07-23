/**
 * L4/L7-ish load balancer simulator with health checks and drain.
 */

export type Backend = {
  id: string;
  /** Current in-flight connections (for least-conn) */
  active: number;
  healthy: boolean;
  draining: boolean;
};

export type LbAlgorithm = "round-robin" | "least-conn" | "consistent-hash";

export class LoadBalancer {
  private backends: Backend[] = [];
  private rrIndex = 0;
  private readonly algorithm: LbAlgorithm;
  /** Optional key → backend sticky map for consistent-hash teaching mode */
  private readonly sticky = new Map<string, string>();

  constructor(algorithm: LbAlgorithm = "round-robin") {
    this.algorithm = algorithm;
  }

  upsert(backend: Backend): void {
    const i = this.backends.findIndex((b) => b.id === backend.id);
    if (i >= 0) this.backends[i] = { ...backend };
    else this.backends.push({ ...backend });
  }

  setHealthy(id: string, healthy: boolean): void {
    const b = this.require(id);
    b.healthy = healthy;
  }

  setDraining(id: string, draining: boolean): void {
    const b = this.require(id);
    b.draining = draining;
  }

  private require(id: string): Backend {
    const b = this.backends.find((x) => x.id === id);
    if (!b) throw new Error(`unknown backend ${id}`);
    return b;
  }

  private eligible(): Backend[] {
    return this.backends.filter((b) => b.healthy && !b.draining);
  }

  /**
   * Choose a backend. For consistent-hash, pass `key`.
   * Returns null if none eligible (admission failure).
   */
  pick(key?: string): Backend | null {
    const pool = this.eligible();
    if (pool.length === 0) return null;

    switch (this.algorithm) {
      case "round-robin": {
        this.rrIndex = this.rrIndex % pool.length;
        const chosen = pool[this.rrIndex]!;
        this.rrIndex = (this.rrIndex + 1) % pool.length;
        return chosen;
      }
      case "least-conn": {
        return pool.reduce((best, cur) =>
          cur.active < best.active ? cur : best,
        );
      }
      case "consistent-hash": {
        if (key === undefined) throw new Error("key required for consistent-hash");
        const stickyId = this.sticky.get(key);
        if (stickyId) {
          const stickyBackend = pool.find((b) => b.id === stickyId);
          if (stickyBackend) return stickyBackend;
        }
        // Educational: map key to index via string length hash
        let h = 0;
        for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
        const chosen = pool[h % pool.length]!;
        this.sticky.set(key, chosen.id);
        return chosen;
      }
      default:
        return null;
    }
  }

  /** Acquire connection on backend (increments active). */
  acquire(id: string): void {
    this.require(id).active += 1;
  }

  release(id: string): void {
    const b = this.require(id);
    if (b.active > 0) b.active -= 1;
  }

  list(): readonly Backend[] {
    return this.backends.map((b) => ({ ...b }));
  }
}
