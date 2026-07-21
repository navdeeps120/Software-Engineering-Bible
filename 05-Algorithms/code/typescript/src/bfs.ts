import { buildAdjList, checkVertexInRange, type Edge } from "./graphCommon.js";

/**
 * Breadth-first traversal from `src` over n vertices (0..n-1). Returns the
 * order vertices were first visited in, starting with `src`. Neighbors are
 * always explored in ascending vertex-id order (see buildAdjList), so the
 * result is fully deterministic. Unreached vertices are simply absent from
 * the result. O(V + E).
 */
export function bfs(n: number, edges: Edge[], src: number, directed = false): number[] {
  checkVertexInRange(n, src);
  const adj = buildAdjList(n, edges, directed);
  const visited = new Array(n).fill(false);
  const order: number[] = [];
  const queue: number[] = [src];
  visited[src] = true;
  let head = 0;
  while (head < queue.length) {
    const u = queue[head++];
    order.push(u);
    for (const v of adj[u]) {
      if (!visited[v]) {
        visited[v] = true;
        queue.push(v);
      }
    }
  }
  return order;
}
