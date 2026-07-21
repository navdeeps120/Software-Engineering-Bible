import { buildAdjList, type Edge } from "./graphCommon.js";

/**
 * Finds every bridge (an edge whose removal disconnects the graph) in an
 * undirected graph on n vertices, via the standard discovery-time / low-link
 * DFS. Implemented iteratively to avoid recursion-depth limits. Each bridge
 * is returned as `[min(u,v), max(u,v)]`, and the overall list is sorted
 * ascending, so the output is independent of DFS traversal order and of
 * input edge order. Parallel edges between the same pair are never
 * bridges (removing one still leaves the other), which this implementation
 * accounts for by tracking the edge index used to enter each vertex rather
 * than just the parent vertex. O(V + E).
 */
export function bridges(n: number, edges: Edge[]): Edge[] {
  // Build an adjacency list of (neighbor, edgeId) pairs so parallel edges
  // are distinguishable from one another.
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  edges.forEach(([u, v], edgeId) => {
    adj[u].push([v, edgeId]);
    adj[v].push([u, edgeId]);
  });
  for (const list of adj) list.sort((a, b) => a[0] - b[0]);

  const disc = new Array(n).fill(-1);
  const low = new Array(n).fill(-1);
  let timer = 0;
  const bridgeEdgeIds = new Set<number>();

  for (let start = 0; start < n; start++) {
    if (disc[start] !== -1) continue;
    const stack: { u: number; parentEdgeId: number; i: number }[] = [{ u: start, parentEdgeId: -1, i: 0 }];
    disc[start] = low[start] = timer++;
    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const neighbors = adj[frame.u];
      if (frame.i < neighbors.length) {
        const [v, edgeId] = neighbors[frame.i++];
        if (edgeId === frame.parentEdgeId) continue;
        if (disc[v] === -1) {
          disc[v] = low[v] = timer++;
          stack.push({ u: v, parentEdgeId: edgeId, i: 0 });
        } else {
          low[frame.u] = Math.min(low[frame.u], disc[v]);
        }
      } else {
        stack.pop();
        if (stack.length > 0) {
          const parentFrame = stack[stack.length - 1];
          low[parentFrame.u] = Math.min(low[parentFrame.u], low[frame.u]);
          if (low[frame.u] > disc[parentFrame.u]) bridgeEdgeIds.add(frame.parentEdgeId);
        }
      }
    }
  }

  const result: Edge[] = [];
  edges.forEach(([u, v], edgeId) => {
    if (bridgeEdgeIds.has(edgeId)) result.push(u < v ? [u, v] : [v, u]);
  });
  result.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
  return result;
}
