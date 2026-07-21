import { buildWeightedAdjList, type WeightedEdge } from "./graphCommon.js";
import { type MstResult } from "./kruskal.js";

/**
 * Minimum spanning forest via Prim's algorithm: grows a tree from the
 * lowest-id unvisited vertex, at each step adding the cheapest edge leaving
 * the current tree to an outside vertex (array-scan for the minimum, no
 * heap -- fine for this lab's graph sizes). Ties on edge weight are broken
 * by lower "to" vertex id, then lower "from" vertex id, keeping the result
 * deterministic. Restarts on the lowest-id unvisited vertex whenever the
 * current tree can't grow further, so disconnected graphs yield a full
 * minimum spanning forest (edges grouped by the order each component's
 * tree was grown, not sorted globally). O(V^2 + E).
 */
export function prim(n: number, edges: WeightedEdge[]): MstResult {
  const adj = buildWeightedAdjList(n, edges, false);
  const inTree = new Array(n).fill(false);
  const chosen: WeightedEdge[] = [];
  let weight = 0;

  for (let seed = 0; seed < n; seed++) {
    if (inTree[seed]) continue;
    inTree[seed] = true;
    for (let step = 0; step < n; step++) {
      let bestFrom = -1;
      let bestTo = -1;
      let bestWeight = Infinity;
      for (let u = 0; u < n; u++) {
        if (!inTree[u]) continue;
        for (const [v, w] of adj[u]) {
          if (inTree[v]) continue;
          if (w < bestWeight || (w === bestWeight && (bestTo === -1 || v < bestTo || (v === bestTo && u < bestFrom)))) {
            bestWeight = w;
            bestFrom = u;
            bestTo = v;
          }
        }
      }
      if (bestTo === -1) break;
      inTree[bestTo] = true;
      chosen.push([bestFrom, bestTo, bestWeight]);
      weight += bestWeight;
    }
  }

  return { weight, edges: chosen };
}
