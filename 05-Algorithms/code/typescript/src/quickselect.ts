import { AlgoError } from "./errors.js";

/**
 * Deterministic Lomuto-partition quickselect (last element as pivot) that
 * finds the k-th smallest element (0-based) of `arr` in expected O(n), worst
 * case O(n^2). Does not mutate the input; operates on a defensive copy.
 * Ties (equal values) are indistinguishable -- any element with the correct
 * rank value is a valid answer, and this implementation is deterministic
 * given a fixed input array (no randomized pivot), so it is safe to pin
 * exact outputs in vectors.
 */
export function quickselect(arr: number[], k: number): number {
  if (k < 0 || k >= arr.length) throw new AlgoError("index", `k=${k} out of bounds for length ${arr.length}`);
  const a = arr.slice();

  function partition(lo: number, hi: number): number {
    const pivot = a[hi];
    let store = lo;
    for (let i = lo; i < hi; i++) {
      if (a[i] < pivot) {
        [a[i], a[store]] = [a[store], a[i]];
        store++;
      }
    }
    [a[store], a[hi]] = [a[hi], a[store]];
    return store;
  }

  let lo = 0;
  let hi = a.length - 1;
  while (true) {
    if (lo === hi) return a[lo];
    const p = partition(lo, hi);
    if (p === k) return a[p];
    if (p < k) lo = p + 1;
    else hi = p - 1;
  }
}

/**
 * Returns the k smallest elements of `arr` sorted ascending. Uses
 * quickselect to partition around the k-th smallest, then sorts the
 * resulting prefix. O(n) average, O(k log k) for the final sort.
 */
export function topK(arr: number[], k: number): number[] {
  if (k < 0 || k > arr.length) throw new AlgoError("index", `k=${k} out of bounds for length ${arr.length}`);
  if (k === 0) return [];
  const a = arr.slice();

  function partition(lo: number, hi: number): number {
    const pivot = a[hi];
    let store = lo;
    for (let i = lo; i < hi; i++) {
      if (a[i] < pivot) {
        [a[i], a[store]] = [a[store], a[i]];
        store++;
      }
    }
    [a[store], a[hi]] = [a[hi], a[store]];
    return store;
  }

  let lo = 0;
  let hi = a.length - 1;
  const target = k - 1;
  while (lo < hi) {
    const p = partition(lo, hi);
    if (p === target) break;
    if (p < target) lo = p + 1;
    else hi = p - 1;
  }
  return a.slice(0, k).sort((x, y) => x - y);
}
