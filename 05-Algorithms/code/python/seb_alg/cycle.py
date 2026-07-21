"""Mirrors `typescript/src/cycle.ts` exactly."""

from __future__ import annotations

from typing import List, Sequence

from .graph_common import build_adj_list


def has_cycle(n: int, edges: Sequence[Sequence[int]], directed: bool) -> bool:
    """Detects whether the n-vertex graph has a cycle.

    - directed=True: white/gray/black DFS coloring; a gray vertex reached
      again means a back-edge, i.e. a cycle.
    - directed=False: a back-edge to an already-visited non-parent vertex
      indicates a cycle; parallel edges to the parent also count (tracked
      via edge-occurrence count, not just vertex identity).

    O(V + E).
    """
    adj = build_adj_list(n, edges, directed)

    if directed:
        color = [0] * n  # 0=white,1=gray,2=black
        for start in range(n):
            if color[start] != 0:
                continue
            stack: List[List[int]] = [[start, 0]]
            color[start] = 1
            while stack:
                frame = stack[-1]
                u, i = frame[0], frame[1]
                neighbors = adj[u]
                if i < len(neighbors):
                    v = neighbors[i]
                    frame[1] += 1
                    if color[v] == 1:
                        return True
                    if color[v] == 0:
                        color[v] = 1
                        stack.append([v, 0])
                else:
                    color[u] = 2
                    stack.pop()
        return False

    visited = [False] * n
    parent = [-1] * n
    for start in range(n):
        if visited[start]:
            continue
        stack = [start]
        visited[start] = True
        while stack:
            u = stack.pop()
            for v in adj[u]:
                if not visited[v]:
                    visited[v] = True
                    parent[v] = u
                    stack.append(v)
                elif v != parent[u]:
                    return True
                else:
                    occurrences = sum(1 for x in adj[u] if x == v)
                    if occurrences > 1:
                        return True
    return False
