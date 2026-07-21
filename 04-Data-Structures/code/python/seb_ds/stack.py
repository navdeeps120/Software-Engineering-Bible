"""LIFO stack over a DynamicArray. Mirrors `typescript/src/stack.ts`."""

from __future__ import annotations

from typing import Generic, TypeVar

from .dynamic_array import DynamicArray
from .errors import DSError

T = TypeVar("T")


class Stack(Generic[T]):
    def __init__(self) -> None:
        self._arr: DynamicArray[T] = DynamicArray()

    def push(self, x: T) -> None:
        self._arr.push(x)

    def pop(self) -> T:
        if self._arr.size() == 0:
            raise DSError("empty", "pop from empty stack")
        return self._arr.pop()

    def peek(self) -> T:
        if self._arr.size() == 0:
            raise DSError("empty", "peek from empty stack")
        return self._arr.get(self._arr.size() - 1)

    def size(self) -> int:
        return self._arr.size()

    def is_empty(self) -> bool:
        return self._arr.size() == 0

    def check_invariants(self) -> None:
        self._arr.check_invariants()
