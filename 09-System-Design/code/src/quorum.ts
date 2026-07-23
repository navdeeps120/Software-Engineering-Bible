/**
 * Quorum N/R/W consistency demo (in-process replica set).
 */

export type ReplicaValue = {
  value: string;
  /** Lamport-ish version; higher wins on conflict */
  version: number;
};

export class QuorumStore {
  readonly n: number;
  readonly r: number;
  readonly w: number;
  private replicas: (ReplicaValue | null)[];
  private clock = 0;

  constructor(n: number, r: number, w: number) {
    if (n < 1) throw new Error("n must be >= 1");
    if (r < 1 || r > n) throw new Error("r must be in [1, n]");
    if (w < 1 || w > n) throw new Error("w must be in [1, n]");
    this.n = n;
    this.r = r;
    this.w = w;
    this.replicas = Array.from({ length: n }, () => null);
  }

  /** Strong read-your-writes intuition: R+W > N implies overlap. */
  isStrongOverlap(): boolean {
    return this.r + this.w > this.n;
  }

  /**
   * Write to first `w` healthy replicas (indices 0..w-1 by default).
   * `failed` lists replica indices that refuse the write.
   */
  write(
    value: string,
    failed: readonly number[] = [],
  ): { ok: boolean; version: number; acks: number } {
    this.clock += 1;
    const version = this.clock;
    const failedSet = new Set(failed);
    let acks = 0;
    for (let i = 0; i < this.n; i++) {
      if (failedSet.has(i)) continue;
      // Write attempt to all; count acks until W for "ok"
      this.replicas[i] = { value, version };
      acks += 1;
    }
    // Educational simplification: we write to all live replicas, require W acks.
    const liveAcks = this.n - failedSet.size;
    return { ok: liveAcks >= this.w, version, acks: liveAcks };
  }

  /**
   * Read from up to `r` live replicas; return highest version seen.
   */
  read(failed: readonly number[] = []): {
    ok: boolean;
    value: string | null;
    version: number;
    contacted: number;
  } {
    const failedSet = new Set(failed);
    const samples: ReplicaValue[] = [];
    for (let i = 0; i < this.n && samples.length < this.r; i++) {
      if (failedSet.has(i)) continue;
      const v = this.replicas[i];
      if (v) samples.push(v);
      else samples.push({ value: "", version: 0 });
    }
    if (samples.length < this.r) {
      return { ok: false, value: null, version: 0, contacted: samples.length };
    }
    const best = samples.reduce((a, b) => (b.version > a.version ? b : a));
    return {
      ok: true,
      value: best.version === 0 ? null : best.value,
      version: best.version,
      contacted: samples.length,
    };
  }

  /** Inject stale state on a replica (partition / lag teaching). */
  inject(index: number, value: ReplicaValue | null): void {
    if (index < 0 || index >= this.n) throw new Error("index out of range");
    this.replicas[index] = value;
  }

  snapshot(): (ReplicaValue | null)[] {
    return this.replicas.map((r) => (r ? { ...r } : null));
  }
}
