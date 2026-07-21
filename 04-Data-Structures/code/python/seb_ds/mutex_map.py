"""Mutex-safe map API. Mirrors `typescript/src/mutexMap.ts`.

Every operation acquires a single exclusive lock around the underlying map
access. This lab runs single-threaded, so the lock body is exercised
sequentially; the guard still detects reentrancy bugs, which is the property
that matters when this same code is later run under real concurrency (a real
`threading.Lock` would be dropped in here unchanged).
"""

from __future__ import annotations

from typing import Callable, Generic, Optional, TypeVar

from .errors import DSError
from .hash_map import ChainingHashMap

V = TypeVar("V")
R = TypeVar("R")


class MutexMap(Generic[V]):
    def __init__(self) -> None:
        self._map: ChainingHashMap[V] = ChainingHashMap()
        self._locked = False

    def _with_lock(self, fn: Callable[[], R]) -> R:
        if self._locked:
            raise DSError("invalid", "reentrant lock acquisition detected")
        self._locked = True
        try:
            return fn()
        finally:
            self._locked = False

    def set(self, key: str, value: V) -> None:
        self._with_lock(lambda: self._map.set(key, value))

    def get(self, key: str) -> Optional[V]:
        return self._with_lock(lambda: self._map.get(key))

    def delete(self, key: str) -> bool:
        return self._with_lock(lambda: self._map.delete(key))

    def size(self) -> int:
        return self._with_lock(lambda: self._map.size())

    def check_invariants(self) -> None:
        self._map.check_invariants()
