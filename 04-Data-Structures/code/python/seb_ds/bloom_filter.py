"""Classic Bloom filter. Mirrors `typescript/src/bloomFilter.ts`.

Hash scheme is identical to the TypeScript port bit-for-bit (see `hash.py`),
so both languages agree on every membership query for the same inputs.
"""

from __future__ import annotations

from .errors import DSError
from .hash import bloom_indices


class BloomFilter:
    def __init__(self, m_bits: int, k_hashes: int) -> None:
        if m_bits <= 0 or k_hashes <= 0:
            raise DSError("invalid", "mBits and kHashes must be > 0")
        self._m = m_bits
        self._k = k_hashes
        self._bits = bytearray(m_bits)

    def add(self, item: str) -> None:
        for idx in bloom_indices(item, self._k, self._m):
            self._bits[idx] = 1

    def might_contain(self, item: str) -> bool:
        for idx in bloom_indices(item, self._k, self._m):
            if self._bits[idx] == 0:
                return False
        return True

    def check_invariants(self) -> None:
        if len(self._bits) != self._m:
            raise DSError("invalid", "bit array length mismatch")
