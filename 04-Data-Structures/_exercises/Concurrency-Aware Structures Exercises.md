---
title: Concurrency-Aware Structures Exercises
aliases: [Concurrency-Aware Structures Drills]
track: 04-Data-Structures
topic: concurrency-aware-structures-exercises
difficulty: advanced
status: active
prerequisites: ["[[04-Data-Structures/README|Data Structures]]"]
tags: [exercises, data-structures, concurrency-aware-structures]
created: 2026-07-21
updated: 2026-07-21
---

# Concurrency-Aware Structures Exercises

Classify thread-safety guarantees and implement guarded or lock-free variants without breaking ADT contracts.

## Linked Topic

- [[04-Data-Structures/13-Concurrency-Aware-Structures/Thread-Safety Classes|Thread-Safety Classes]]
- [[04-Data-Structures/13-Concurrency-Aware-Structures/Concurrent Queues|Concurrent Queues]]
- [[04-Data-Structures/13-Concurrency-Aware-Structures/Concurrent Hash Maps Concepts|Concurrent Hash Maps Concepts]]
- [[04-Data-Structures/13-Concurrency-Aware-Structures/False Sharing Padding and Contended Counters|False Sharing Padding and Contended Counters]]
- [[04-Data-Structures/13-Concurrency-Aware-Structures/Read-Copy-Update and Epoch Concepts|Read-Copy-Update and Epoch Concepts]]

## Progression

**Understand → Implement → Optimize → Debug Invariant → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** State the core ADT operations for concurrency-aware structures and one structural invariant each concrete lab (mutex-safe map and bounded concurrent queue labs) must preserve. Draw a Mermaid diagram from ADT to memory layout.

**Hint:** Review [[04-Data-Structures/13-Concurrency-Aware-Structures/Thread-Safety Classes|Thread-Safety Classes]].

**Acceptance criteria:**

- [ ] Operations with pre/post conditions
- [ ] Invariant stated
- [ ] Diagram includes layout

### Problem 2 — `intermediate`

**Prompt:** Build a complexity table for the hot operations in [[04-Data-Structures/13-Concurrency-Aware-Structures/Concurrent Queues|Concurrent Queues]]. Label worst, average, and amortized where applicable and list assumptions (input distribution, capacity bounds).

**Acceptance criteria:**

- [ ] Table complete for ≥4 operations
- [ ] Assumptions explicit
- [ ] Links to complexity note

## Implement

### Problem 1 — `beginner`

**Prompt:** Implement or verify mutex-safe map and bounded concurrent queue labs in [[04-Data-Structures/code/README|code labs]] against shared JSON vectors. Both TypeScript (Vitest) and Python (pytest) must pass.

**Acceptance criteria:**

- [ ] All shared vectors green
- [ ] Public API documented
- [ ] Invariant checks in debug mode

### Problem 2 — `intermediate`

**Prompt:** Add property-style tests for empty, singleton, and maximum-capacity cases for mutex-safe map and bounded concurrent queue labs. Include regression tests for any bug found during development.

**Hint:** Use vectors under `shared/vectors/`.

**Acceptance criteria:**

- [ ] ≥3 edge suites
- [ ] Deterministic seeds
- [ ] CI commands documented

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Profile mutex-safe map and bounded concurrent queue labs on sequential vs random access patterns. Propose one allocation or layout change that improves throughput without breaking ADT semantics.

**Hint:** Relate to [[04-Data-Structures/00-Orientation-and-Contracts/Memory Layout Locality and Allocation Patterns|Memory Layout Locality]].

**Acceptance criteria:**

- [ ] Before/after benchmark
- [ ] Semantics unchanged
- [ ] Trade-off paragraph

### Problem 2 — `advanced`

**Prompt:** Given a fixed memory ceiling, choose parameters (capacity growth, node pooling, bit width) for concurrency-aware structures serving 10M elements. Justify with numbers.

**Acceptance criteria:**

- [ ] Budget calculation shown
- [ ] Failure mode if exceeded
- [ ] Alternative structure named

## Debug Invariant

### Problem 1 — `intermediate`

**Prompt:** A test fails intermittently on mutex-safe map and bounded concurrent queue labs with corrupted size or ordering. Write invariants, bisection steps, and a minimal failing vector.

**Acceptance criteria:**

- [ ] ≥2 invariants formalized
- [ ] Minimal repro captured
- [ ] Root cause tied to contract

### Problem 2 — `advanced`

**Prompt:** Logs show impossible state (negative size, cycle in links, heap property break). Design debug assertions and a safe degraded mode while preserving user data.

**Hint:** See [[04-Data-Structures/13-Concurrency-Aware-Structures/Read-Copy-Update and Epoch Concepts|Read-Copy-Update and Epoch Concepts]].

**Acceptance criteria:**

- [ ] Assertions catch corruption
- [ ] Degraded mode defined
- [ ] Runbook steps listed

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Select concurrency-aware structures for a latency-sensitive microservice endpoint. Document SLO, concurrency model, and failure handling.

**Acceptance criteria:**

- [ ] Structure choice justified
- [ ] Mermaid request path
- [ ] Monitoring hooks named

### Problem 2 — `advanced`

**Prompt:** Migrate live traffic from an old representation to mutex-safe map and bounded concurrent queue labs with dual-write or shadow validation. Define rollback triggers and data validation.

**Acceptance criteria:**

- [ ] Phased rollout
- [ ] Validation oracle
- [ ] Rollback within SLO

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contracts | Names operations only | States invariants, errors, and complexity assumptions |
| Implementation | Passes happy path | Shared vectors green; edge cases and debug checks |
| Production | Picks a structure by habit | Justifies layout, telemetry, migration, and rollback |

## Related Notes

- [[04-Data-Structures/code/README|code labs]]
- [[04-Data-Structures/_interview/Concurrency-Aware Structures Interview.md|Concurrency-Aware Structures Interview]]
- [[04-Data-Structures/README|Data Structures]]
- [[Career/README|Career]]
