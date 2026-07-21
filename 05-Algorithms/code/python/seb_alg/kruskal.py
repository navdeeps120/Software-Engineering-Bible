"""Mirrors `typescript/src/kruskal.ts` exactly."""

from __future__ import annotations

from typing import Dict, List, Sequence, Tuple


class _DisjointSet:
    def __init__(self, n: int) -> None:
        self.parent = list(range(n))

    def find(self, x: int) -> int:
        while self.parent[x] != x:
            x = self.parent[x]
        return x

    def union(self, a: int, b: int) -> bool:
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if ra < rb:
            self.parent[rb] = ra
        else:
            self.parent[ra] = rb
        return True


def kruskal(n: int, edges: Sequence[Sequence[int]]) -> Dict[str, object]:
    """Minimum spanning forest via Kruskal's algorithm: sort edges ascending
    by (weight, u, v), greedily add each edge connecting two different
    components. O(E log E).
    """
    sorted_edges: List[Tuple[int, int, int]] = sorted(
        ((u, v, w) for u, v, w in edges), key=lambda e: (e[2], e[0], e[1])
    )
    dsu = _DisjointSet(n)
    chosen: List[List[int]] = []
    weight = 0
    for u, v, w in sorted_edges:
        if dsu.union(u, v):
            chosen.append([u, v, w])
            weight += w
    return {"weight": weight, "edges": chosen}
