import { buildAdjList, type Edge } from "./graphCommon.js";

/**
 * Detects whether n-vertex graph has a cycle.
 *
 * - `directed=false`: a back-edge to an already-visited vertex that is not
 *   the immediate parent indicates a cycle (a parallel edge -- two vertices
 *   joined twice -- also counts, since it forms a length-2 cycle; the parent
 *   tracking is by edge occurrence, not just vertex, to catch that case).
 * - `directed=true`: uses the classic white/gray/black DFS coloring; a gray
 *   (on-stack) vertex reached again means a back-edge, i.e. a cycle.
 *
 * O(V + E).
 */
export function hasCycle(n: number, edges: Edge[], directed: boolean): boolean {
  const adj = buildAdjList(n, edges, directed);

  if (directed) {
    const color = new Array(n).fill(0); // 0=white,1=gray,2=black
    for (let start = 0; start < n; start++) {
      if (color[start] !== 0) continue;
      const stack: { u: number; i: number }[] = [{ u: start, i: 0 }];
      color[start] = 1;
      while (stack.length > 0) {
        const frame = stack[stack.length - 1];
        const neighbors = adj[frame.u];
        if (frame.i < neighbors.length) {
          const v = neighbors[frame.i++];
          if (color[v] === 1) return true;
          if (color[v] === 0) {
            color[v] = 1;
            stack.push({ u: v, i: 0 });
          }
        } else {
          color[frame.u] = 2;
          stack.pop();
        }
      }
    }
    return false;
  }

  const visited = new Array(n).fill(false);
  const parent = new Array(n).fill(-1);
  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;
    const stack: number[] = [start];
    visited[start] = true;
    while (stack.length > 0) {
      const u = stack.pop() as number;
      for (const v of adj[u]) {
        if (!visited[v]) {
          visited[v] = true;
          parent[v] = u;
          stack.push(v);
        } else if (v !== parent[u]) {
          return true;
        } else {
          // v === parent[u]: could still be a genuine cycle if there are
          // parallel edges between u and its parent; count occurrences.
          const occurrences = adj[u].filter((x) => x === v).length;
          if (occurrences > 1) return true;
        }
      }
    }
  }
  return false;
}
