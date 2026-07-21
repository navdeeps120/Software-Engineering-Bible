import { checkVertexInRange, type WeightedEdge } from "./graphCommon.js";

export interface BellmanFordResult {
  dist: (number | null)[];
  negativeCycle: boolean;
}

/**
 * Single-source shortest paths tolerant of negative edge weights.
 * Relaxes every edge n-1 times (edges processed in the exact order given,
 * for determinism), then runs one more pass: if any edge still relaxes,
 * a negative-weight cycle is reachable from `src`. When a negative cycle is
 * detected, `dist` is reported as `null` for every vertex rather than the
 * (algorithm-order-dependent, and physically meaningless -- shortest paths
 * are unbounded below) partial distances. Unreachable vertices are `null`.
 * O(V * E).
 */
export function bellmanFord(n: number, edges: WeightedEdge[], src: number, directed = false): BellmanFordResult {
  checkVertexInRange(n, src);
  const directedEdges: WeightedEdge[] = [];
  for (const [u, v, w] of edges) {
    directedEdges.push([u, v, w]);
    if (!directed) directedEdges.push([v, u, w]);
  }

  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;

  for (let iter = 0; iter < n - 1; iter++) {
    let changed = false;
    for (const [u, v, w] of directedEdges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        changed = true;
      }
    }
    if (!changed) break;
  }

  let negativeCycle = false;
  for (const [u, v, w] of directedEdges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      negativeCycle = true;
      break;
    }
  }

  if (negativeCycle) {
    return { dist: new Array(n).fill(null), negativeCycle: true };
  }
  return { dist: dist.map((d) => (d === Infinity ? null : d)), negativeCycle: false };
}
