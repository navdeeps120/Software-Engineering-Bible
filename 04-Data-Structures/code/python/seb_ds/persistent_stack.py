"""Immutable, structurally-shared stack. Mirrors `typescript/src/persistentStack.ts`.

`push` and `pop` never mutate `self`; they return a new stack (or a
`(value, new_stack)` pair) that shares the unaffected tail nodes with every
prior version. Old references stay valid and unchanged forever -- the
defining trait of a persistent structure.
"""

from __future__ import annotations

from typing import Generic, List, Optional, Tuple, TypeVar

from .errors import DSError

T = TypeVar("T")


class _PNode(Generic[T]):
    __slots__ = ("value", "next")

    def __init__(self, value: T, next_: Optional["_PNode[T]"]) -> None:
        self.value = value
        self.next = next_


class PersistentStack(Generic[T]):
    def __init__(self, head: Optional[_PNode[T]], length: int) -> None:
        self._head = head
        self._length = length

    @staticmethod
    def empty() -> "PersistentStack[T]":
        return PersistentStack(None, 0)

    def push(self, x: T) -> "PersistentStack[T]":
        return PersistentStack(_PNode(x, self._head), self._length + 1)

    def pop(self) -> Tuple[T, "PersistentStack[T]"]:
        if self._head is None:
            raise DSError("empty", "pop from empty PersistentStack")
        return self._head.value, PersistentStack(self._head.next, self._length - 1)

    def size(self) -> int:
        return self._length

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
        while cur is not None:
            count += 1
            cur = cur.next
        if count != self._length:
            raise DSError("invalid", "length mismatch")
