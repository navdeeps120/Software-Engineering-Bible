---
title: ADR-0002 Concurrency Model
aliases: [ADR-0002]
track: 01-Computer-Science
topic: concurrent-runtime-protocol-workbench-adr-0002
difficulty: advanced
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Concurrency Zoo/README|Concurrency Zoo]]"
tags: [adr, architecture, concurrency]
created: 2026-07-21
updated: 2026-07-21
---

# ADR-0002: Bounded Buffer + Fixed Worker Pool

Project-local decision record for workbench job scheduling and backpressure.

## Status

`accepted`

## Context

Bytecode jobs arrive over TCP asynchronously. Unbounded enqueue would allow memory exhaustion under burst load. We need a concurrency model that:

- Limits in-flight work
- Signals rejection to clients (`queue_full`)
- Maps cleanly to [[01-Computer-Science/projects/Concurrency Zoo/README|Concurrency Zoo]] teaching material

## Decision

Use a **fixed-size worker pool** pulling from a **bounded buffer queue**:

- Queue: `BoundedBuffer` with configurable capacity (default 8)
- Workers: N async tasks / threads (default 2)
- Admission: `tryPush` on enqueue — return error frame immediately when full
- No unbounded `push` on the hot path for untrusted load

## Options Considered

### Option A — Bounded buffer + fixed workers (chosen)

- Pros: Predictable memory; explicit backpressure; teaches production queue patterns
- Cons: Requires client retry; tuning capacity/workers

### Option B — Unbounded queue + fixed workers

- Pros: Never rejects clients
- Cons: OOM under burst; hides saturation until too late

### Option C — Per-connection goroutine / thread

- Pros: Simple code
- Cons: Unbounded concurrency; VM storms possible

## Trade-offs

| Concern | Choice impact |
| --- | --- |
| Correctness | Jobs either accepted or explicitly rejected |
| Operability | `/status` exposes `queue_depth` and `capacity` |
| Cost | Fixed worker count caps CPU |
| Delivery speed | Reuses runtime lab |
| Future flexibility | Can swap buffer for persistent queue with ADR |

## Consequences

### Positive

- Aligns with [[01-Computer-Science/05-Concurrency-Fundamentals/Backpressure and Resource Contention|Backpressure and Resource Contention]] curriculum
- Failure demo: saturate queue in tests

### Negative

- Clients must handle `queue_full` (retry with jitter)
- Fixed pool may under-utilize CPU on I/O-heavy future jobs

### Follow-ups

- [ ] Integration test: fill queue then assert reject
- [ ] Document recommended client retry in API.md

## Related Documents

- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Architecture|Architecture]]
- [[01-Computer-Science/projects/Concurrency Zoo/Architecture|Concurrency Zoo Architecture]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Requirements|Requirements]]
- [[00-Templates/ADR Template|ADR Template]]
