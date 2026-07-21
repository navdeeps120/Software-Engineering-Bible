"""Mirrors `typescript/src/graphCommon.ts` exactly."""

from __future__ import annotations

from typing import List, Sequence, Tuple

from .errors import AlgoError

Edge = Tuple[int, int]
WeightedEdge = Tuple[int, int, int]


def _check_vertex(n: int, v: int) -> None:
    if not isinstance(v, int) or v < 0 or v >= n:
        raise AlgoError("index", f"vertex {v} out of bounds for n={n}")


def check_vertex_in_range(n: int, v: int) -> None:
    """Exported so entry-point algorithms (bfs, dijkstra, maxFlow, ...) can validate a standalone src/s/t parameter."""
    _check_vertex(n, v)


def build_adj_list(n: int, edges: Sequence[Sequence[int]], directed: bool) -> List[List[int]]:
    """Adjacency list for n vertices (0..n-1) from an unweighted edge list.

    Each vertex's neighbor list is sorted ascending, which is what gives
    every traversal in this lab a deterministic, language-agnostic visiting
    order: "lower vertex id wins" ties. Multi-edges are preserved.
    """
    if n < 0:
        raise AlgoError("invalid", "n must be >= 0")
    adj: List[List[int]] = [[] for _ in range(n)]
    for u, v in edges:
        _check_vertex(n, u)
        _check_vertex(n, v)
        adj[u].append(v)
        if not directed:
            adj[v].append(u)
    for lst in adj:
        lst.sort()
    return adj


def build_weighted_adj_list(
    n: int, edges: Sequence[Sequence[int]], directed: bool
) -> List[List[Tuple[int, int]]]:
    """Weighted counterpart of build_adj_list; each entry is (neighbor, weight)."""
    if n < 0:
        raise AlgoError("invalid", "n must be >= 0")
    adj: List[List[Tuple[int, int]]] = [[] for _ in range(n)]
    for u, v, w in edges:
        _check_vertex(n, u)
        _check_vertex(n, v)
        adj[u].append((v, w))
        if not directed:
            adj[v].append((u, w))
    for lst in adj:
        lst.sort(key=lambda pair: (pair[0], pair[1]))
    return adj
