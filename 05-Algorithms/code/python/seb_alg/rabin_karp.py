"""Mirrors `typescript/src/rabinKarp.ts` exactly."""

from __future__ import annotations

from typing import List

_BASE = 131
_MOD = 1_000_000_007


def rabin_karp(text: str, pat: str) -> List[int]:
    """Rabin-Karp substring search using a fixed deterministic rolling hash
    (base=131, mod=1_000_000_007); every hash match is verified with a
    direct character comparison, eliminating false positives entirely.
    Every start index of pat in text, ascending, overlaps included.
    O(|text| + |pat|) expected.
    """
    n, m = len(text), len(pat)
    if m == 0 or m > n:
        return []

    pat_hash = 0
    pow_ = 1
    for i in range(m):
        pat_hash = (pat_hash * _BASE + ord(pat[i])) % _MOD
        if i < m - 1:
            pow_ = (pow_ * _BASE) % _MOD

    window_hash = 0
    for i in range(m):
        window_hash = (window_hash * _BASE + ord(text[i])) % _MOD

    result: List[int] = []
    for i in range(n - m + 1):
        if window_hash == pat_hash and text[i : i + m] == pat:
            result.append(i)
        if i + m < n:
            window_hash = (window_hash - ord(text[i]) * pow_) % _MOD
            window_hash = (window_hash + _MOD) % _MOD
            window_hash = (window_hash * _BASE + ord(text[i + m])) % _MOD
    return result
