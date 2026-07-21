"""Mirrors `typescript/src/bridges.ts` exactly."""

from __future__ import annotations

from typing import List, Sequence, Tuple


def bridges(n: int, edges: Sequence[Sequence[int]]) -> List[List[int]]:
    """Finds every bridge in an undirected graph via discovery-time /
    low-link DFS (iterative). Each bridge is [min(u,v), max(u,v)], overall
    list sorted ascending. Parallel edges are never bridges, tracked via
    edge index (not just parent vertex) to distinguish them. O(V + E).
    """
    adj: List[List[Tuple[int, int]]] = [[] for _ in range(n)]
    for edge_id, (u, v) in enumerate(edges):
        adj[u].append((v, edge_id))
        adj[v].append((u, edge_id))
    for lst in adj:
        lst.sort(key=lambda pair: pair[0])

    disc = [-1] * n
    low = [-1] * n
    timer = 0
    bridge_edge_ids = set()

    for start in range(n):
        if disc[start] != -1:
            continue
        stack = [[start, -1, 0]]
        disc[start] = low[start] = timer
        timer += 1
        while stack:
            frame = stack[-1]
            u, parent_edge_id, i = frame[0], frame[1], frame[2]
            neighbors = adj[u]
            if i < len(neighbors):
                v, edge_id = neighbors[i]
                frame[2] += 1
                if edge_id == parent_edge_id:
                    continue
                if disc[v] == -1:
                    disc[v] = low[v] = timer
                    timer += 1
                    stack.append([v, edge_id, 0])
                else:
                    low[u] = min(low[u], disc[v])
            else:
                stack.pop()
                if stack:
                    parent_frame = stack[-1]
                    pu = parent_frame[0]
                    low[pu] = min(low[pu], low[u])
                    if low[u] > disc[pu]:
                        bridge_edge_ids.add(parent_edge_id)

    result: List[List[int]] = []
    for edge_id, (u, v) in enumerate(edges):
        if edge_id in bridge_edge_ids:
            result.append([u, v] if u < v else [v, u])
    result.sort(key=lambda e: (e[0], e[1]))
    return result
