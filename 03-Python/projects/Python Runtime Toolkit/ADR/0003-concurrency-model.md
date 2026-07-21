---
title: "Python Runtime Toolkit — ADR — 0003-concurrency-model"
aliases: []
track: 03-Python
topic: "python-runtime-toolkit-adr-0003-concurrency-model"
difficulty: advanced
status: active
prerequisites: []
tags: [adr, architecture, python, concurrency]
created: 2026-07-21
updated: 2026-07-21
---

# ADR-0003: Thread Pool with Ordered Results and Semaphore Guards

## Status

Accepted on 2026-07-21.

## Context

Bounded worker orchestration must teach backpressure and ordered aggregation without claiming to replace `concurrent.futures`, process pools, or asyncio task groups. Labs receive in-memory iterables and callables, not untrusted network load.

## Decision

Use `ThreadPoolExecutor` with a fixed `max_workers` concurrency cap for `map_limit`, storing results by input index to preserve order. Use `BoundedSemaphorePool` for explicit critical-section limiting. Reject non-positive concurrency at API boundaries.

## Options Considered

### Option A — Thread pool + indexed results (chosen)

- Pros: Uses stdlib primitives; teaches ordering versus completion order; simple mental model
- Cons: GIL limits CPU parallelism; sequential `result()` wait can increase tail latency

### Option B — asyncio task group with semaphores

- Pros: Aligns with asyncio-first services
- Cons: Mixes two scheduling models in v1; asyncio-lite is not production-grade

### Option C — Process pool

- Pros: CPU parallelism
- Cons: Serialization cost; heavier operational model; out of scope for mechanism labs

## Trade-offs

| Concern | Choice impact |
| --- | --- |
| Correctness | Results match input order; failures fail the aggregate call |
| Operability | Concurrency cap is explicit and testable |
| Cost | Thread count bounded; memory still materializes full input list |
| Future flexibility | Can add streaming mode with a versioned API |

## Consequences

### Positive

- Aligns with [[03-Python/projects/Bounded Worker Orchestrator/README|Bounded Worker Orchestrator]] and [[01-Computer-Science/05-Concurrency-Fundamentals/Backpressure and Resource Contention|Backpressure and Resource Contention]] curriculum
- Clear non-goals: no web servers, ORMs, or databases

### Negative

- Cannot cancel stuck threads from the API
- CPU-bound Python workloads do not scale linearly with thread count under the GIL

### Follow-ups

- [ ] Add worker exception and empty-input tests to integration suite
- [ ] Document when to choose asyncio or multiprocessing instead

## Related Documents

- [[03-Python/projects/Bounded Worker Orchestrator/Architecture|Bounded Worker Orchestrator Architecture]]
- [[03-Python/projects/Python Runtime Toolkit/Requirements|Requirements]]
- [[03-Python/07-Async-Concurrency-and-Free-Threading/Concurrency Models in Python|Concurrency Models in Python]]
