"""Min-priority-queue keyed by an opaque string id. Mirrors `typescript/src/indexedHeap.ts`."""

from __future__ import annotations

from typing import Dict, List

from .errors import DSError


class IndexedHeap:
    def __init__(self) -> None:
        self._heap: List[str] = []
        self._pos: Dict[str, int] = {}
        self._priority: Dict[str, float] = {}

    def size(self) -> int:
        return len(self._heap)

    def contains(self, id_: str) -> bool:
        return id_ in self._pos

    def push(self, id_: str, priority: float) -> None:
        if id_ in self._pos:
            raise DSError("invalid", f"id {id_} already present")
        self._heap.append(id_)
        i = len(self._heap) - 1
        self._pos[id_] = i
        self._priority[id_] = priority
        self._bubble_up(i)

    def decrease_key(self, id_: str, new_priority: float) -> None:
        if id_ not in self._pos:
            raise DSError("missing", f"id {id_} not found")
        current = self._priority[id_]
        if new_priority > current:
            raise DSError("invalid", "newPriority must be <= current priority")
        self._priority[id_] = new_priority
        self._bubble_up(self._pos[id_])

    def pop(self) -> str:
        if not self._heap:
            raise DSError("empty", "pop from empty heap")
        top = self._heap[0]
        last = self._heap.pop()
        del self._pos[top]
        del self._priority[top]
        if self._heap:
            self._heap[0] = last
            self._pos[last] = 0
            self._bubble_down(0)
        return top

    def _less(self, i: int, j: int) -> bool:
        return self._priority[self._heap[i]] < self._priority[self._heap[j]]

    def _swap(self, i: int, j: int) -> None:
        a, b = self._heap[i], self._heap[j]
        self._heap[i], self._heap[j] = b, a
        self._pos[b] = i
        self._pos[a] = j

    def _bubble_up(self, i: int) -> None:
        while i > 0:
            parent = (i - 1) >> 1
            if self._less(i, parent):
                self._swap(i, parent)
                i = parent
            else:
                break

    def _bubble_down(self, i: int) -> None:
        n = len(self._heap)
        while True:
            smallest = i
            l = 2 * i + 1
            r = 2 * i + 2
            if l < n and self._less(l, smallest):
                smallest = l
            if r < n and self._less(r, smallest):
                smallest = r
            if smallest == i:
                break
            self._swap(i, smallest)
            i = smallest

    def check_invariants(self) -> None:
        for i in range(1, len(self._heap)):
            parent = (i - 1) >> 1
            if self._less(i, parent):
                raise DSError("invalid", "heap property violated")
        if len(self._pos) != len(self._heap):
            raise DSError("invalid", "position map size mismatch")
        for i, id_ in enumerate(self._heap):
            if self._pos[id_] != i:
                raise DSError("invalid", "position map entry mismatch")
