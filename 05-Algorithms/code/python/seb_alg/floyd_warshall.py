"""Mirrors `typescript/src/floydWarshall.ts` exactly."""

from __future__ import annotations

import math
from typing import List, Optional, Sequence


def floyd_warshall(n: int, edges: Sequence[Sequence[int]], directed: bool = False) -> List[List[Optional[int]]]:
    """All-pairs shortest paths via the classic triple loop, O(V^3).
    Diagonal initialized to 0. Smallest parallel edge weight is kept.
    Unreachable pairs are None.
    """
    dist: List[List[float]] = [[math.inf] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    for u, v, w in edges:
        if w < dist[u][v]:
            dist[u][v] = w
        if not directed and w < dist[v][u]:
            dist[v][u] = w
    for k in range(n):
        for i in range(n):
            if dist[i][k] == math.inf:
                continue
            for j in range(n):
                if dist[k][j] == math.inf:
                    continue
                candidate = dist[i][k] + dist[k][j]
                if candidate < dist[i][j]:
                    dist[i][j] = candidate
    return [[None if d == math.inf else d for d in row] for row in dist]
