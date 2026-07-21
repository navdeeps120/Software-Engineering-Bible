"""Mirrors `typescript/src/maxFlow.ts` exactly."""

from __future__ import annotations

from typing import List, Sequence

from .errors import AlgoError
from .graph_common import check_vertex_in_range


def max_flow(n: int, edges: Sequence[Sequence[int]], s: int, t: int) -> int:
    """Maximum flow from s to t via Edmonds-Karp: BFS augmenting paths over
    the residual graph, exploring neighbors in ascending id order. O(V*E^2).
    Parallel edges are summed. Raises AlgoError("invalid") for negative
    capacities.
    """
    check_vertex_in_range(n, s)
    check_vertex_in_range(n, t)
    capacity: List[List[int]] = [[0] * n for _ in range(n)]
    for u, v, c in edges:
        if c < 0:
            raise AlgoError("invalid", "maxFlow requires non-negative capacities")
        capacity[u][v] += c

    total_flow = 0

    while True:
        parent = [-1] * n
        parent[s] = s
        queue = [s]
        head = 0
        while head < len(queue) and parent[t] == -1:
            u = queue[head]
            head += 1
            for v in range(n):
                if parent[v] == -1 and capacity[u][v] > 0:
                    parent[v] = u
                    queue.append(v)
        if parent[t] == -1:
            break

        bottleneck = float("inf")
        v = t
        while v != s:
            bottleneck = min(bottleneck, capacity[parent[v]][v])
            v = parent[v]
        v = t
        while v != s:
            capacity[parent[v]][v] -= bottleneck
            capacity[v][parent[v]] += bottleneck
            v = parent[v]
        total_flow += bottleneck

    return int(total_flow)
