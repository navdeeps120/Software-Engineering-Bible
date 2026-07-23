/**
 * Fencing-token lease demo: stale lock holders cannot mutate after fence bump.
 */

export type Lease = {
  owner: string;
  /** Monotonic fencing token; higher always wins */
  token: number;
  expiresAt: number;
};

export class FencedResource {
  private lease: Lease | null = null;
  private nextToken = 1;
  private value = 0;
  private rejected = 0;

  constructor(private readonly now: () => number = () => 0) {}

  stats() {
    return {
      value: this.value,
      rejected: this.rejected,
      lease: this.lease ? { ...this.lease } : null,
    };
  }

  /**
   * Acquire or renew lease. Always issues a new fencing token.
   */
  acquire(owner: string, ttlMs: number): Lease {
    const token = this.nextToken++;
    this.lease = { owner, token, expiresAt: this.now() + ttlMs };
    return { ...this.lease };
  }

  /**
   * Mutate only if caller's token matches current lease and lease not expired.
   */
  mutate(owner: string, token: number, delta: number): boolean {
    const L = this.lease;
    if (!L || L.expiresAt <= this.now()) {
      this.rejected += 1;
      return false;
    }
    if (L.owner !== owner || L.token !== token) {
      this.rejected += 1;
      return false;
    }
    this.value += delta;
    return true;
  }
}
