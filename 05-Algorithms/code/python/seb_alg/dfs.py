"""Mirrors `typescript/src/dfs.ts` exactly."""

from __future__ import annotations

from typing import List, Sequence

from .graph_common import build_adj_list, check_vertex_in_range


def dfs(n: int, edges: Sequence[Sequence[int]], src: int, directed: bool = False) -> List[int]:
    """Depth-first traversal from src, preorder. Iterative with explicit
    stack to avoid recursion-depth limits. O(V + E).
    """
    check_vertex_in_range(n, src)
    adj = build_adj_list(n, edges, directed)
    visited = [False] * n
    order: List[int] = []
    stack: List[int] = [src]
    while stack:
        u = stack.pop()
        if visited[u]:
            continue
        visited[u] = True
        order.append(u)
        neighbors = adj[u]
        for i in range(len(neighbors) - 1, -1, -1):
            if not visited[neighbors[i]]:
                stack.append(neighbors[i])
    return order
