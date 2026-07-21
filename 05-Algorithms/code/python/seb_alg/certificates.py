"""Mirrors `typescript/src/certificates.ts` exactly."""

from __future__ import annotations

from typing import Dict, List, Sequence


def is_sorted(arr: Sequence[int]) -> bool:
    """True if arr is sorted ascending (non-strict, duplicates allowed)."""
    return all(arr[i - 1] <= arr[i] for i in range(1, len(arr)))


def is_valid_topo(n: int, edges: Sequence[Sequence[int]], order: Sequence[int]) -> bool:
    """Verifies order is a valid topological order for the directed graph."""
    if len(order) != n:
        return False
    position = [-1] * n
    for i, v in enumerate(order):
        position[v] = i
    if any(p == -1 for p in position):
        return False
    for u, v in edges:
        if position[u] > position[v]:
            return False
    return True


def is_non_overlapping(selection: Sequence[Dict[str, int]]) -> bool:
    """Verifies selection is a valid non-overlapping (touching ok) set of intervals."""
    sorted_sel = sorted(selection, key=lambda iv: iv["start"])
    for i in range(1, len(sorted_sel)):
        if sorted_sel[i]["start"] < sorted_sel[i - 1]["end"]:
            return False
    return True


def is_prefix_free(codes: Dict[str, str]) -> bool:
    """Verifies no Huffman code is a prefix of another."""
    values = list(codes.values())
    for i in range(len(values)):
        for j in range(len(values)):
            if i != j and values[j].startswith(values[i]):
                return False
    return True
