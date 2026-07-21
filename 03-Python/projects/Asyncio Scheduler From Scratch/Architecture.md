---
title: "Asyncio Scheduler From Scratch — Architecture"
aliases: []
track: 03-Python
topic: "asyncio-scheduler-from-scratch-architecture"
difficulty: advanced
status: active
prerequisites: []
tags: [project, python, architecture]
created: 2026-07-21
updated: 2026-07-21
---

# Architecture — Asyncio Scheduler From Scratch

## Summary

The lab models coroutine scheduling as explicit queue management plus future completion callbacks. Source of truth: [[03-Python/code/seb_python/asyncio_lite.py|asyncio_lite.py]].

## Scheduler Loop

```mermaid
sequenceDiagram
    participant Loop as EventLoop
    participant Coro as Coroutine
    participant Fut as Future
    Loop->>Coro: send(None)
    Coro->>Fut: await (yield Future)
    alt Future pending
        Fut->>Loop: add_done_callback(resume)
        Note over Loop: other ready work may run
        Fut->>Loop: callback resumes coro
    else Future done
        Loop->>Coro: send(None) with result available
    end
    Coro-->>Loop: StopIteration(value)
    Loop->>Fut: set_result(value)
```

## Invariants

- `run_until_complete` executes a coroutine that awaits an already-resolved `Future`.
- Double settlement raises `InvalidStateError`.
- Cancellation transitions to `CANCELLED` and `result()` raises `CancelledError`.
- Unsupported awaitables become `TypeError` on the task future.

## Failure Model

Deadlock raises `RuntimeError` when the ready queue is empty but work remains incomplete. Callback exceptions during `_run_callbacks` propagate synchronously without asyncio's error handler machinery.

## Complexity and Ownership

Ready queue operations are O(n) pop from front in the current list-based implementation. One loop instance owns all tasks; there is no cross-process scheduling.

## Trade-offs and asyncio Gaps

| Gap | Engineering consequence |
| --- | --- |
| FIFO list queue | Pop-from-front is O(n); CPython uses optimized deque structures |
| No selector | Cannot multiplex I/O or timers natively |
| Callbacks run inline | Differs from asyncio's `call_soon` ordering with other sources |
| No context propagation tests | Real loops copy `contextvars` at task boundaries |

Educational clarity beats performance and host integration. Production code should use stdlib `asyncio` unless there is a measured need for custom scheduling.

## Evolution Rules

- Document any change to callback ordering or cancellation semantics in an ADR before merging.
- Add regression tests for resume-after-await and double-complete paths.
- Link limitations from [[03-Python/projects/Python Runtime Toolkit/ADR/0002-async-contracts|ADR-0002]] when exposing public async APIs.

## Related Documents

- [[03-Python/projects/Asyncio Scheduler From Scratch/README|Project README]]
- [[03-Python/projects/Python Runtime Toolkit/ADR/0002-async-contracts|ADR-0002 Async Contracts]]
- [[03-Python/projects/Python Runtime Toolkit/Testing|Toolkit Testing]]
- [[03-Python/07-Async-Concurrency-and-Free-Threading/Cancellation Timeouts and TaskGroup|Cancellation Timeouts and TaskGroup]]
