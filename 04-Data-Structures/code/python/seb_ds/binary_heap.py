"""Binary min-heap over an array. Mirrors `typescript/src/binaryHeap.ts`.

`to_list()` returns the raw heap-ordered backing list (a valid heap, not a
sorted sequence) -- vectors should prefer `peek`/`pop` sequences to assert
ordering.
"""

from __future__ import annotations

from typing import Callable, Generic, List, Optional, TypeVar

from .errors import DSError

T = TypeVar("T")


def _default_cmp(a: T, b: T) -> int:
    return (a > b) - (a < b)  # type: ignore[operator]


class BinaryHeap(Generic[T]):
    def __init__(self, cmp: Optional[Callable[[T, T], int]] = None) -> None:
        self._data: List[T] = []
        self._cmp = cmp or _default_cmp

    def size(self) -> int:
        return len(self._data)

    def peek(self) -> T:
        if not self._data:
            raise DSError("empty", "peek from empty heap")
        return self._data[0]

    def push(self, x: T) -> None:
        self._data.append(x)
        self._bubble_up(len(self._data) - 1)

    def pop(self) -> T:
        if not self._data:
            raise DSError("empty", "pop from empty heap")
        top = self._data[0]
        last = self._data.pop()
        if self._data:
            self._data[0] = last
            self._bubble_down(0)
        return top

    def to_list(self) -> List[T]:
        return list(self._data)

    def _bubble_up(self, i: int) -> None:
        while i > 0:
            parent = (i - 1) >> 1
            if self._cmp(self._data[i], self._data[parent]) < 0:
                self._data[i], self._data[parent] = self._data[parent], self._data[i]
                i = parent
            else:
                break

    def _bubble_down(self, i: int) -> None:
        n = len(self._data)
        while True:
            smallest = i
            l = 2 * i + 1
            r = 2 * i + 2
            if l < n and self._cmp(self._data[l], self._data[smallest]) < 0:
                smallest = l
            if r < n and self._cmp(self._data[r], self._data[smallest]) < 0:
                smallest = r
            if smallest == i:
                break
            self._data[i], self._data[smallest] = self._data[smallest], self._data[i]
            i = smallest

    def check_invariants(self) -> None:
        for i in range(1, len(self._data)):
            parent = (i - 1) >> 1
            if self._cmp(self._data[i], self._data[parent]) < 0:
                raise DSError("invalid", "heap property violated")
