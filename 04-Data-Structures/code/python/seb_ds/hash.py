"""FNV-1a 32-bit hashing, bit-for-bit identical to `typescript/src/hash.ts`.

Both implementations hash the UTF-8 byte sequence of the input rather than
any native string representation, which is what keeps them in lockstep
regardless of host language string internals.
"""

from __future__ import annotations

_OFFSET_BASIS = 0x811C9DC5
_PRIME = 0x01000193
_MASK32 = 0xFFFFFFFF


def fnv1a32(input_str: str) -> int:
    data = input_str.encode("utf-8")
    h = _OFFSET_BASIS
    for byte in data:
        h ^= byte
        h = (h * _PRIME) & _MASK32
    return h


def fnv1a32_salted(input_str: str) -> int:
    """Second, independent hash used for Bloom filter double-hashing."""
    return fnv1a32("\u0000" + input_str)


def bloom_indices(item: str, k: int, m: int) -> list[int]:
    """Deterministic k-index generator shared by BloomFilter across languages."""
    h1 = fnv1a32(item)
    h2 = fnv1a32_salted(item)
    indices = []
    for i in range(k):
        raw = h1 + i * h2
        indices.append(((raw % m) + m) % m)
    return indices
