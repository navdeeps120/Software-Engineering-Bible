"""Mirrors `typescript/src/rng.ts` exactly.

The TS side is the literal, well-known mulberry32 reference implementation
using JS's signed-int32 bitwise semantics (`|0`, `>>>0`, `Math.imul`). This
port instead keeps every intermediate value as an ordinary Python
non-negative integer in [0, 2**32 - 1] and masks with `& 0xFFFFFFFF` after
every addition and multiplication. This produces bit-for-bit identical
results to the JS version because:

- XOR, OR, and right-shift produce the same bit pattern whether that
  pattern is interpreted as signed two's-complement or as unsigned -- only
  the *numeric label* attached to a bit pattern differs, not the pattern
  itself.
- Addition and multiplication modulo 2**32 are ring-homomorphic under the
  signed <-> unsigned relabeling (a signed value and its unsigned twin
  differ by a multiple of 2**32, which vanishes mod 2**32).

So performing every step as unsigned arithmetic mod 2**32 throughout
reproduces the exact same sequence of 32-bit words as JS's mix of signed
`Math.imul`/`|0` and unsigned `>>>0`/`>>>n`.
"""

from __future__ import annotations

from typing import Callable

_MASK32 = 0xFFFFFFFF


def mulberry32(seed: int) -> Callable[[], float]:
    """Returns a zero-argument function yielding successive floats in [0, 1)."""
    state = {"a": seed & _MASK32}

    def next_value() -> float:
        a = (state["a"] + 0x6D2B79F5) & _MASK32
        state["a"] = a
        t = a
        t = ((t ^ (t >> 15)) * (t | 1)) & _MASK32
        mixed = ((t ^ (t >> 7)) * (t | 61)) & _MASK32
        t = ((t + mixed) & _MASK32) ^ t
        t &= _MASK32
        return ((t ^ (t >> 14)) & _MASK32) / 4294967296.0

    return next_value
