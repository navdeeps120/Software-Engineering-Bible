"""Mirrors `typescript/src/topologicalSort.ts` exactly."""

from __future__ import annotations

import bisect
from typing import List, Sequence

from .errors import AlgoError
from .graph_common import build_adj_list


def topological_sort(n: int, edges: Sequence[Sequence[int]]) -> List[int]:
    """Kahn's algorithm (BFS by in-degree). Among all zero-in-degree
    vertices at any step, the lowest id is always removed first, making the
    order fully deterministic. Raises AlgoError("cycle") if not a DAG.
    O(V + E log V) due to the sorted-array tie-breaking structure.
    """
    adj = build_adj_list(n, edges, True)
    indegree = [0] * n
    for lst in adj:
        for v in lst:
            indegree[v] += 1

    available: List[int] = sorted(v for v in range(n) if indegree[v] == 0)

    order: List[int] = []
    while available:
        u = available.pop(0)
        order.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                bisect.insort(available, v)

    if len(order) != n:
        raise AlgoError("cycle", "graph contains a cycle; no topological order exists")
    return order
