import { buildAdjList, checkVertexInRange, type Edge } from "./graphCommon.js";

/**
 * Depth-first traversal from `src` over n vertices (0..n-1). Returns
 * vertices in preorder (a vertex is appended the moment it is first
 * visited, before recursing into its neighbors). Neighbors are always
 * explored in ascending vertex-id order, so the result is fully
 * deterministic. Implemented iteratively with an explicit stack to avoid
 * recursion-depth limits. O(V + E).
 */
export function dfs(n: number, edges: Edge[], src: number, directed = false): number[] {
  checkVertexInRange(n, src);
  const adj = buildAdjList(n, edges, directed);
  const visited = new Array(n).fill(false);
  const order: number[] = [];
  const stack: number[] = [src];
  while (stack.length > 0) {
    const u = stack.pop() as number;
    if (visited[u]) continue;
    visited[u] = true;
    order.push(u);
    const neighbors = adj[u];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      if (!visited[neighbors[i]]) stack.push(neighbors[i]);
    }
  }
  return order;
}
