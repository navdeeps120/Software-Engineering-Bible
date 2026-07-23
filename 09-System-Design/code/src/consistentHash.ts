/**
 * Consistent-hash ring with virtual nodes.
 * Hash is a simple deterministic FNV-1a 32-bit over strings (educational).
 */

export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export type RingNode = {
  id: string;
  /** Physical capacity weight (more weight → more vnodes) */
  weight: number;
};

export class ConsistentHashRing {
  private readonly vnodeHashToNode = new Map<number, string>();
  private sortedHashes: number[] = [];
  private readonly vnodesPerUnit: number;

  constructor(vnodesPerUnit = 100) {
    if (vnodesPerUnit < 1) throw new Error("vnodesPerUnit must be >= 1");
    this.vnodesPerUnit = vnodesPerUnit;
  }

  add(node: RingNode): void {
    if (!node.id) throw new Error("node.id required");
    if (node.weight < 1) throw new Error("weight must be >= 1");
    const count = node.weight * this.vnodesPerUnit;
    for (let i = 0; i < count; i++) {
      const h = fnv1a32(`${node.id}#${i}`);
      this.vnodeHashToNode.set(h, node.id);
    }
    this.rebuild();
  }

  remove(nodeId: string): void {
    for (const [h, id] of [...this.vnodeHashToNode.entries()]) {
      if (id === nodeId) this.vnodeHashToNode.delete(h);
    }
    this.rebuild();
  }

  private rebuild(): void {
    this.sortedHashes = [...this.vnodeHashToNode.keys()].sort((a, b) => a - b);
  }

  size(): number {
    return new Set(this.vnodeHashToNode.values()).size;
  }

  vnodeCount(): number {
    return this.sortedHashes.length;
  }

  /** Map key → responsible node id (clockwise successor). */
  locate(key: string): string {
    if (this.sortedHashes.length === 0) {
      throw new Error("ring is empty");
    }
    const h = fnv1a32(key);
    let lo = 0;
    let hi = this.sortedHashes.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (this.sortedHashes[mid]! < h) lo = mid + 1;
      else hi = mid;
    }
    const idx = lo === this.sortedHashes.length ? 0 : lo;
    return this.vnodeHashToNode.get(this.sortedHashes[idx]!)!;
  }

  /** Distribution histogram for a key set (for skew teaching). */
  histogram(keys: readonly string[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const k of keys) {
      const n = this.locate(k);
      counts.set(n, (counts.get(n) ?? 0) + 1);
    }
    return counts;
  }
}
