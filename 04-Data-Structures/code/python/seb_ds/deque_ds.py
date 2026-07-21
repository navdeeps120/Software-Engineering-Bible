"""Double-ended queue over a doubly linked list. Mirrors `typescript/src/deque.ts`.

Named `deque_ds` (not `deque`) to avoid shadowing `collections.deque`; the
public class is `Deque`.
"""

from __future__ import annotations

from typing import Generic, TypeVar

from .doubly_linked_list import DoublyLinkedList

T = TypeVar("T")


class Deque(Generic[T]):
    def __init__(self) -> None:
        self._list: DoublyLinkedList[T] = DoublyLinkedList()

    def push_front(self, x: T) -> None:
        self._list.push_front(x)

    def push_back(self, x: T) -> None:
        self._list.push_back(x)

    def pop_front(self) -> T:
        return self._list.pop_front()

    def pop_back(self) -> T:
        return self._list.pop_back()

    def size(self) -> int:
        return self._list.size()

    def check_invariants(self) -> None:
        self._list.check_invariants()
