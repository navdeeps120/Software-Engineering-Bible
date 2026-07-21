"""Fixed-size compact boolean array. Mirrors `typescript/src/bitset.ts`."""

from __future__ import annotations

from .errors import DSError


class Bitset:
    def __init__(self, n_bits: int) -> None:
        if n_bits < 0:
            raise DSError("invalid", "nBits must be >= 0")
        self._n = n_bits
        self._bits = bytearray(n_bits)

    def set(self, i: int, value: bool = True) -> None:
        self._check_index(i)
        self._bits[i] = 1 if value else 0

    def get(self, i: int) -> bool:
        self._check_index(i)
        return self._bits[i] == 1

    def count(self) -> int:
        return sum(self._bits[: self._n])

    def to_bits(self) -> str:
        return "".join(str(b) for b in self._bits)

    def _check_index(self, i: int) -> None:
        if i < 0 or i >= self._n:
            raise DSError("index", f"index {i} out of bounds")

    def check_invariants(self) -> None:
        if len(self._bits) != self._n:
            raise DSError("invalid", "backing store length mismatch")
        for i in range(self._n):
            if self._bits[i] not in (0, 1):
                raise DSError("invalid", "non-boolean bit value")
