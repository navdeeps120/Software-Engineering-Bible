import { AlgoError } from "./errors.js";
import { buildWeightedAdjList, checkVertexInRange, type WeightedEdge } from "./graphCommon.js";

/**
 * 0-1 BFS: shortest paths when every edge weight is 0 or 1, using a deque
 * instead of a priority queue (0-weight edges pushed to the front, 1-weight
 * edges pushed to the back), which is O(V + E) instead of Dijkstra's
 * O(V log V + E). Throws AlgoError("invalid") if any weight is outside
 * {0, 1}. Unreachable vertices are `null`.
 */
export function zeroOneBfs(n: number, edges: WeightedEdge[], src: number, directed = false): (number | null)[] {
  checkVertexInRange(n, src);
  for (const [, , w] of edges) {
    if (w !== 0 && w !== 1) throw new AlgoError("invalid", "zeroOneBfs requires weights in {0, 1}");
  }
  const adj = buildWeightedAdjList(n, edges, directed);
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  const deque: number[] = [src];
  const visited = new Array(n).fill(false);

  while (deque.length > 0) {
    const u = deque.shift() as number;
    if (visited[u]) continue;
    visited[u] = true;
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        if (w === 0) deque.unshift(v);
        else deque.push(v);
      }
    }
  }

  return dist.map((d) => (d === Infinity ? null : d));
}
