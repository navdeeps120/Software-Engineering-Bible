from __future__ import annotations

from collections.abc import Iterator
from typing import Any, Generator


class CountUp(Iterator[int]):
    def __init__(self, start: int, stop: int) -> None:
        self.current = start
        self.stop = stop

    def __iter__(self) -> CountUp:
        return self

    def __next__(self) -> int:
        if self.current >= self.stop:
            raise StopIteration
        value = self.current
        self.current += 1
        return value


def countdown(n: int) -> Generator[int, None, str]:
    while n > 0:
        yield n
        n -= 1
    return "done"


class GeneratorMachine:
    """Minimal educational model of generator send/throw/close."""

    def __init__(self, gen: Generator[Any, Any, Any]) -> None:
        self._gen = gen
        self.closed = False

    def send(self, value: Any = None) -> Any:
        if self.closed:
            raise ValueError("generator already closed")
        try:
            return self._gen.send(value)
        except StopIteration as exc:
            self.closed = True
            raise exc

    def throw(self, exc: BaseException) -> Any:
        if self.closed:
            raise ValueError("generator already closed")
        try:
            return self._gen.throw(type(exc), exc, exc.__traceback__)
        except StopIteration as stop:
            self.closed = True
            raise stop

    def close(self) -> None:
        if self.closed:
            return
        self._gen.close()
        self.closed = True
