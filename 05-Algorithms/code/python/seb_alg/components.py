"""Mirrors `typescript/src/components.ts` exactly."""

from __future__ import annotations

from typing import List, Sequence

from .graph_common import build_adj_list


def connected_components(n: int, edges: Sequence[Sequence[int]]) -> List[int]:
    """Labels the connected component of every vertex (0..n-1), treating the
    graph as undirected. Component ids are normalized to the minimum vertex
    id they contain, so labeling is deterministic. O(V + E).
    """
    adj = build_adj_list(n, edges, False)
    label = [-1] * n
    for start in range(n):
        if label[start] != -1:
            continue
        stack = [start]
        label[start] = start
        members = [start]
        while stack:
            u = stack.pop()
            for v in adj[u]:
                if label[v] == -1:
                    label[v] = start
                    members.append(v)
                    stack.append(v)
        min_id = min(members)
        for v in members:
            label[v] = min_id
    return label
