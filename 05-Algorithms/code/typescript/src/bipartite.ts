import { buildAdjList, type Edge } from "./graphCommon.js";

/**
 * Checks whether the (undirected) graph on n vertices is 2-colorable: BFS
 * from every uncolored vertex, alternating colors across edges, and
 * failing as soon as an edge connects two same-colored vertices (including
 * a self-loop, which is always odd-length and therefore never bipartite).
 * O(V + E).
 */
export function isBipartite(n: number, edges: Edge[]): boolean {
  const adj = buildAdjList(n, edges, false);
  const color = new Array(n).fill(-1);
  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue;
    color[start] = 0;
    const queue = [start];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      for (const v of adj[u]) {
        if (color[v] === -1) {
          color[v] = 1 - color[u];
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;
        }
      }
    }
  }
  return true;
}
