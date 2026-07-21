import { type WeightedEdge } from "./graphCommon.js";

export interface MstResult {
  weight: number;
  edges: WeightedEdge[];
}

class DisjointSet {
  private parent: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }
  find(x: number): number {
    while (this.parent[x] !== x) x = this.parent[x];
    return x;
  }
  union(a: number, b: number): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    // Union by lower-root-wins, not by rank: keeps the merge rule itself
    // deterministic and independent of insertion order, which matters here
    // only for reproducibility of internal state, not of the output (the
    // MST weight/edge set is unique up to weight ties handled below).
    if (ra < rb) this.parent[rb] = ra;
    else this.parent[ra] = rb;
    return true;
  }
}

/**
 * Minimum spanning forest via Kruskal's algorithm: sort all edges ascending
 * by (weight, u, v) -- the tie-break on endpoints makes the exact edge set
 * chosen deterministic even when multiple equal-weight MSTs exist -- then
 * greedily add each edge that connects two different components (checked
 * via union-find). Works on disconnected graphs (returns a minimum
 * spanning *forest*; `edges.length` will be less than n-1 in that case).
 * O(E log E).
 */
export function kruskal(n: number, edges: WeightedEdge[]): MstResult {
  const sorted = edges.slice().sort((a, b) => {
    if (a[2] !== b[2]) return a[2] - b[2];
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });
  const dsu = new DisjointSet(n);
  const chosen: WeightedEdge[] = [];
  let weight = 0;
  for (const [u, v, w] of sorted) {
    if (dsu.union(u, v)) {
      chosen.push([u, v, w]);
      weight += w;
    }
  }
  return { weight, edges: chosen };
}
