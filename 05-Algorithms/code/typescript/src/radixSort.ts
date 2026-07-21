import { AlgoError } from "./errors.js";

/**
 * LSD radix sort for non-negative integers, base 10. Stable at each digit
 * pass (uses counting sort as the stable subroutine), so the composition is
 * stable overall. O(d * (n + b)) where d is the number of digits and b=10 is
 * the base. Throws AlgoError("invalid") if any element is negative or
 * non-integer. Returns a new array; does not mutate `arr`.
 */
export function radixSort(arr: number[]): number[] {
  if (arr.length === 0) return [];
  let max = 0;
  for (const x of arr) {
    if (!Number.isInteger(x) || x < 0) throw new AlgoError("invalid", "radixSort requires non-negative integers");
    if (x > max) max = x;
  }
  let out = arr.slice();
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    for (const x of out) buckets[Math.floor(x / exp) % 10].push(x);
    out = buckets.flat();
    exp *= 10;
  }
  return out;
}
