import { AlgoError } from "./errors.js";

/**
 * 0/1 knapsack via bottom-up DP over a 1-D rolling capacity array (iterating
 * capacity descending per item to preserve the "0/1" -- no item reused --
 * property). Weights and capacity must be non-negative integers. O(n * W)
 * time and O(W) space.
 */
export function knapsack01(weights: number[], values: number[], capacity: number): number {
  if (weights.length !== values.length) throw new AlgoError("invalid", "weights and values must have equal length");
  if (capacity < 0 || !Number.isInteger(capacity)) throw new AlgoError("invalid", "capacity must be a non-negative integer");
  for (const w of weights) {
    if (w < 0 || !Number.isInteger(w)) throw new AlgoError("invalid", "weights must be non-negative integers");
  }

  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i];
    const v = values[i];
    for (let c = capacity; c >= w; c--) {
      const candidate = dp[c - w] + v;
      if (candidate > dp[c]) dp[c] = candidate;
    }
  }
  return dp[capacity];
}
