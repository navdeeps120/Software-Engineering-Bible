import { type Edge } from "./graphCommon.js";

/** True if `arr` is sorted ascending (non-strict, duplicates allowed). */
export function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) if (arr[i - 1] > arr[i]) return false;
  return true;
}

/**
 * Verifies that `order` is a valid topological order for the directed graph
 * (n, edges): every vertex appears exactly once, and for every edge u -> v,
 * u appears before v.
 */
export function isValidTopo(n: number, edges: Edge[], order: number[]): boolean {
  if (order.length !== n) return false;
  const position = new Array(n).fill(-1);
  order.forEach((v, i) => {
    position[v] = i;
  });
  if (position.some((p) => p === -1)) return false;
  for (const [u, v] of edges) {
    if (position[u] > position[v]) return false;
  }
  return true;
}

/**
 * Verifies that `selection` is a valid (pairwise non-overlapping,
 * touching-endpoints allowed) set of intervals.
 */
export function isNonOverlapping(selection: { start: number; end: number }[]): boolean {
  const sorted = selection.slice().sort((a, b) => a.start - b.start);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start < sorted[i - 1].end) return false;
  }
  return true;
}

/** Verifies every leaf code in a Huffman table is a valid prefix-free code (no code is a prefix of another). */
export function isPrefixFree(codes: Record<string, string>): boolean {
  const values = Object.values(codes);
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values.length; j++) {
      if (i !== j && values[j].startsWith(values[i])) return false;
    }
  }
  return true;
}
