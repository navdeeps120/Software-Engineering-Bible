from __future__ import annotations

from types import TracebackType
from typing import Any, Callable


class ContextStack:
    """Educational ExitStack-like manager."""

    def __init__(self) -> None:
        self._exits: list[Callable[[type[BaseException] | None, BaseException | None, TracebackType | None], bool | None]] = []

    def enter(self, cm: Any) -> Any:
        result = cm.__enter__()
        self._exits.append(cm.__exit__)
        return result

    def callback(self, fn: Callable[[], None]) -> None:
        def _exit(
            exc_type: type[BaseException] | None,
            exc: BaseException | None,
            tb: TracebackType | None,
        ) -> bool:
            fn()
            return False

        self._exits.append(_exit)

    def __enter__(self) -> ContextStack:
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> bool:
        suppressed = False
        pending = exc
        for exit_fn in reversed(self._exits):
            try:
                if exit_fn(exc_type if pending is exc else None, pending if pending is exc else pending, tb):
                    suppressed = True
                    pending = None
                    exc_type = None
                    tb = None
            except BaseException as nested:
                pending = nested
                exc_type = type(nested)
                tb = nested.__traceback__
                suppressed = False
        self._exits.clear()
        if pending is not None and pending is not exc:
            raise pending
        return suppressed
