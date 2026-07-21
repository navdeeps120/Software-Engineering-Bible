"""Mirrors `typescript/src/knapsack.ts`, `lcs.ts`, and `editDistance.ts` exactly."""

from __future__ import annotations

from typing import List, Sequence

from .errors import AlgoError


def knapsack01(weights: Sequence[int], values: Sequence[int], capacity: int) -> int:
    """0/1 knapsack via bottom-up DP over a 1-D rolling capacity array
    (iterating capacity descending per item to preserve the "0/1" -- no
    item reused -- property). O(n * W) time, O(W) space.
    """
    if len(weights) != len(values):
        raise AlgoError("invalid", "weights and values must have equal length")
    if capacity < 0 or not isinstance(capacity, int):
        raise AlgoError("invalid", "capacity must be a non-negative integer")
    for w in weights:
        if w < 0 or not isinstance(w, int):
            raise AlgoError("invalid", "weights must be non-negative integers")

    dp = [0] * (capacity + 1)
    for w, v in zip(weights, values):
        for c in range(capacity, w - 1, -1):
            candidate = dp[c - w] + v
            if candidate > dp[c]:
                dp[c] = candidate
    return dp[capacity]


def lcs(a: str, b: str) -> int:
    """Length of the longest common subsequence via bottom-up DP. O(|a|*|b|)."""
    n, m = len(a), len(b)
    dp: List[List[int]] = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]


def edit_distance(a: str, b: str) -> int:
    """Levenshtein edit distance (insert/delete/substitute cost 1). O(|a|*|b|)."""
    n, m = len(a), len(b)
    dp: List[List[int]] = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]
