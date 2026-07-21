"""Mirrors the six TS sort modules (insertionSort.ts, mergeSort.ts, quickSort.ts,
heapSort.ts, countingSort.ts, radixSort.ts) exactly, collected into one file for
brevity on the Python side (the algorithm/op dispatch table still names them
individually, matching TypeScript).
"""

from __future__ import annotations

from typing import List, Sequence

from .errors import AlgoError


def insertion_sort(arr: Sequence[int]) -> List[int]:
    """Stable, O(n^2) worst/average, O(n) on nearly-sorted input. Returns a new list."""
    a = list(arr)
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a


def merge_sort(arr: Sequence[int]) -> List[int]:
    """Top-down merge sort. Stable, O(n log n) time, O(n) auxiliary space."""
    a = list(arr)
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    merged: List[int] = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged


def quick_sort(arr: Sequence[int]) -> List[int]:
    """Deterministic Lomuto-partition quicksort (last element as pivot). Not stable."""
    a = list(arr)

    def sort(lo: int, hi: int) -> None:
        if lo >= hi:
            return
        pivot = a[hi]
        store = lo
        for i in range(lo, hi):
            if a[i] < pivot:
                a[i], a[store] = a[store], a[i]
                store += 1
        a[store], a[hi] = a[hi], a[store]
        sort(lo, store - 1)
        sort(store + 1, hi)

    sort(0, len(a) - 1)
    return a


def heap_sort(arr: Sequence[int]) -> List[int]:
    """In-place binary max-heap sort. Not stable, O(n log n) worst case."""
    a = list(arr)
    n = len(a)

    def sift_down(start: int, end: int) -> None:
        root = start
        while True:
            left = 2 * root + 1
            if left > end:
                return
            largest = root
            if a[left] > a[largest]:
                largest = left
            right = left + 1
            if right <= end and a[right] > a[largest]:
                largest = right
            if largest == root:
                return
            a[root], a[largest] = a[largest], a[root]
            root = largest

    for start in range(n // 2 - 1, -1, -1):
        sift_down(start, n - 1)
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        sift_down(0, end - 1)
    return a


def counting_sort(arr: Sequence[int]) -> List[int]:
    """Counting sort for non-negative integers. Stable, O(n + k)."""
    if len(arr) == 0:
        return []
    max_val = 0
    for x in arr:
        if not isinstance(x, int) or x < 0:
            raise AlgoError("invalid", "countingSort requires non-negative integers")
        if x > max_val:
            max_val = x
    counts = [0] * (max_val + 1)
    for x in arr:
        counts[x] += 1
    out: List[int] = []
    for v in range(max_val + 1):
        out.extend([v] * counts[v])
    return out


def radix_sort(arr: Sequence[int]) -> List[int]:
    """LSD radix sort for non-negative integers, base 10. Stable overall."""
    if len(arr) == 0:
        return []
    max_val = 0
    for x in arr:
        if not isinstance(x, int) or x < 0:
            raise AlgoError("invalid", "radixSort requires non-negative integers")
        if x > max_val:
            max_val = x
    out = list(arr)
    exp = 1
    while max_val // exp > 0:
        buckets: List[List[int]] = [[] for _ in range(10)]
        for x in out:
            buckets[(x // exp) % 10].append(x)
        out = [x for bucket in buckets for x in bucket]
        exp *= 10
    return out
