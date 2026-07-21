import { DSError } from "./errors.js";

/** Disjoint-set over integers 0..n-1 with union by rank and full path compression. */
export class UnionFind {
  private parent: number[];
  private rank: number[];
  private components: number;

  constructor(n: number) {
    if (n < 0) throw new DSError("invalid", "n must be >= 0");
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.components = n;
  }

  private checkIndex(x: number): void {
    if (x < 0 || x >= this.parent.length) throw new DSError("index", `index ${x} out of bounds`);
  }

  find(x: number): number {
    this.checkIndex(x);
    let root = x;
    while (this.parent[root] !== root) root = this.parent[root];
    while (this.parent[x] !== root) {
      const next = this.parent[x];
      this.parent[x] = root;
      x = next;
    }
    return root;
  }

  union(a: number, b: number): void {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return;
    if (this.rank[ra] < this.rank[rb]) {
      this.parent[ra] = rb;
    } else if (this.rank[ra] > this.rank[rb]) {
      this.parent[rb] = ra;
    } else {
      this.parent[rb] = ra;
      this.rank[ra]++;
    }
    this.components--;
  }

  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }

  count(): number {
    return this.components;
  }

  checkInvariants(): void {
    const roots = new Set<number>();
    for (let i = 0; i < this.parent.length; i++) roots.add(this.find(i));
    if (roots.size !== this.components) throw new DSError("invalid", "component count mismatch");
  }
}
