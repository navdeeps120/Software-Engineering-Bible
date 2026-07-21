---
title: Concurrency Zoo — Architecture
aliases: []
track: 01-Computer-Science
topic: concurrency-zoo-architecture
difficulty: advanced
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Concurrency Zoo/README|Concurrency Zoo]]"
tags: [project, architecture, concurrency]
created: 2026-07-21
updated: 2026-07-21
---

# Architecture — Concurrency Zoo

## Bounded Buffer Internals

```mermaid
classDiagram
    class BoundedBuffer {
        -items T[]
        -waiters callback[]
        -capacity number
        +tryPush(item) bool
        +tryPop() T
        +push(item) Promise
        +pop() Promise
    }
```

| Operation | Precondition | Postcondition |
| --- | --- | --- |
| `tryPush` | — | Returns false if `size >= capacity` |
| `tryPop` | — | Returns undefined if empty |
| `push` | — | Blocks until slot available, then enqueues |
| `pop` | — | Blocks until item available, then dequeues |

Waiters are FIFO callbacks resolved when the opposite operation frees capacity or supplies data.

## Lost-Update Simulation

```mermaid
sequenceDiagram
    participant W1 as Worker 1
    participant W2 as Worker 2
    participant C as Counter
    W1->>C: read 0
    W2->>C: read 0
    W1->>C: write 1
    W2->>C: write 1
    Note over C: Expected 2, got 1
```

The TypeScript implementation interleaves read-modify-write steps deterministically because true parallel mutation is unavailable in single-threaded JS—document this limitation when interpreting results.

## Deadlock Detection Helper

`would_deadlock_orders(a, b)` returns true when two lock acquisition orders are cyclic (A→B vs B→A). This is a **static ordering check**, not runtime deadlock recovery.

## Related Documents

- [[01-Computer-Science/projects/Concurrency Zoo/README|README]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/ADR/0002-concurrency-model|ADR-0002]]
- [[01-Computer-Science/code/typescript/src/runtime.ts|runtime.ts]]
