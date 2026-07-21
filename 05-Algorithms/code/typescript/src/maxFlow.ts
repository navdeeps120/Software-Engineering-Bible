import { AlgoError } from "./errors.js";
import { checkVertexInRange, type WeightedEdge } from "./graphCommon.js";

/**
 * Maximum flow from `s` to `t` via Edmonds-Karp: repeatedly find an
 * augmenting path with BFS over the residual graph (always the
 * fewest-hops path among residual-capacity-positive edges, exploring
 * neighbors in ascending vertex-id order for determinism), and push the
 * bottleneck capacity along it. O(V * E^2). Edge list is directed
 * (u -> v with the given capacity); parallel edges between the same pair
 * are summed into one residual-capacity entry. Throws AlgoError("invalid")
 * for negative capacities.
 */
export function maxFlow(n: number, edges: WeightedEdge[], s: number, t: number): number {
  checkVertexInRange(n, s);
  checkVertexInRange(n, t);
  const capacity: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const [u, v, c] of edges) {
    if (c < 0) throw new AlgoError("invalid", "maxFlow requires non-negative capacities");
    capacity[u][v] += c;
  }

  let totalFlow = 0;

  while (true) {
    const parent = new Array(n).fill(-1);
    parent[s] = s;
    const queue = [s];
    let head = 0;
    while (head < queue.length && parent[t] === -1) {
      const u = queue[head++];
      for (let v = 0; v < n; v++) {
        if (parent[v] === -1 && capacity[u][v] > 0) {
          parent[v] = u;
          queue.push(v);
        }
      }
    }
    if (parent[t] === -1) break;

    let bottleneck = Infinity;
    for (let v = t; v !== s; v = parent[v]) {
      bottleneck = Math.min(bottleneck, capacity[parent[v]][v]);
    }
    for (let v = t; v !== s; v = parent[v]) {
      capacity[parent[v]][v] -= bottleneck;
      capacity[v][parent[v]] += bottleneck;
    }
    totalFlow += bottleneck;
  }

  return totalFlow;
}
