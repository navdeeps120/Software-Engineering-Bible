---
title: "Resource Pool and ExitStack — README"
aliases: []
track: 03-Python
topic: "resource-pool-and-exitstack-readme"
difficulty: intermediate
status: active
prerequisites: []
tags: [project, python, mini-project]
created: 2026-07-21
updated: 2026-07-21
---

# Resource Pool and ExitStack

## One-Line Purpose

Model deterministic resource acquisition, LIFO cleanup through an ExitStack-like `ContextStack`, and bounded semaphore pooling to understand exception propagation during nested teardown.

## Status

**Active.** ExitStack behavior lives in [[03-Python/code/seb_python/context.py|context.py]]; bounded pooling lives in [[03-Python/code/seb_python/concurrency.py|concurrency.py]]. Executable checks live in [[03-Python/code/tests/test_labs.py|test_labs.py]].

## Prerequisites

[[03-Python/04-Iteration-Exceptions-and-Context/Context Managers and contextlib|Context Managers and contextlib]], [[03-Python/04-Iteration-Exceptions-and-Context/Resource Cleanup and Cancellation Semantics|Resource Cleanup and Cancellation Semantics]], and [[03-Python/07-Async-Concurrency-and-Free-Threading/concurrent futures|concurrent futures]].

## Architecture

```mermaid
flowchart TD
    Enter[stack.enter(cm)] --> Push[Append __exit__ callback]
    Callback[stack.callback(fn)] --> Push
    Push --> Active[Resources held]
    Active --> Exit[ContextStack.__exit__]
    Exit --> LIFO[Reverse-order teardown]
    LIFO --> Suppress{exit returns True?}
    Suppress -->|yes| Swallow[Suppress active exception]
    Suppress -->|no| Propagate[Propagate or replace exception]
    Pool[BoundedSemaphorePool.run] --> Acquire[Acquire slot]
    Acquire --> Work[Execute callable]
    Work --> Release[Release slot in finally]
```

The public learning surfaces are `ContextStack` and `BoundedSemaphorePool`. Read [[03-Python/projects/Resource Pool and ExitStack/Architecture|Architecture]] before extending behavior.

## Acceptance Criteria

- [ ] `enter` calls `__enter__` and registers `__exit__` for LIFO cleanup.
- [ ] Registered callbacks run during teardown in reverse registration order.
- [ ] Nested `__exit__` exceptions replace the active exception per PEP 343 semantics modeled in the lab.
- [ ] `BoundedSemaphorePool` rejects non-positive sizes and always releases after `run`.

## Run and Test

From the repository root:

```bash
cd 03-Python/code
python -m pip install -e ".[dev]"
python -m pytest -q tests/test_labs.py -k "test_context_stack_cleanup or test_map_limit"
```

Run the complete Python lab suite with `python -m pytest -q`. Keep experiments in [[03-Python/code|03-Python/code]]; this directory contains documentation, not a second implementation.

## Limitations Versus CPython/stdlib

- `ContextStack` is not a full `contextlib.ExitStack`: no `pop_all`, `push`, dynamic context manager factories, or async variants.
- `BoundedSemaphorePool` serializes callables but does not queue waiting threads with fairness guarantees beyond the stdlib semaphore.
- No connection pooling, health checks, idle timeouts, or lease expiration.
- Does not integrate with `weakref.finalize` or `atexit`.

## Production Trade-off

ExitStack-style composition keeps cleanup local to a scope, but long-lived pools need metrics, max idle time, and circuit breaking that this lab intentionally omits to keep teardown semantics visible.

## Exercises and Reflection

1. Add `pop_all()` returning a callback list without running exits.
2. Implement a tiny object pool that returns resources to a free list inside `ContextStack`.
3. Simulate a failing middle `__exit__` and trace which later cleanups still run.

Reflect: identify one invariant the tests prove, one they do not prove, and one production failure mode hidden by the lab's small scale.

## Interview Questions

- Why does `ExitStack` unwind callbacks in reverse order?
- What happens when both the body and an `__exit__` raise?

## Related Notes

- [[03-Python/projects/Resource Pool and ExitStack/Architecture|Architecture]]
- [[03-Python/projects/Python Runtime Toolkit/README|Python Runtime Toolkit]]
- [[03-Python/04-Iteration-Exceptions-and-Context/Context Managers and contextlib|Context Managers and contextlib]]
- [[03-Python/code/tests/test_labs.py|Python lab tests]]
