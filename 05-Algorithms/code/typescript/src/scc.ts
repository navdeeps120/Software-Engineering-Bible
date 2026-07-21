import { buildAdjList, type Edge } from "./graphCommon.js";

/**
 * Kosaraju's algorithm: two passes of DFS (once over the graph, once over
 * its transpose) partition a directed graph on n vertices into strongly
 * connected components. Every DFS explores neighbors in ascending id order,
 * so the finishing-time stack (and therefore which component absorbs which
 * vertices) is deterministic. The resulting component ids are then
 * normalized to the minimum vertex id within each component, so the labels
 * themselves don't depend on algorithm-internal traversal order either.
 * O(V + E).
 */
export function stronglyConnectedComponents(n: number, edges: Edge[]): number[] {
  const adj = buildAdjList(n, edges, true);
  const rev: number[][] = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) for (const v of adj[u]) rev[v].push(u);
  for (const list of rev) list.sort((a, b) => a - b);

  const visited = new Array(n).fill(false);
  const finishOrder: number[] = [];

  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;
    const stack: { u: number; i: number }[] = [{ u: start, i: 0 }];
    visited[start] = true;
    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const neighbors = adj[frame.u];
      if (frame.i < neighbors.length) {
        const v = neighbors[frame.i++];
        if (!visited[v]) {
          visited[v] = true;
          stack.push({ u: v, i: 0 });
        }
      } else {
        finishOrder.push(frame.u);
        stack.pop();
      }
    }
  }

  const label = new Array(n).fill(-1);
  for (let i = finishOrder.length - 1; i >= 0; i--) {
    const start = finishOrder[i];
    if (label[start] !== -1) continue;
    const members: number[] = [start];
    label[start] = start;
    const stack = [start];
    while (stack.length > 0) {
      const u = stack.pop() as number;
      for (const v of rev[u]) {
        if (label[v] === -1) {
          label[v] = start;
          members.push(v);
          stack.push(v);
        }
      }
    }
    const minId = Math.min(...members);
    for (const v of members) label[v] = minId;
  }
  return label;
}
