"""Undirected graphs (adjacency list and adjacency matrix). Mirrors `typescript/src/graph.ts`."""

from __future__ import annotations

from typing import Dict, List, Set

from .errors import DSError


class AdjListGraph:
    def __init__(self) -> None:
        self._adj: Dict[str, Set[str]] = {}

    def add_vertex(self, v: str) -> None:
        if v not in self._adj:
            self._adj[v] = set()

    def add_edge(self, u: str, v: str) -> None:
        self.add_vertex(u)
        self.add_vertex(v)
        self._adj[u].add(v)
        self._adj[v].add(u)

    def neighbors(self, v: str) -> List[str]:
        if v not in self._adj:
            raise DSError("missing", f"vertex {v} not found")
        return sorted(self._adj[v])

    def vertex_count(self) -> int:
        return len(self._adj)

    def edge_count(self) -> int:
        total = sum(len(s) for s in self._adj.values())
        return total // 2

    def check_invariants(self) -> None:
        for v, neighbors in self._adj.items():
            for n in neighbors:
                if v not in self._adj.get(n, set()):
                    raise DSError("invalid", "asymmetric adjacency entry")


class AdjMatrixGraph:
    def __init__(self, n: int) -> None:
        if n < 0:
            raise DSError("invalid", "n must be >= 0")
        self._n = n
        self._matrix: List[List[bool]] = [[False] * n for _ in range(n)]

    def add_vertex(self) -> int:
        for row in self._matrix:
            row.append(False)
        self._matrix.append([False] * (self._n + 1))
        self._n += 1
        return self._n - 1

    def _check_vertex(self, v: int) -> None:
        if v < 0 or v >= self._n:
            raise DSError("index", f"vertex {v} out of bounds")

    def add_edge(self, u: int, v: int) -> None:
        self._check_vertex(u)
        self._check_vertex(v)
        self._matrix[u][v] = True
        self._matrix[v][u] = True

    def neighbors(self, v: int) -> List[int]:
        self._check_vertex(v)
        return [i for i in range(self._n) if self._matrix[v][i]]

    def vertex_count(self) -> int:
        return self._n

    def edge_count(self) -> int:
        count = 0
        for i in range(self._n):
            for j in range(i + 1, self._n):
                if self._matrix[i][j]:
                    count += 1
        return count

    def check_invariants(self) -> None:
        for i in range(self._n):
            if len(self._matrix[i]) != self._n:
                raise DSError("invalid", "matrix row length mismatch")
            for j in range(self._n):
                if self._matrix[i][j] != self._matrix[j][i]:
                    raise DSError("invalid", "asymmetric matrix entry")
