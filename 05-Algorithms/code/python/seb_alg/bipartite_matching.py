"""Mirrors `typescript/src/bipartiteMatching.ts` exactly."""

from __future__ import annotations

from typing import List, Sequence

from .errors import AlgoError


def bipartite_matching(n_left: int, n_right: int, edges: Sequence[Sequence[int]]) -> int:
    """Maximum bipartite matching size via Kuhn's algorithm (DFS-based
    augmenting paths, left vertices and each DFS's candidates both explored
    in ascending id order for determinism). O(V * E).
    """
    adj: List[List[int]] = [[] for _ in range(n_left)]
    for l, r in edges:
        if l < 0 or l >= n_left or r < 0 or r >= n_right:
            raise AlgoError("index", "left/right vertex out of bounds")
        adj[l].append(r)
    for lst in adj:
        lst.sort()

    match_right = [-1] * n_right

    def try_augment(l: int, visited: List[bool]) -> bool:
        for r in adj[l]:
            if visited[r]:
                continue
            visited[r] = True
            if match_right[r] == -1 or try_augment(match_right[r], visited):
                match_right[r] = l
                return True
        return False

    matched = 0
    for l in range(n_left):
        visited = [False] * n_right
        if try_augment(l, visited):
            matched += 1
    return matched
