"""Mirrors `typescript/src/bfs.ts` exactly."""

from __future__ import annotations

from typing import List, Sequence

from .graph_common import build_adj_list, check_vertex_in_range


def bfs(n: int, edges: Sequence[Sequence[int]], src: int, directed: bool = False) -> List[int]:
    """Breadth-first traversal from src. Returns visit order. O(V + E)."""
    check_vertex_in_range(n, src)
    adj = build_adj_list(n, edges, directed)
    visited = [False] * n
    order: List[int] = []
    queue: List[int] = [src]
    visited[src] = True
    head = 0
    while head < len(queue):
        u = queue[head]
        head += 1
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                queue.append(v)
    return order
