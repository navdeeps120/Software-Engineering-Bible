---
title: Python Code Labs
aliases: [CPython Mechanism Labs]
track: 03-Python
topic: python-code-labs
difficulty: intermediate
status: active
prerequisites: ["[[03-Python/README|Python]]"]
tags: [python, cpython, labs]
created: 2026-07-21
updated: 2026-07-21
---

# Python Code Labs

From-scratch educational models of CPython mechanisms. Code is MIT licensed. Target: **CPython 3.14+**.

## Labs

| Module | Purpose |
| --- | --- |
| `mro` | C3 linearization / attribute lookup |
| `descriptors` | data vs non-data descriptors |
| `iterators` | iterator + generator state machine |
| `context` | context managers and ExitStack |
| `exceptions` | ExceptionGroup / except* routing |
| `vm` | toy bytecode interpreter |
| `gc_sim` | refcount + cycle GC model |
| `imports` | import graph / cycle detection |
| `asyncio_lite` | Future/Task/event-loop lite |
| `concurrency` | bounded worker orchestration |
| `plugins` | Protocol + registry discovery |
| `logging_ctx` | contextvars structured logging |

## Run

```bash
cd 03-Python/code
python -m pip install -e ".[dev]"
python -m pytest -q
```

## Design Rules

1. Teach the mechanism; do not claim CPython source parity.
2. Fail loudly on invalid transitions.
3. Skip observation tests with clear reasons when the interpreter cannot support them.
4. Link limitations from the owning topic note.

## Related Notes

- [[03-Python/README|Python]]
- [[03-Python/projects/Python Runtime Toolkit/README|Python Runtime Toolkit]]
