"""Singly linked list with tail tracking. Mirrors `typescript/src/singlyLinkedList.ts`."""

from __future__ import annotations

from typing import Generic, List, Optional, TypeVar

from .errors import DSError

T = TypeVar("T")


class _SNode(Generic[T]):
    __slots__ = ("value", "next")

    def __init__(self, value: T) -> None:
        self.value = value
        self.next: Optional[_SNode[T]] = None


class SinglyLinkedList(Generic[T]):
    def __init__(self) -> None:
        self._head: Optional[_SNode[T]] = None
        self._tail: Optional[_SNode[T]] = None
        self._length = 0

    def size(self) -> int:
        return self._length

    def push_front(self, x: T) -> None:
        node = _SNode(x)
        node.next = self._head
        self._head = node
        if self._tail is None:
            self._tail = node
        self._length += 1

    def push_back(self, x: T) -> None:
        node = _SNode(x)
        if self._tail is not None:
            self._tail.next = node
            self._tail = node
        else:
            self._head = self._tail = node
        self._length += 1

    def pop_front(self) -> T:
        if self._head is None:
            raise DSError("empty", "popFront from empty list")
        node = self._head
        self._head = node.next
        if self._head is None:
            self._tail = None
        self._length -= 1
        return node.value

    def front(self) -> T:
        if self._head is None:
            raise DSError("empty", "front of empty list")
        return self._head.value

    def to_list(self) -> List[T]:
        out: List[T] = []
        cur = self._head
        while cur is not None:
            out.append(cur.value)
            cur = cur.next
        return out

    def check_invariants(self) -> None:
        count = 0
        cur = self._head
        last = None
        while cur is not None:
            count += 1
            last = cur
            cur = cur.next
            if count > self._length + 1:
                raise DSError("invalid", "cycle detected")
        if count != self._length:
            raise DSError("invalid", "length mismatch")
        if self._tail is not last:
            raise DSError("invalid", "tail pointer mismatch")
