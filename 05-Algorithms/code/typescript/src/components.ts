import { buildAdjList, type Edge } from "./graphCommon.js";

/**
 * Labels the connected component of every vertex (0..n-1), treating the
 * graph as undirected regardless of a `directed` flag on the input (the
 * notion of "connected component" is inherently undirected -- use
 * stronglyConnectedComponents for the directed analogue). To make the
 * labeling itself deterministic (independent of traversal order), every
 * component's id is normalized to the minimum vertex id it contains, so
 * `result[v] === v` for the smallest vertex in each component. O(V + E).
 */
export function connectedComponents(n: number, edges: Edge[]): number[] {
  const adj = buildAdjList(n, edges, false);
  const label = new Array(n).fill(-1);
  for (let start = 0; start < n; start++) {
    if (label[start] !== -1) continue;
    const stack = [start];
    label[start] = start;
    const members: number[] = [start];
    while (stack.length > 0) {
      const u = stack.pop() as number;
      for (const v of adj[u]) {
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
