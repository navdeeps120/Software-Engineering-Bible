---
title: Trees and Ordered Maps Exercises
aliases: [Trees and Ordered Maps Drills]
track: 04-Data-Structures
topic: trees-and-ordered-maps-exercises
difficulty: intermediate
status: active
prerequisites: ["[[04-Data-Structures/README|Data Structures]]"]
tags: [exercises, data-structures, trees-and-ordered-maps]
created: 2026-07-21
updated: 2026-07-21
---

# Trees and Ordered Maps Exercises

Maintain search-tree invariants, traversals, and self-balancing concepts for ordered maps under mutation.

## Linked Topic

- [[04-Data-Structures/05-Trees-and-Ordered-Maps/Tree Representation and Traversal Contracts|Tree Representation and Traversal Contracts]]
- [[04-Data-Structures/05-Trees-and-Ordered-Maps/Binary Search Trees|Binary Search Trees]]
- [[04-Data-Structures/05-Trees-and-Ordered-Maps/AVL Trees|AVL Trees]]
- [[04-Data-Structures/05-Trees-and-Ordered-Maps/Red-Black Trees Concepts|Red-Black Trees Concepts]]
- [[04-Data-Structures/05-Trees-and-Ordered-Maps/B-Trees and B-Plus Trees Concepts|B-Trees and B-Plus Trees Concepts]]
- [[04-Data-Structures/05-Trees-and-Ordered-Maps/Treaps and Scapegoat Trees Concepts|Treaps and Scapegoat Trees Concepts]]

## Progression

**Understand → Implement → Optimize → Debug Invariant → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** State the core ADT operations for trees and ordered maps and one structural invariant each concrete lab (BST, AVL) must preserve. Draw a Mermaid diagram from ADT to memory layout.

**Hint:** Review [[04-Data-Structures/05-Trees-and-Ordered-Maps/Tree Representation and Traversal Contracts|Tree Representation and Traversal Contracts]].

**Acceptance criteria:**

- [ ] Operations with pre/post conditions
- [ ] Invariant stated
- [ ] Diagram includes layout

### Problem 2 — `intermediate`

**Prompt:** Build a complexity table for the hot operations in [[04-Data-Structures/05-Trees-and-Ordered-Maps/Binary Search Trees|Binary Search Trees]]. Label worst, average, and amortized where applicable and list assumptions (input distribution, capacity bounds).

**Acceptance criteria:**

- [ ] Table complete for ≥4 operations
- [ ] Assumptions explicit
- [ ] Links to complexity note

## Implement

### Problem 1 — `beginner`

**Prompt:** Implement or verify BST, AVL in [[04-Data-Structures/code/README|code labs]] against shared JSON vectors. Both TypeScript (Vitest) and Python (pytest) must pass.

**Acceptance criteria:**

- [ ] All shared vectors green
- [ ] Public API documented
- [ ] Invariant checks in debug mode

### Problem 2 — `intermediate`

**Prompt:** Add property-style tests for empty, singleton, and maximum-capacity cases for BST, AVL. Include regression tests for any bug found during development.

**Hint:** Use vectors under `shared/vectors/`.

**Acceptance criteria:**

- [ ] ≥3 edge suites
- [ ] Deterministic seeds
- [ ] CI commands documented

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Profile BST, AVL on sequential vs random access patterns. Propose one allocation or layout change that improves throughput without breaking ADT semantics.

**Hint:** Relate to [[04-Data-Structures/00-Orientation-and-Contracts/Memory Layout Locality and Allocation Patterns|Memory Layout Locality]].

**Acceptance criteria:**

- [ ] Before/after benchmark
- [ ] Semantics unchanged
- [ ] Trade-off paragraph

### Problem 2 — `advanced`

**Prompt:** Given a fixed memory ceiling, choose parameters (capacity growth, node pooling, bit width) for trees and ordered maps serving 10M elements. Justify with numbers.

**Acceptance criteria:**

- [ ] Budget calculation shown
- [ ] Failure mode if exceeded
- [ ] Alternative structure named

## Debug Invariant

### Problem 1 — `intermediate`

**Prompt:** A test fails intermittently on BST, AVL with corrupted size or ordering. Write invariants, bisection steps, and a minimal failing vector.

**Acceptance criteria:**

- [ ] ≥2 invariants formalized
- [ ] Minimal repro captured
- [ ] Root cause tied to contract

### Problem 2 — `advanced`

**Prompt:** Logs show impossible state (negative size, cycle in links, heap property break). Design debug assertions and a safe degraded mode while preserving user data.

**Hint:** See [[04-Data-Structures/05-Trees-and-Ordered-Maps/Treaps and Scapegoat Trees Concepts|Treaps and Scapegoat Trees Concepts]].

**Acceptance criteria:**

- [ ] Assertions catch corruption
- [ ] Degraded mode defined
- [ ] Runbook steps listed

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Select trees and ordered maps for a latency-sensitive microservice endpoint. Document SLO, concurrency model, and failure handling.

**Acceptance criteria:**

- [ ] Structure choice justified
- [ ] Mermaid request path
- [ ] Monitoring hooks named

### Problem 2 — `advanced`

**Prompt:** Migrate live traffic from an old representation to BST, AVL with dual-write or shadow validation. Define rollback triggers and data validation.

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
- [[04-Data-Structures/_interview/Trees and Ordered Maps Interview.md|Trees and Ordered Maps Interview]]
- [[04-Data-Structures/README|Data Structures]]
- [[Career/README|Career]]
