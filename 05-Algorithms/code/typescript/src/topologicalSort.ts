import { AlgoError } from "./errors.js";
import { buildAdjList, type Edge } from "./graphCommon.js";

/**
 * Kahn's algorithm (BFS by in-degree) over a directed graph on n vertices.
 * Among all vertices with in-degree 0 at any given step, the lowest id is
 * always removed first, which makes the returned order fully deterministic
 * (not just "any valid topological order"). Throws AlgoError("cycle") if
 * the graph is not a DAG (fewer than n vertices get emitted). O(V + E log V)
 * due to the tie-breaking min-priority queue (a simple sorted-array stand-in
 * is used here since n is small in this lab; a real binary heap would drop
 * this to O(V + E)).
 */
export function topologicalSort(n: number, edges: Edge[]): number[] {
  const adj = buildAdjList(n, edges, true);
  const indegree = new Array(n).fill(0);
  for (const list of adj) for (const v of list) indegree[v]++;

  const available: number[] = [];
  for (let v = 0; v < n; v++) if (indegree[v] === 0) available.push(v);
  available.sort((a, b) => a - b);

  const order: number[] = [];
  while (available.length > 0) {
    const u = available.shift() as number;
    order.push(u);
    for (const v of adj[u]) {
      indegree[v]--;
      if (indegree[v] === 0) {
        const pos = available.findIndex((x) => x > v);
        if (pos === -1) available.push(v);
        else available.splice(pos, 0, v);
      }
    }
  }

  if (order.length !== n) throw new AlgoError("cycle", "graph contains a cycle; no topological order exists");
  return order;
}
