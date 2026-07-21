from __future__ import annotations

import enum
from collections.abc import Awaitable, Callable, Coroutine
from typing import Any, TypeVar

T = TypeVar("T")


class FutureState(enum.Enum):
    PENDING = "pending"
    FINISHED = "finished"
    CANCELLED = "cancelled"


class CancelledError(Exception):
    pass


class Future:
    def __init__(self) -> None:
        self.state = FutureState.PENDING
        self._result: Any = None
        self._exception: BaseException | None = None
        self._callbacks: list[Callable[[Future], None]] = []

    def done(self) -> bool:
        return self.state is not FutureState.PENDING

    def result(self) -> Any:
        if self.state is FutureState.CANCELLED:
            raise CancelledError()
        if self._exception is not None:
            raise self._exception
        return self._result

    def set_result(self, value: Any) -> None:
        if self.done():
            raise InvalidStateError("future already done")
        self.state = FutureState.FINISHED
        self._result = value
        self._run_callbacks()

    def set_exception(self, exc: BaseException) -> None:
        if self.done():
            raise InvalidStateError("future already done")
        self.state = FutureState.FINISHED
        self._exception = exc
        self._run_callbacks()

    def cancel(self) -> bool:
        if self.done():
            return False
        self.state = FutureState.CANCELLED
        self._exception = CancelledError()
        self._run_callbacks()
        return True

    def add_done_callback(self, callback: Callable[[Future], None]) -> None:
        if self.done():
            callback(self)
        else:
            self._callbacks.append(callback)

    def _run_callbacks(self) -> None:
        callbacks, self._callbacks = self._callbacks, []
        for callback in callbacks:
            callback(self)

    def __await__(self):
        if not self.done():
            yield self
        return self.result()


class InvalidStateError(RuntimeError):
    pass


class EventLoop:
    def __init__(self) -> None:
        self._ready: list[tuple[Coroutine[Any, Any, Any], Future]] = []
        self._stopping = False

    def create_task(self, coro: Coroutine[Any, Any, Any]) -> Future:
        future: Future = Future()
        self._ready.append((coro, future))
        return future

    def run_until_complete(self, coro: Coroutine[Any, Any, Any]) -> Any:
        main = self.create_task(coro)
        while not main.done():
            if not self._ready:
                raise RuntimeError("no runnable tasks; deadlock?")
            coro_item, future = self._ready.pop(0)
            if future.cancelled() if hasattr(future, "cancelled") else future.state is FutureState.CANCELLED:
                continue
            try:
                awaited = coro_item.send(None)
            except StopIteration as stop:
                future.set_result(stop.value)
                continue
            except BaseException as exc:
                future.set_exception(exc)
                continue
            if isinstance(awaited, Future):
                def resume(done: Future, c: Coroutine[Any, Any, Any] = coro_item, f: Future = future) -> None:
                    if done.state is FutureState.CANCELLED:
                        f.cancel()
                        return
                    self._ready.append((c, f))

                if awaited.done():
                    self._ready.append((coro_item, future))
                else:
                    awaited.add_done_callback(resume)
            else:
                future.set_exception(TypeError(f"unsupported awaitable {type(awaited)!r}"))
        return main.result()


async def sleep_ticks(loop: EventLoop, ticks: int = 1) -> None:
    for _ in range(ticks):
        fut = Future()
        # schedule completion after current ready queue drains once
        def complete(f: Future = fut) -> None:
            if not f.done():
                f.set_result(None)

        # enqueue a no-op task that completes the future
        async def _completer(cb: Callable[[], None] = complete) -> None:
            cb()

        loop.create_task(_completer())
        await fut
