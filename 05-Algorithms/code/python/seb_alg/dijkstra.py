"""Mirrors `typescript/src/dijkstra.ts` exactly."""

from __future__ import annotations

import math
from typing import List, Optional, Sequence

from .errors import AlgoError
from .graph_common import build_weighted_adj_list, check_vertex_in_range


def dijkstra(n: int, edges: Sequence[Sequence[int]], src: int, directed: bool = False) -> List[Optional[int]]:
    """Single-source shortest paths, O(V^2 + E) array-scan Dijkstra.
    Requires non-negative weights. Unreachable vertices are None.
    """
    check_vertex_in_range(n, src)
    for _, _, w in edges:
        if w < 0:
            raise AlgoError("invalid", "dijkstra requires non-negative edge weights")
    adj = build_weighted_adj_list(n, edges, directed)
    dist: List[float] = [math.inf] * n
    dist[src] = 0
    visited = [False] * n

    for _ in range(n):
        u = -1
        for v in range(n):
            if not visited[v] and dist[v] < math.inf and (u == -1 or dist[v] < dist[u]):
                u = v
        if u == -1:
            break
        visited[u] = True
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w

    return [None if d == math.inf else d for d in dist]
