"""Mirrors `typescript/src/bellmanFord.ts` exactly."""

from __future__ import annotations

import math
from typing import Dict, List, Optional, Sequence, Tuple

from .graph_common import check_vertex_in_range


def bellman_ford(
    n: int, edges: Sequence[Sequence[int]], src: int, directed: bool = False
) -> Dict[str, object]:
    """Single-source shortest paths tolerant of negative weights.

    Relaxes every edge n-1 times (in the exact order given), then one more
    pass: if any edge still relaxes, a negative-weight cycle is reachable
    from src. When detected, `dist` is reported as None for every vertex.
    Unreachable vertices are also None. O(V * E).
    """
    check_vertex_in_range(n, src)
    directed_edges: List[Tuple[int, int, int]] = []
    for u, v, w in edges:
        directed_edges.append((u, v, w))
        if not directed:
            directed_edges.append((v, u, w))

    dist: List[float] = [math.inf] * n
    dist[src] = 0

    for _ in range(n - 1):
        changed = False
        for u, v, w in directed_edges:
            if dist[u] != math.inf and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                changed = True
        if not changed:
            break

    negative_cycle = False
    for u, v, w in directed_edges:
        if dist[u] != math.inf and dist[u] + w < dist[v]:
            negative_cycle = True
            break

    if negative_cycle:
        return {"dist": [None] * n, "negativeCycle": True}
    return {"dist": [None if d == math.inf else d for d in dist], "negativeCycle": False}
