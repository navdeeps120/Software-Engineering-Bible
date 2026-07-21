"""Mirrors `typescript/src/scc.ts` exactly."""

from __future__ import annotations

from typing import List, Sequence

from .graph_common import build_adj_list


def strongly_connected_components(n: int, edges: Sequence[Sequence[int]]) -> List[int]:
    """Kosaraju's algorithm: two DFS passes (graph, then transpose)
    partition a directed graph into SCCs. Every DFS explores neighbors in
    ascending id order for a deterministic finishing-time stack. Resulting
    component ids are normalized to the minimum vertex id per component.
    O(V + E).
    """
    adj = build_adj_list(n, edges, True)
    rev: List[List[int]] = [[] for _ in range(n)]
    for u in range(n):
        for v in adj[u]:
            rev[v].append(u)
    for lst in rev:
        lst.sort()

    visited = [False] * n
    finish_order: List[int] = []

    for start in range(n):
        if visited[start]:
            continue
        stack: List[List[int]] = [[start, 0]]
        visited[start] = True
        while stack:
            frame = stack[-1]
            u, i = frame[0], frame[1]
            neighbors = adj[u]
            if i < len(neighbors):
                v = neighbors[i]
                frame[1] += 1
                if not visited[v]:
                    visited[v] = True
                    stack.append([v, 0])
            else:
                finish_order.append(u)
                stack.pop()

    label = [-1] * n
    for i in range(len(finish_order) - 1, -1, -1):
        start = finish_order[i]
        if label[start] != -1:
            continue
        members = [start]
        label[start] = start
        stack = [start]
        while stack:
            u = stack.pop()
            for v in rev[u]:
                if label[v] == -1:
                    label[v] = start
                    members.append(v)
                    stack.append(v)
        min_id = min(members)
        for v in members:
            label[v] = min_id
    return label
