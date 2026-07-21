"""Amortized-growth contiguous array. Mirrors `typescript/src/dynamicArray.ts`."""

from __future__ import annotations

from typing import Generic, List, TypeVar

from .errors import DSError

T = TypeVar("T")

_INITIAL_CAPACITY = 4
_GROWTH_FACTOR = 2


class DynamicArray(Generic[T]):
    def __init__(self) -> None:
        self._data: List[T | None] = [None] * _INITIAL_CAPACITY
        self._length = 0

    def size(self) -> int:
        return self._length

    def capacity(self) -> int:
        return len(self._data)

    def push(self, x: T) -> None:
        if self._length == len(self._data):
            self._grow()
        self._data[self._length] = x
        self._length += 1

    def pop(self) -> T:
        if self._length == 0:
            raise DSError("empty", "pop from empty DynamicArray")
        self._length -= 1
        value = self._data[self._length]
        self._data[self._length] = None
        return value  # type: ignore[return-value]

    def get(self, i: int) -> T:
        self._check_index(i)
        return self._data[i]  # type: ignore[return-value]

    def set(self, i: int, x: T) -> None:
        self._check_index(i)
        self._data[i] = x

    def to_list(self) -> List[T]:
        return list(self._data[: self._length])  # type: ignore[list-item]

    def _check_index(self, i: int) -> None:
        if i < 0 or i >= self._length:
            raise DSError("index", f"index {i} out of bounds")

    def _grow(self) -> None:
        next_data: List[T | None] = [None] * (len(self._data) * _GROWTH_FACTOR)
        for i in range(self._length):
            next_data[i] = self._data[i]
        self._data = next_data

    def check_invariants(self) -> None:
        if self._length < 0 or self._length > len(self._data):
            raise DSError("invalid", "length out of range for capacity")
        if len(self._data) < _INITIAL_CAPACITY:
            raise DSError("invalid", "capacity below initial minimum of 4")
        if (len(self._data) & (len(self._data) - 1)) != 0:
            raise DSError("invalid", "capacity must remain a power of two")
