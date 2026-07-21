"""Fixed-capacity LRU cache. Mirrors `typescript/src/lruCache.ts`.

Uses the standard dict's guaranteed insertion-order iteration (Python 3.7+)
as the recency list: re-inserting a key (delete then set) moves it to the
"most recently used" end; the first key in iteration order is always the
least recently used.
"""

from __future__ import annotations

from typing import Dict, Generic, Optional, TypeVar

from .errors import DSError

K = TypeVar("K")
V = TypeVar("V")


class LRUCache(Generic[K, V]):
    def __init__(self, capacity: int) -> None:
        if capacity <= 0:
            raise DSError("invalid", "capacity must be > 0")
        self._capacity = capacity
        self._map: Dict[K, V] = {}

    def get(self, key: K) -> Optional[V]:
        if key not in self._map:
            return None
        value = self._map.pop(key)
        self._map[key] = value
        return value

    def put(self, key: K, value: V) -> None:
        if key in self._map:
            del self._map[key]
        elif len(self._map) >= self._capacity:
            oldest_key = next(iter(self._map))
            del self._map[oldest_key]
        self._map[key] = value

    def size(self) -> int:
        return len(self._map)

    def check_invariants(self) -> None:
        if len(self._map) > self._capacity:
            raise DSError("invalid", "size exceeds capacity")
