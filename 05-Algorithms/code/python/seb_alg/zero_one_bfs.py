"""Mirrors `typescript/src/zeroOneBfs.ts` exactly."""

from __future__ import annotations

import math
from collections import deque
from typing import List, Optional, Sequence

from .errors import AlgoError
from .graph_common import build_weighted_adj_list, check_vertex_in_range


def zero_one_bfs(n: int, edges: Sequence[Sequence[int]], src: int, directed: bool = False) -> List[Optional[int]]:
    """0-1 BFS via deque (0-weight edges pushed front, 1-weight pushed back).
    O(V + E). Requires weights in {0, 1}. Unreachable vertices are None.
    """
    check_vertex_in_range(n, src)
    for _, _, w in edges:
        if w != 0 and w != 1:
            raise AlgoError("invalid", "zeroOneBfs requires weights in {0, 1}")
    adj = build_weighted_adj_list(n, edges, directed)
    dist: List[float] = [math.inf] * n
    dist[src] = 0
    dq: deque = deque([src])
    visited = [False] * n

    while dq:
        u = dq.popleft()
        if visited[u]:
            continue
        visited[u] = True
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if w == 0:
                    dq.appendleft(v)
                else:
                    dq.append(v)

    return [None if d == math.inf else d for d in dist]
