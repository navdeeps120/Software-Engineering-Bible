"""Mirrors `typescript/src/kmp.ts` exactly."""

from __future__ import annotations

from typing import List


def kmp_prefix_function(pat: str) -> List[int]:
    """Longest proper prefix-that-is-also-a-suffix length at every index. O(|pat|)."""
    pi = [0] * len(pat)
    k = 0
    for i in range(1, len(pat)):
        while k > 0 and pat[i] != pat[k]:
            k = pi[k - 1]
        if pat[i] == pat[k]:
            k += 1
        pi[i] = k
    return pi


def kmp_search(text: str, pat: str) -> List[int]:
    """KMP substring search: every start index of pat in text, ascending,
    overlaps included. O(|text| + |pat|).
    """
    if len(pat) == 0 or len(pat) > len(text):
        return []
    pi = kmp_prefix_function(pat)
    result: List[int] = []
    k = 0
    for i in range(len(text)):
        while k > 0 and text[i] != pat[k]:
            k = pi[k - 1]
        if text[i] == pat[k]:
            k += 1
        if k == len(pat):
            result.append(i - k + 1)
            k = pi[k - 1]
    return result
