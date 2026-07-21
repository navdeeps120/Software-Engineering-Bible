"""Mirrors `typescript/src/prim.ts` exactly."""

from __future__ import annotations

import math
from typing import Dict, List, Sequence

from .graph_common import build_weighted_adj_list


def prim(n: int, edges: Sequence[Sequence[int]]) -> Dict[str, object]:
    """Minimum spanning forest via Prim's algorithm: grows a tree from the
    lowest-id unvisited vertex, array-scan for the cheapest crossing edge
    each step. Ties broken by lower "to" id, then lower "from" id. Restarts
    on unvisited vertices to cover disconnected graphs. O(V^2 + E).
    """
    adj = build_weighted_adj_list(n, edges, False)
    in_tree = [False] * n
    chosen: List[List[int]] = []
    weight = 0

    for seed in range(n):
        if in_tree[seed]:
            continue
        in_tree[seed] = True
        for _ in range(n):
            best_from = -1
            best_to = -1
            best_weight = math.inf
            for u in range(n):
                if not in_tree[u]:
                    continue
                for v, w in adj[u]:
                    if in_tree[v]:
                        continue
                    if w < best_weight or (
                        w == best_weight and (best_to == -1 or v < best_to or (v == best_to and u < best_from))
                    ):
                        best_weight = w
                        best_from = u
                        best_to = v
            if best_to == -1:
                break
            in_tree[best_to] = True
            chosen.append([best_from, best_to, best_weight])
            weight += best_weight

    return {"weight": weight, "edges": chosen}
