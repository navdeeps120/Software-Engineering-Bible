import { AlgoError } from "./errors.js";
import { buildWeightedAdjList, checkVertexInRange, type WeightedEdge } from "./graphCommon.js";

/**
 * Single-source shortest paths with a binary-heap-free O(V^2 + E) Dijkstra
 * (a plain array scan for the minimum each round; fine for the small graphs
 * in this lab and avoids a second data structure entirely). Requires all
 * weights to be non-negative (throws AlgoError("invalid") otherwise).
 * Unreachable vertices are `null` in the result (rather than +Infinity), and
 * `dist[src] === 0`.
 */
export function dijkstra(n: number, edges: WeightedEdge[], src: number, directed = false): (number | null)[] {
  checkVertexInRange(n, src);
  for (const [, , w] of edges) {
    if (w < 0) throw new AlgoError("invalid", "dijkstra requires non-negative edge weights");
  }
  const adj = buildWeightedAdjList(n, edges, directed);
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  const visited = new Array(n).fill(false);

  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!visited[v] && dist[v] < Infinity && (u === -1 || dist[v] < dist[u])) u = v;
    }
    if (u === -1) break;
    visited[u] = true;
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }

  return dist.map((d) => (d === Infinity ? null : d));
}
