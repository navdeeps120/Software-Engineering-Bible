---
title: Disjoint Set Exercises
aliases: [Disjoint Set Drills]
track: 04-Data-Structures
topic: disjoint-set-exercises
difficulty: intermediate
status: active
prerequisites: ["[[04-Data-Structures/README|Data Structures]]"]
tags: [exercises, data-structures, disjoint-set]
created: 2026-07-21
updated: 2026-07-21
---

# Disjoint Set Exercises

Implement union-find with rank and path compression as connectivity glue for algorithms and services.

## Linked Topic

- [[04-Data-Structures/09-Disjoint-Set/Union-Find Structure|Union-Find Structure]]
- [[04-Data-Structures/09-Disjoint-Set/Union by Rank and Path Compression|Union by Rank and Path Compression]]
- [[04-Data-Structures/09-Disjoint-Set/Disjoint-Set Applications as Glue|Disjoint-Set Applications as Glue]]

## Progression

**Understand → Implement → Optimize → Debug Invariant → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** State the core ADT operations for disjoint set and one structural invariant each concrete lab (UnionFind) must preserve. Draw a Mermaid diagram from ADT to memory layout.

**Hint:** Review [[04-Data-Structures/09-Disjoint-Set/Union-Find Structure|Union-Find Structure]].

**Acceptance criteria:**

- [ ] Operations with pre/post conditions
- [ ] Invariant stated
- [ ] Diagram includes layout

### Problem 2 — `intermediate`

**Prompt:** Build a complexity table for the hot operations in [[04-Data-Structures/09-Disjoint-Set/Union by Rank and Path Compression|Union by Rank and Path Compression]]. Label worst, average, and amortized where applicable and list assumptions (input distribution, capacity bounds).

**Acceptance criteria:**

- [ ] Table complete for ≥4 operations
- [ ] Assumptions explicit
- [ ] Links to complexity note

## Implement

### Problem 1 — `beginner`

**Prompt:** Implement or verify UnionFind in [[04-Data-Structures/code/README|code labs]] against shared JSON vectors. Both TypeScript (Vitest) and Python (pytest) must pass.

**Acceptance criteria:**

- [ ] All shared vectors green
- [ ] Public API documented
- [ ] Invariant checks in debug mode

### Problem 2 — `intermediate`

**Prompt:** Add property-style tests for empty, singleton, and maximum-capacity cases for UnionFind. Include regression tests for any bug found during development.

**Hint:** Use vectors under `shared/vectors/`.

**Acceptance criteria:**

- [ ] ≥3 edge suites
- [ ] Deterministic seeds
- [ ] CI commands documented

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Profile UnionFind on sequential vs random access patterns. Propose one allocation or layout change that improves throughput without breaking ADT semantics.

**Hint:** Relate to [[04-Data-Structures/00-Orientation-and-Contracts/Memory Layout Locality and Allocation Patterns|Memory Layout Locality]].

**Acceptance criteria:**

- [ ] Before/after benchmark
- [ ] Semantics unchanged
- [ ] Trade-off paragraph

### Problem 2 — `advanced`

**Prompt:** Given a fixed memory ceiling, choose parameters (capacity growth, node pooling, bit width) for disjoint set serving 10M elements. Justify with numbers.

**Acceptance criteria:**

- [ ] Budget calculation shown
- [ ] Failure mode if exceeded
- [ ] Alternative structure named

## Debug Invariant

### Problem 1 — `intermediate`

**Prompt:** A test fails intermittently on UnionFind with corrupted size or ordering. Write invariants, bisection steps, and a minimal failing vector.

**Acceptance criteria:**

- [ ] ≥2 invariants formalized
- [ ] Minimal repro captured
- [ ] Root cause tied to contract

### Problem 2 — `advanced`

**Prompt:** Logs show impossible state (negative size, cycle in links, heap property break). Design debug assertions and a safe degraded mode while preserving user data.

**Hint:** See [[04-Data-Structures/09-Disjoint-Set/Disjoint-Set Applications as Glue|Disjoint-Set Applications as Glue]].

**Acceptance criteria:**

- [ ] Assertions catch corruption
- [ ] Degraded mode defined
- [ ] Runbook steps listed

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Select disjoint set for a latency-sensitive microservice endpoint. Document SLO, concurrency model, and failure handling.

**Acceptance criteria:**

- [ ] Structure choice justified
- [ ] Mermaid request path
- [ ] Monitoring hooks named

### Problem 2 — `advanced`

**Prompt:** Migrate live traffic from an old representation to UnionFind with dual-write or shadow validation. Define rollback triggers and data validation.

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
- [[04-Data-Structures/_interview/Disjoint Set Interview.md|Disjoint Set Interview]]
- [[04-Data-Structures/README|Data Structures]]
- [[Career/README|Career]]
