"""Disjoint-set over integers 0..n-1. Mirrors `typescript/src/unionFind.ts`."""

from __future__ import annotations

from typing import List

from .errors import DSError


class UnionFind:
    def __init__(self, n: int) -> None:
        if n < 0:
            raise DSError("invalid", "n must be >= 0")
        self._parent: List[int] = list(range(n))
        self._rank: List[int] = [0] * n
        self._components = n

    def _check_index(self, x: int) -> None:
        if x < 0 or x >= len(self._parent):
            raise DSError("index", f"index {x} out of bounds")

    def find(self, x: int) -> int:
        self._check_index(x)
        root = x
        while self._parent[root] != root:
            root = self._parent[root]
        while self._parent[x] != root:
            nxt = self._parent[x]
            self._parent[x] = root
            x = nxt
        return root

    def union(self, a: int, b: int) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return
        if self._rank[ra] < self._rank[rb]:
            self._parent[ra] = rb
        elif self._rank[ra] > self._rank[rb]:
            self._parent[rb] = ra
        else:
            self._parent[rb] = ra
            self._rank[ra] += 1
        self._components -= 1

    def connected(self, a: int, b: int) -> bool:
        return self.find(a) == self.find(b)

    def count(self) -> int:
        return self._components

    def check_invariants(self) -> None:
        roots = {self.find(i) for i in range(len(self._parent))}
        if len(roots) != self._components:
            raise DSError("invalid", "component count mismatch")
