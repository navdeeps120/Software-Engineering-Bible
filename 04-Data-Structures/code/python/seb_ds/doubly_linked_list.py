"""Doubly linked list with a circular sentinel node. Mirrors `typescript/src/doublyLinkedList.ts`."""

from __future__ import annotations

from typing import Generic, List, Optional, TypeVar

from .errors import DSError

T = TypeVar("T")


class _DNode(Generic[T]):
    __slots__ = ("value", "prev", "next")

    def __init__(self, value: Optional[T] = None) -> None:
        self.value = value
        self.prev: "_DNode[T]" = self
        self.next: "_DNode[T]" = self


class DoublyLinkedList(Generic[T]):
    def __init__(self) -> None:
        self._sentinel: _DNode[T] = _DNode()
        self._length = 0

    def size(self) -> int:
        return self._length

    def push_front(self, x: T) -> None:
        self._insert_after(self._sentinel, x)

    def push_back(self, x: T) -> None:
        self._insert_after(self._sentinel.prev, x)

    def pop_front(self) -> T:
        if self._length == 0:
            raise DSError("empty", "popFront from empty list")
        return self._remove_node(self._sentinel.next)

    def pop_back(self) -> T:
        if self._length == 0:
            raise DSError("empty", "popBack from empty list")
        return self._remove_node(self._sentinel.prev)

    def _insert_after(self, node: _DNode[T], x: T) -> None:
        n = _DNode(x)
        n.prev = node
        n.next = node.next
        node.next.prev = n
        node.next = n
        self._length += 1

    def _remove_node(self, node: _DNode[T]) -> T:
        node.prev.next = node.next
        node.next.prev = node.prev
        self._length -= 1
        return node.value  # type: ignore[return-value]

    def to_list(self) -> List[T]:
        out: List[T] = []
        cur = self._sentinel.next
        while cur is not self._sentinel:
            out.append(cur.value)  # type: ignore[arg-type]
            cur = cur.next
        return out

    def check_invariants(self) -> None:
        count = 0
        cur = self._sentinel.next
        while cur is not self._sentinel:
            count += 1
            if count > self._length + 1:
                raise DSError("invalid", "cycle detected")
            if cur.next.prev is not cur:
                raise DSError("invalid", "broken back-link")
            cur = cur.next
        if count != self._length:
            raise DSError("invalid", "length mismatch")
