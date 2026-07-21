import { AlgoError } from "./errors.js";

/**
 * Classic binary search over an ascending-sorted array. Returns the index of
 * `x` if present, otherwise -1. O(log n).
 *
 * Does not deduplicate: if `x` appears multiple times, any one of its
 * indices may be returned (implementation returns the first one the probe
 * sequence lands on, which is deterministic for a given array but not
 * necessarily the lowest or highest occurrence -- use lowerBound/upperBound
 * when occurrence position matters).
 */
export function binarySearch(arr: number[], x: number): number {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] === x) return mid;
    if (arr[mid] < x) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

/**
 * Returns the index of the first element >= x (i.e. the insertion point that
 * keeps the array sorted and places x before any equal elements). Equal to
 * `arr.length` if every element is < x. O(log n).
 */
export function lowerBound(arr: number[], x: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * Returns the index of the first element > x (i.e. the insertion point that
 * keeps the array sorted and places x after any equal elements). Equal to
 * `arr.length` if every element is <= x. O(log n).
 */
export function upperBound(arr: number[], x: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] <= x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * "Binary search on the answer": given a predicate that is `false` on some
 * prefix of [lo, hi] and `true` on the remaining suffix (monotonic in the
 * boolean sense), finds the smallest x in [lo, hi] for which predicate(x) is
 * true. Throws AlgoError("not_found") if predicate(hi) is false (no feasible
 * answer exists in range). O(log(hi - lo) * cost(predicate)).
 */
export function binarySearchAnswer(lo: number, hi: number, predicate: (x: number) => boolean): number {
  if (lo > hi) throw new AlgoError("invalid", "lo must be <= hi");
  if (!predicate(hi)) throw new AlgoError("not_found", "predicate is false across the entire range");
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (predicate(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
