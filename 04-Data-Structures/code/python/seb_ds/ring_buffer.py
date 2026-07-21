"""Fixed-capacity circular queue. Mirrors `typescript/src/ringBuffer.ts`."""

from __future__ import annotations

from typing import Generic, List, TypeVar

from .errors import DSError

T = TypeVar("T")


class RingBuffer(Generic[T]):
    def __init__(self, capacity: int) -> None:
        if capacity <= 0:
            raise DSError("invalid", "capacity must be > 0")
        self._cap = capacity
        self._data: List[T | None] = [None] * capacity
        self._head = 0
        self._count = 0

    def size(self) -> int:
        return self._count

    def is_full(self) -> bool:
        return self._count == self._cap

    def is_empty(self) -> bool:
        return self._count == 0

    def push(self, x: T) -> None:
        if self.is_full():
            raise DSError("full", "RingBuffer is full")
        tail = (self._head + self._count) % self._cap
        self._data[tail] = x
        self._count += 1

    def pop(self) -> T:
        if self.is_empty():
            raise DSError("empty", "RingBuffer is empty")
        value = self._data[self._head]
        self._data[self._head] = None
        self._head = (self._head + 1) % self._cap
        self._count -= 1
        return value  # type: ignore[return-value]

    def to_list(self) -> List[T]:
        return [self._data[(self._head + i) % self._cap] for i in range(self._count)]  # type: ignore[misc]

    def check_invariants(self) -> None:
        if self._count < 0 or self._count > self._cap:
            raise DSError("invalid", "count out of range")
        if self._head < 0 or self._head >= self._cap:
            raise DSError("invalid", "head out of range")
