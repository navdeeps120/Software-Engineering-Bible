import { AlgoError } from "./errors.js";

export type Edge = [number, number];
export type WeightedEdge = [number, number, number];

function checkVertex(n: number, v: number): void {
  if (!Number.isInteger(v) || v < 0 || v >= n) throw new AlgoError("index", `vertex ${v} out of bounds for n=${n}`);
}

/** Exported so entry-point algorithms (bfs, dijkstra, maxFlow, ...) can validate a standalone src/s/t parameter. */
export function checkVertexInRange(n: number, v: number): void {
  checkVertex(n, v);
}

/**
 * Builds an adjacency list for n vertices (0..n-1) from an unweighted edge
 * list. Each vertex's neighbor list is sorted ascending, which is what
 * gives every traversal in this lab (BFS, DFS, components, ...) a
 * deterministic, language-agnostic visiting order: "lower vertex id wins"
 * ties. Multi-edges are preserved (not deduplicated); self-loops are
 * allowed.
 */
export function buildAdjList(n: number, edges: Edge[], directed: boolean): number[][] {
  if (n < 0) throw new AlgoError("invalid", "n must be >= 0");
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    checkVertex(n, u);
    checkVertex(n, v);
    adj[u].push(v);
    if (!directed) adj[v].push(u);
  }
  for (const list of adj) list.sort((a, b) => a - b);
  return adj;
}

/** Weighted counterpart of buildAdjList; each entry is [neighbor, weight]. */
export function buildWeightedAdjList(n: number, edges: WeightedEdge[], directed: boolean): [number, number][][] {
  if (n < 0) throw new AlgoError("invalid", "n must be >= 0");
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    checkVertex(n, u);
    checkVertex(n, v);
    adj[u].push([v, w]);
    if (!directed) adj[v].push([u, w]);
  }
  for (const list of adj) list.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
  return adj;
}
