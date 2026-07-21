"""Common error type shared by every structure in this lab."""

from __future__ import annotations

DS_ERROR_CODES = frozenset({"empty", "full", "index", "missing", "invalid"})


class DSError(Exception):
    """Raised by structures for expected failure modes.

    `code` is the stable, language-agnostic identifier compared against
    `"error"` fields in the shared JSON vectors; the exception message is
    for humans only.
    """

    def __init__(self, code: str, message: str | None = None) -> None:
        super().__init__(message or code)
        self.code = code
