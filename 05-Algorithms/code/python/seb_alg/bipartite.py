"""Mirrors `typescript/src/bipartite.ts` exactly."""

from __future__ import annotations

from typing import Sequence

from .graph_common import build_adj_list


def is_bipartite(n: int, edges: Sequence[Sequence[int]]) -> bool:
    """Checks whether the undirected graph is 2-colorable via BFS. O(V + E)."""
    adj = build_adj_list(n, edges, False)
    color = [-1] * n
    for start in range(n):
        if color[start] != -1:
            continue
        color[start] = 0
        queue = [start]
        head = 0
        while head < len(queue):
            u = queue[head]
            head += 1
            for v in adj[u]:
                if color[v] == -1:
                    color[v] = 1 - color[u]
                    queue.append(v)
                elif color[v] == color[u]:
                    return False
    return True
