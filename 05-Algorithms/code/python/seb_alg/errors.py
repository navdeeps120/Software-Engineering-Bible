"""Common error type shared by every algorithm in this lab."""

from __future__ import annotations

ALGO_ERROR_CODES = frozenset({"invalid", "index", "not_found", "cycle", "empty"})


class AlgoError(Exception):
    """Raised by algorithms for expected failure modes.

    `code` is the stable, language-agnostic identifier compared against
    `"error"` fields in the shared JSON vectors; the exception message is
    for humans only.
    """

    def __init__(self, code: str, message: str | None = None) -> None:
        super().__init__(message or code)
        self.code = code
