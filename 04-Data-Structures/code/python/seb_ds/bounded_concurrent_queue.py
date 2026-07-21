"""Bounded queue with a non-blocking, concurrency-shaped API. Mirrors
`typescript/src/boundedConcurrentQueue.ts`.

`try_offer` / `try_poll` return a success flag / `None` instead of blocking
or raising. Vectors drive this deterministically from a single caller; the
shape is what a real multi-producer/multi-consumer bounded buffer exposes,
but no actual threads are spawned in this lab.
"""

from __future__ import annotations

from typing import Generic, Optional, TypeVar

from .ring_buffer import RingBuffer

T = TypeVar("T")


class BoundedConcurrentQueue(Generic[T]):
    def __init__(self, capacity: int) -> None:
        self._buf: RingBuffer[T] = RingBuffer(capacity)

    def try_offer(self, x: T) -> bool:
        if self._buf.is_full():
            return False
        self._buf.push(x)
        return True

    def try_poll(self) -> Optional[T]:
        if self._buf.is_empty():
            return None
        return self._buf.pop()

    def size(self) -> int:
        return self._buf.size()

    def check_invariants(self) -> None:
        self._buf.check_invariants()
