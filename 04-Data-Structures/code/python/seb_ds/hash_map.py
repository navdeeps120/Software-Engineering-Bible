"""Chaining and open-addressing hash maps. Mirrors `typescript/src/hashMap.ts`."""

from __future__ import annotations

from typing import Generic, List, Optional, Tuple, TypeVar

from .errors import DSError
from .hash import fnv1a32

V = TypeVar("V")


class ChainingHashMap(Generic[V]):
    """Separate-chaining hash map with string keys, doubling resize at load factor 0.75."""

    def __init__(self, initial_buckets: int = 8) -> None:
        self._bucket_count = initial_buckets
        self._buckets: List[List[Tuple[str, V]]] = [[] for _ in range(initial_buckets)]
        self._count = 0

    def _index_for(self, key: str) -> int:
        return fnv1a32(key) % self._bucket_count

    def set(self, key: str, value: V) -> None:
        bucket = self._buckets[self._index_for(key)]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))
        self._count += 1
        if self._count > self._bucket_count * 0.75:
            self._resize()

    def get(self, key: str) -> Optional[V]:
        for k, v in self._buckets[self._index_for(key)]:
            if k == key:
                return v
        return None

    def has(self, key: str) -> bool:
        return any(k == key for k, _ in self._buckets[self._index_for(key)])

    def delete(self, key: str) -> bool:
        bucket = self._buckets[self._index_for(key)]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                del bucket[i]
                self._count -= 1
                return True
        return False

    def size(self) -> int:
        return self._count

    def keys(self) -> List[str]:
        out = [k for bucket in self._buckets for k, _ in bucket]
        return sorted(out)

    def _resize(self) -> None:
        old = self._buckets
        self._bucket_count *= 2
        self._buckets = [[] for _ in range(self._bucket_count)]
        for bucket in old:
            for k, v in bucket:
                self._buckets[self._index_for(k)].append((k, v))

    def check_invariants(self) -> None:
        total = sum(len(b) for b in self._buckets)
        if total != self._count:
            raise DSError("invalid", "bucket entry count mismatch")
        if len(self._buckets) != self._bucket_count:
            raise DSError("invalid", "bucket array size mismatch")


class _Empty:
    __slots__ = ()


class _Deleted:
    __slots__ = ()


class _Occupied(Generic[V]):
    __slots__ = ("key", "value")

    def __init__(self, key: str, value: V) -> None:
        self.key = key
        self.value = value


_EMPTY = _Empty()
_DELETED = _Deleted()

_Slot = object  # _Empty | _Deleted | _Occupied[V]


class OpenAddressingHashMap(Generic[V]):
    """Open-addressing hash map with linear probing and tombstones for deletion."""

    def __init__(self, initial_capacity: int = 8) -> None:
        self._cap = initial_capacity
        self._slots: List[_Slot] = [_EMPTY for _ in range(self._cap)]
        self._count = 0

    def _index_for(self, key: str) -> int:
        return fnv1a32(key) % self._cap

    def _find_occupied(self, key: str) -> int:
        start = self._index_for(key)
        for step in range(self._cap):
            p = (start + step) % self._cap
            slot = self._slots[p]
            if isinstance(slot, _Empty):
                return -1
            if isinstance(slot, _Occupied) and slot.key == key:
                return p
        return -1

    def set(self, key: str, value: V) -> None:
        if self._count >= self._cap * 0.7:
            self._resize()
        start = self._index_for(key)
        first_tombstone = -1
        for step in range(self._cap):
            p = (start + step) % self._cap
            slot = self._slots[p]
            if isinstance(slot, _Occupied) and slot.key == key:
                slot.value = value
                return
            if isinstance(slot, _Deleted) and first_tombstone == -1:
                first_tombstone = p
            if isinstance(slot, _Empty):
                target = first_tombstone if first_tombstone != -1 else p
                self._slots[target] = _Occupied(key, value)
                self._count += 1
                return
        self._resize()
        self.set(key, value)

    def get(self, key: str) -> Optional[V]:
        i = self._find_occupied(key)
        if i == -1:
            return None
        slot = self._slots[i]
        assert isinstance(slot, _Occupied)
        return slot.value

    def has(self, key: str) -> bool:
        return self._find_occupied(key) != -1

    def delete(self, key: str) -> bool:
        i = self._find_occupied(key)
        if i == -1:
            return False
        self._slots[i] = _DELETED
        self._count -= 1
        return True

    def size(self) -> int:
        return self._count

    def keys(self) -> List[str]:
        out = [slot.key for slot in self._slots if isinstance(slot, _Occupied)]
        return sorted(out)

    def _resize(self) -> None:
        old = [slot for slot in self._slots if isinstance(slot, _Occupied)]
        self._cap *= 2
        self._slots = [_EMPTY for _ in range(self._cap)]
        self._count = 0
        for slot in old:
            self.set(slot.key, slot.value)

    def check_invariants(self) -> None:
        occupied = sum(1 for slot in self._slots if isinstance(slot, _Occupied))
        if occupied != self._count:
            raise DSError("invalid", "occupied slot count mismatch")
        if len(self._slots) != self._cap:
            raise DSError("invalid", "slot array size mismatch")
