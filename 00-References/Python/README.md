---
title: Python References
aliases: [CPython References, Python Sources]
track: 00-References
topic: python-references
difficulty: intermediate
status: active
prerequisites: ["[[03-Python/README|Python]]"]
tags: [reference, python, cpython]
created: 2026-07-21
updated: 2026-07-21
---

# Python References

Primary and high-signal sources for the [[03-Python/README|Python]] track. Teaching target: **CPython 3.14+** with explicit portability notes.

## Language and Data Model

- [The Python Language Reference](https://docs.python.org/3/reference/)
- [Data model](https://docs.python.org/3/reference/datamodel.html)
- [What's New in Python 3.14](https://docs.python.org/3/whatsnew/3.14.html)

## PEPs (high priority)

| PEP | Topic |
| --- | --- |
| 8 | Style / community conventions |
| 484 / 526 / 649 | Typing and deferred annotations |
| 659 | Specializing adaptive interpreter |
| 703 / 779 | Free-threaded Python |
| 734 | Multiple interpreters in the stdlib |
| 517 / 518 / 621 / 660 | Packaging / pyproject / editable installs |

## CPython Internals

- [CPython Developer Guide](https://devguide.python.org/)
- `dis`, `gc`, `sys`, `sys.monitoring` documentation
- Extension / Stable ABI docs

## Concurrency and Async

- [asyncio](https://docs.python.org/3/library/asyncio.html)
- threading / multiprocessing / concurrent.futures docs
- Free-threaded what's-new and PEPs above

## Packaging and Tooling

- [PyPA Packaging Guide](https://packaging.python.org/)
- [pyproject.toml specification](https://packaging.python.org/en/latest/specifications/pyproject-toml/)
- pip / uv / virtualenv documentation

## Books and Long-form

- *Fluent Python* (Ramalho) — data model, concurrency, typing practice
- *Python Cookbook* — production idioms
- Beazley / Ajitsaria CPython internals materials — implementation depth

## Testing and Security

- pytest / Hypothesis docs
- pickle / deserialization and supply-chain guidance (link Security track for org policy)

## Source Selection Rules

1. Language Reference and PEPs for semantic truth.
2. CPython docs/devguide for implementation behavior; label version.
3. Alternate runtimes are compatibility footnotes, not the default.
4. Backend frameworks belong in [[07-Backend/README|Backend]], not this track.

## Related Notes

- [[00-References/README|References]]
- [[03-Python/README|Python]]
- [[03-Python/code/README|Python code labs]]
- [[01-Computer-Science/README|Computer Science]]
