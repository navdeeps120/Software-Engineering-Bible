import { AlgoError } from "./errors.js";

/**
 * Maximum bipartite matching size via Kuhn's algorithm (DFS-based
 * augmenting paths, one per left vertex, processed in ascending id order;
 * each DFS also tries right-vertex candidates in ascending id order, so the
 * specific matching found -- and therefore its size, which is all that's
 * asserted in vectors -- is deterministic). `edges` are `[left, right]`
 * pairs with `left` in `[0, nLeft)` and `right` in `[0, nRight)`. O(V * E).
 */
export function bipartiteMatching(nLeft: number, nRight: number, edges: [number, number][]): number {
  const adj: number[][] = Array.from({ length: nLeft }, () => []);
  for (const [l, r] of edges) {
    if (l < 0 || l >= nLeft || r < 0 || r >= nRight) throw new AlgoError("index", "left/right vertex out of bounds");
    adj[l].push(r);
  }
  for (const list of adj) list.sort((a, b) => a - b);

  const matchRight = new Array(nRight).fill(-1);

  function tryAugment(l: number, visited: boolean[]): boolean {
    for (const r of adj[l]) {
      if (visited[r]) continue;
      visited[r] = true;
      if (matchRight[r] === -1 || tryAugment(matchRight[r], visited)) {
        matchRight[r] = l;
        return true;
      }
    }
    return false;
  }

  let matched = 0;
  for (let l = 0; l < nLeft; l++) {
    const visited = new Array(nRight).fill(false);
    if (tryAugment(l, visited)) matched++;
  }
  return matched;
}
