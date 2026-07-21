from __future__ import annotations


def match_exception_group(group: BaseExceptionGroup, expected: type[BaseException]) -> tuple[list[BaseException], list[BaseException]]:
    """Split an ExceptionGroup into matched and unmatched leaf exceptions."""
    matched: list[BaseException] = []
    unmatched: list[BaseException] = []

    def walk(exc: BaseException) -> None:
        if isinstance(exc, BaseExceptionGroup):
            for child in exc.exceptions:
                walk(child)
            return
        if isinstance(exc, expected):
            matched.append(exc)
        else:
            unmatched.append(exc)

    walk(group)
    return matched, unmatched


def reraise_unmatched(group: BaseExceptionGroup, expected: type[BaseException], message: str = "remaining errors") -> None:
    matched, unmatched = match_exception_group(group, expected)
    if not matched:
        raise group
    if unmatched:
        raise BaseExceptionGroup(message, unmatched)
