"""Hash set of strings. Mirrors `typescript/src/hashSet.ts`."""

from __future__ import annotations

from typing import List

from .hash_map import ChainingHashMap


class HashSet:
    def __init__(self) -> None:
        self._map: ChainingHashMap[bool] = ChainingHashMap()

    def add(self, x: str) -> None:
        self._map.set(x, True)

    def has(self, x: str) -> bool:
        return self._map.has(x)

    def delete(self, x: str) -> bool:
        return self._map.delete(x)

    def size(self) -> int:
        return self._map.size()

    def values(self) -> List[str]:
        return self._map.keys()

    def check_invariants(self) -> None:
        self._map.check_invariants()
