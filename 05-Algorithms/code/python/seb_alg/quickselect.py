"""Mirrors `typescript/src/quickselect.ts` exactly."""

from __future__ import annotations

from typing import List, Sequence

from .errors import AlgoError


def quickselect(arr: Sequence[int], k: int) -> int:
    """Deterministic Lomuto-partition quickselect for the k-th smallest (0-based).

    Expected O(n), worst case O(n^2). Does not mutate the input.
    """
    if k < 0 or k >= len(arr):
        raise AlgoError("index", f"k={k} out of bounds for length {len(arr)}")
    a = list(arr)

    def partition(lo: int, hi: int) -> int:
        pivot = a[hi]
        store = lo
        for i in range(lo, hi):
            if a[i] < pivot:
                a[i], a[store] = a[store], a[i]
                store += 1
        a[store], a[hi] = a[hi], a[store]
        return store

    lo, hi = 0, len(a) - 1
    while True:
        if lo == hi:
            return a[lo]
        p = partition(lo, hi)
        if p == k:
            return a[p]
        if p < k:
            lo = p + 1
        else:
            hi = p - 1


def top_k(arr: Sequence[int], k: int) -> List[int]:
    """k smallest elements of `arr`, sorted ascending. O(n) average."""
    if k < 0 or k > len(arr):
        raise AlgoError("index", f"k={k} out of bounds for length {len(arr)}")
    if k == 0:
        return []
    a = list(arr)

    def partition(lo: int, hi: int) -> int:
        pivot = a[hi]
        store = lo
        for i in range(lo, hi):
            if a[i] < pivot:
                a[i], a[store] = a[store], a[i]
                store += 1
        a[store], a[hi] = a[hi], a[store]
        return store

    lo, hi = 0, len(a) - 1
    target = k - 1
    while lo < hi:
        p = partition(lo, hi)
        if p == target:
            break
        if p < target:
            lo = p + 1
        else:
            hi = p - 1
    return sorted(a[:k])
