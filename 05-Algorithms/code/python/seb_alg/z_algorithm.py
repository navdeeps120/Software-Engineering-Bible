"""Mirrors `typescript/src/zAlgorithm.ts` exactly."""

from __future__ import annotations

from typing import List


def z_algorithm(s: str) -> List[int]:
    """Z-array: z[i] is the longest common prefix length between s and
    s[i:]. z[0] is conventionally len(s). O(|s|).
    """
    n = len(s)
    z = [0] * n
    if n == 0:
        return z
    z[0] = n
    l, r = 0, 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z
