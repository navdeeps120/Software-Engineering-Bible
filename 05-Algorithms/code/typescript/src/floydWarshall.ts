import { type WeightedEdge } from "./graphCommon.js";

/**
 * All-pairs shortest paths via the classic triple loop, O(V^3). Handles
 * negative edges (but not negative cycles meaningfully -- a negative cycle
 * will make the diagonal go negative, which callers can check for). The
 * diagonal is initialized to 0 (distance from a vertex to itself) even
 * without a self-loop edge; the smallest parallel edge weight is kept when
 * multiple edges connect the same pair. Unreachable pairs are `null`.
 */
export function floydWarshall(n: number, edges: WeightedEdge[], directed = false): (number | null)[][] {
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) {
    if (w < dist[u][v]) dist[u][v] = w;
    if (!directed && w < dist[v][u]) dist[v][u] = w;
  }
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (dist[i][k] === Infinity) continue;
      for (let j = 0; j < n; j++) {
        if (dist[k][j] === Infinity) continue;
        const candidate = dist[i][k] + dist[k][j];
        if (candidate < dist[i][j]) dist[i][j] = candidate;
      }
    }
  }
  return dist.map((row) => row.map((d) => (d === Infinity ? null : d)));
}
