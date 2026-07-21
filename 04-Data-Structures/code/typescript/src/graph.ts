import { DSError } from "./errors.js";

/** Undirected graph over string-labeled vertices, backed by adjacency sets. */
export class AdjListGraph {
  private adj: Map<string, Set<string>> = new Map();

  addVertex(v: string): void {
    if (!this.adj.has(v)) this.adj.set(v, new Set());
  }

  addEdge(u: string, v: string): void {
    this.addVertex(u);
    this.addVertex(v);
    this.adj.get(u)!.add(v);
    this.adj.get(v)!.add(u);
  }

  neighbors(v: string): string[] {
    const set = this.adj.get(v);
    if (!set) throw new DSError("missing", `vertex ${v} not found`);
    return Array.from(set).sort();
  }

  vertexCount(): number {
    return this.adj.size;
  }

  edgeCount(): number {
    let sum = 0;
    for (const set of this.adj.values()) sum += set.size;
    return sum / 2;
  }

  checkInvariants(): void {
    for (const [v, neighbors] of this.adj) {
      for (const n of neighbors) {
        if (!this.adj.get(n)?.has(v)) throw new DSError("invalid", "asymmetric adjacency entry");
      }
    }
  }
}

/** Undirected graph over vertices 0..n-1, backed by a boolean adjacency matrix. */
export class AdjMatrixGraph {
  private matrix: boolean[][];
  private n: number;

  constructor(n: number) {
    if (n < 0) throw new DSError("invalid", "n must be >= 0");
    this.n = n;
    this.matrix = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  }

  addVertex(): number {
    for (const row of this.matrix) row.push(false);
    this.matrix.push(new Array<boolean>(this.n + 1).fill(false));
    this.n++;
    return this.n - 1;
  }

  private checkVertex(v: number): void {
    if (v < 0 || v >= this.n) throw new DSError("index", `vertex ${v} out of bounds`);
  }

  addEdge(u: number, v: number): void {
    this.checkVertex(u);
    this.checkVertex(v);
    this.matrix[u][v] = true;
    this.matrix[v][u] = true;
  }

  neighbors(v: number): number[] {
    this.checkVertex(v);
    const out: number[] = [];
    for (let i = 0; i < this.n; i++) if (this.matrix[v][i]) out.push(i);
    return out;
  }

  vertexCount(): number {
    return this.n;
  }

  edgeCount(): number {
    let count = 0;
    for (let i = 0; i < this.n; i++) for (let j = i + 1; j < this.n; j++) if (this.matrix[i][j]) count++;
    return count;
  }

  checkInvariants(): void {
    for (let i = 0; i < this.n; i++) {
      if (this.matrix[i].length !== this.n) throw new DSError("invalid", "matrix row length mismatch");
      for (let j = 0; j < this.n; j++) {
        if (this.matrix[i][j] !== this.matrix[j][i]) throw new DSError("invalid", "asymmetric matrix entry");
      }
    }
  }
}
