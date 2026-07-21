---
title: Concurrency Fundamentals Interview Questions
aliases: [Locks Race Deadlock Interviews]
track: 01-Computer-Science
topic: concurrency-fundamentals-interview-questions
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/05-Concurrency-Fundamentals/Concurrency vs Parallelism|Concurrency vs Parallelism]]"
tags: [interviews, concurrency, locks, races]
created: 2026-07-21
updated: 2026-07-21
---

# Concurrency Fundamentals Interview Questions

Concurrency interviews test invariants under interleaving—not whether you can spell `mutex`.

## Linked Topic

- [[01-Computer-Science/05-Concurrency-Fundamentals/Concurrency vs Parallelism|Concurrency vs Parallelism]]
- [[01-Computer-Science/05-Concurrency-Fundamentals/Race Conditions|Race Conditions]]
- [[01-Computer-Science/05-Concurrency-Fundamentals/Locks and Critical Sections|Locks and Critical Sections]]
- [[01-Computer-Science/05-Concurrency-Fundamentals/Semaphores and Condition Variables|Semaphores and Condition Variables]]
- [[01-Computer-Science/05-Concurrency-Fundamentals/Deadlocks Livelocks and Starvation|Deadlocks Livelocks and Starvation]]
- [[01-Computer-Science/05-Concurrency-Fundamentals/Atomics and Memory Ordering|Atomics and Memory Ordering]]
- [[01-Computer-Science/05-Concurrency-Fundamentals/Asynchronous Event-Driven Models|Asynchronous Event-Driven Models]]
- [[01-Computer-Science/05-Concurrency-Fundamentals/Backpressure and Resource Contention|Backpressure and Resource Contention]]

## How to Practice

1. Answer out loud in 2–5 minutes.
2. Draw a Mermaid or whiteboard diagram.
3. State trade-offs and failure modes.
4. Give a production story when possible.

## Conceptual

1. Concurrency vs. parallelism—examples in frontend, backend, and data pipeline.
2. Define race condition. What is a data race in the C++11 sense?
3. Mutex vs. semaphore vs. condition variable—when each?
4. Explain deadlock, livelock, starvation with real system examples.
5. What is backpressure? Where should it be applied in a microservice chain?

## Internal Implementation

1. How does a mutex implementation use atomic CAS and kernel futex/blocking?
2. Describe the JavaScript event loop: where parallelism exists (worker threads) vs. concurrency (tasks).
3. What memory orders do acquire/release provide? Why is relaxed insufficient for publishing a struct?

## Trade-offs and Judgment

1. Coarse lock vs. fine-grained sharding vs. lock-free queue for a metrics aggregator.
2. What breaks first at 10x threads: lock contention, context switches, or false sharing?
3. Optimistic vs. pessimistic concurrency for inventory at 1k orders/sec.
4. What would you not parallelize without a formal invariant and stress tests?

## Production

1. Double-charge incident during retry storm—trace idempotency and locking gaps.
2. Thread pool queue unbounded growth during outage—design shedding and health semantics.
3. "Works on my laptop" race—how CI should catch concurrency bugs.

## Coding / Design Prompts

1. Implement thread-safe lazy singleton in your language; discuss double-checked locking pitfalls.
2. Design a rate limiter shared across processes on one host (IPC vs. centralized service).

## Staff-Level Follow-ups

1. Set org-wide guidance: when actors, when threads, when async IO—decision matrix.
2. Postmortem culture for Heisenbugs—what tooling and review gates do you mandate?
3. Evaluate moving hot path from locks to lock-free structures—risk vs. team skill.

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| First principles | "Use async" | States invariants and interleavings |
| Trade-offs | Locks everywhere or nowhere | Picks mechanism per contention profile |
| Production sense | Ignores retries | Ties races to idempotency and queues |
| Depth | Stops at mutex API | Discusses ordering, starvation, backpressure |

## Related Notes

- [[Career/README|Career]]
- [[01-Computer-Science/_exercises/Concurrency Fundamentals Exercises|Concurrency Fundamentals Exercises]]
- [[01-Computer-Science/code/README|code labs]]
- [[09-System-Design/README|System Design]]
