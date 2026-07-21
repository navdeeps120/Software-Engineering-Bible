import { AlgoError } from "./errors.js";

/**
 * Counting sort for non-negative integers. Stable, O(n + k) time and space
 * where k is the maximum value. Throws AlgoError("invalid") if any element
 * is negative or non-integer. Returns a new array; does not mutate `arr`.
 */
export function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return [];
  let max = 0;
  for (const x of arr) {
    if (!Number.isInteger(x) || x < 0) throw new AlgoError("invalid", "countingSort requires non-negative integers");
    if (x > max) max = x;
  }
  const counts = new Array(max + 1).fill(0);
  for (const x of arr) counts[x]++;
  const out: number[] = [];
  for (let v = 0; v <= max; v++) {
    for (let c = 0; c < counts[v]; c++) out.push(v);
  }
  return out;
}
