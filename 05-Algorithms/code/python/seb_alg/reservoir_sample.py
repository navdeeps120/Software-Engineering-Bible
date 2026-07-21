"""Mirrors `typescript/src/reservoirSample.ts` exactly."""

from __future__ import annotations

import math
from typing import List, Sequence, TypeVar

from .errors import AlgoError
from .rng import mulberry32

T = TypeVar("T")


def reservoir_sample(stream: Sequence[T], k: int, seed: int) -> List[T]:
    """Algorithm R reservoir sampling: uniform random sample of size k from a
    one-pass stream. First k elements seed the reservoir; each later element
    at index i (0-based) replaces a uniformly random slot with probability
    k/(i+1), via j = floor(rng() * (i+1)); replace only if j < k.
    Deterministic given seed (identical mulberry32 + draw sequence as TS).
    Raises AlgoError("invalid") if k is negative or exceeds stream length.
    O(n).
    """
    if k < 0 or k > len(stream):
        raise AlgoError("invalid", "k must be within [0, len(stream)]")
    rng = mulberry32(seed)
    reservoir: List[T] = list(stream[:k])
    for i in range(k, len(stream)):
        j = math.floor(rng() * (i + 1))
        if j < k:
            reservoir[j] = stream[i]
    return reservoir
