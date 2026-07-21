"""FIFO queue over a singly linked list. Mirrors `typescript/src/queue.ts`.

Named `linear_queue` (not `queue`) purely to avoid any confusion with the
`queue` module in the Python standard library; the public class is `Queue`.
"""

from __future__ import annotations

from typing import Generic, TypeVar

from .errors import DSError
from .singly_linked_list import SinglyLinkedList

T = TypeVar("T")


class Queue(Generic[T]):
    def __init__(self) -> None:
        self._list: SinglyLinkedList[T] = SinglyLinkedList()

    def enqueue(self, x: T) -> None:
        self._list.push_back(x)

    def dequeue(self) -> T:
        if self._list.size() == 0:
            raise DSError("empty", "dequeue from empty queue")
        return self._list.pop_front()

    def peek(self) -> T:
        if self._list.size() == 0:
            raise DSError("empty", "peek from empty queue")
        return self._list.front()

    def size(self) -> int:
        return self._list.size()

    def check_invariants(self) -> None:
        self._list.check_invariants()
