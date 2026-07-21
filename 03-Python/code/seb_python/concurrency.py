from __future__ import annotations

import threading
from collections.abc import Callable, Iterable
from concurrent.futures import Future, ThreadPoolExecutor
from typing import TypeVar

T = TypeVar("T")
R = TypeVar("R")


def map_limit(
    items: Iterable[T],
    concurrency: int,
    worker: Callable[[T], R],
) -> list[R]:
    if concurrency < 1:
        raise ValueError("concurrency must be >= 1")
    values = list(items)
    if not values:
        return []
    results: list[R | None] = [None] * len(values)
    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        futures: dict[Future[R], int] = {
            pool.submit(worker, value): index for index, value in enumerate(values)
        }
        for future, index in futures.items():
            results[index] = future.result()
    return results  # type: ignore[return-value]


class BoundedSemaphorePool:
    def __init__(self, size: int) -> None:
        if size < 1:
            raise ValueError("size must be >= 1")
        self._sem = threading.BoundedSemaphore(size)
        self.size = size

    def run(self, fn: Callable[[], R]) -> R:
        self._sem.acquire()
        try:
            return fn()
        finally:
            self._sem.release()
