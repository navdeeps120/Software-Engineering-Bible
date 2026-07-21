"""Mirrors `typescript/src/binarySearch.ts` exactly."""

from __future__ import annotations

from typing import Callable, List, Sequence

from .errors import AlgoError


def binary_search(arr: Sequence[int], x: int) -> int:
    """Classic binary search over an ascending-sorted array. O(log n).

    Returns the index of `x` if present, otherwise -1. Does not deduplicate:
    if `x` appears multiple times, any one of its indices may be returned.
    """
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == x:
            return mid
        if arr[mid] < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


def lower_bound(arr: Sequence[int], x: int) -> int:
    """First index where arr[i] >= x (== len(arr) if none). O(log n)."""
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] < x:
            lo = mid + 1
        else:
            hi = mid
    return lo


def upper_bound(arr: Sequence[int], x: int) -> int:
    """First index where arr[i] > x (== len(arr) if none). O(log n)."""
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] <= x:
            lo = mid + 1
        else:
            hi = mid
    return lo


def binary_search_answer(lo: int, hi: int, predicate: Callable[[int], bool]) -> int:
    """"Binary search on the answer": smallest x in [lo, hi] with predicate(x) true.

    Raises AlgoError("not_found") if predicate(hi) is false. O(log(hi-lo)).
    """
    if lo > hi:
        raise AlgoError("invalid", "lo must be <= hi")
    if not predicate(hi):
        raise AlgoError("not_found", "predicate is false across the entire range")
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if predicate(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo
