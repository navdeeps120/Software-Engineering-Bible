---
title: Orientation and Contracts Exercises
aliases: [Orientation and Contracts Drills]
track: 04-Data-Structures
topic: orientation-and-contracts-exercises
difficulty: beginner
status: active
prerequisites: ["[[04-Data-Structures/README|Data Structures]]"]
tags: [exercises, data-structures, orientation-and-contracts]
created: 2026-07-21
updated: 2026-07-21
---

# Orientation and Contracts Exercises

Separate ADT contracts from concrete representations, complexity assumptions, and invariants before touching implementations.

## Linked Topic

- [[04-Data-Structures/00-Orientation-and-Contracts/Why Data Structures Exist|Why Data Structures Exist]]
- [[04-Data-Structures/00-Orientation-and-Contracts/Abstract Data Types vs Concrete Structures|Abstract Data Types vs Concrete Structures]]
- [[04-Data-Structures/00-Orientation-and-Contracts/Complexity Tables Amortization and Practical Constants|Complexity Tables Amortization and Practical Constants]]
- [[04-Data-Structures/00-Orientation-and-Contracts/Invariants Representation and Debug Assertions|Invariants Representation and Debug Assertions]]
- [[04-Data-Structures/00-Orientation-and-Contracts/Memory Layout Locality and Allocation Patterns|Memory Layout Locality and Allocation Patterns]]
- [[04-Data-Structures/00-Orientation-and-Contracts/Interface Design Capacity Errors and Iteration|Interface Design Capacity Errors and Iteration]]

## Progression

**Understand → Implement → Optimize → Debug Invariant → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** For a **Deque** ADT, list three operations with pre/post conditions. Then name two concrete representations and one invariant each representation must maintain after every mutation.

**Hint:** Start from [[04-Data-Structures/00-Orientation-and-Contracts/Abstract Data Types vs Concrete Structures|Abstract Data Types vs Concrete Structures]].

**Acceptance criteria:**

- [ ] Pre/post stated per operation
- [ ] Two representations named with distinct invariants
- [ ] Mermaid diagram linking ADT to representations

### Problem 2 — `intermediate`

**Prompt:** Fill a complexity table for `push_back`, `pop_front`, `insert(i,x)`, and `contains(x)` on dynamic array vs doubly linked list. Label each cell worst/average/amortized and state assumptions (index validity, load factor N/A).

**Acceptance criteria:**

- [ ] Every cell names case type
- [ ] Assumptions explicit
- [ ] Cross-link to [[04-Data-Structures/00-Orientation-and-Contracts/Complexity Tables Amortization and Practical Constants|Complexity Tables]]

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[04-Data-Structures/code/README|code labs]], add a reusable `assert_invariant(label, predicate)` helper used by at least two structures. Wire it behind a debug flag.

**Hint:** Mirror patterns from [[04-Data-Structures/00-Orientation-and-Contracts/Invariants Representation and Debug Assertions|Invariants and Debug Assertions]].

**Acceptance criteria:**

- [ ] Helper shared across TS/Python
- [ ] Fails fast with actionable message
- [ ] Tests cover passing and failing predicates

### Problem 2 — `intermediate`

**Prompt:** Implement typed errors for `CapacityExceeded`, `IndexOutOfRange`, and `EmptyStructure` with stable codes. Map them in interface docs for DynamicArray and Stack labs.

**Acceptance criteria:**

- [ ] Errors distinguish failure modes
- [ ] Public API documents throw/Result policy
- [ ] Shared vectors still pass

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Given two layouts for 1M int32 elements (contiguous vs linked nodes), estimate cache-line touches for sequential scan vs random insert at head. Document constants you assume.

**Hint:** Use [[04-Data-Structures/00-Orientation-and-Contracts/Memory Layout Locality and Allocation Patterns|Memory Layout Locality]].

**Acceptance criteria:**

- [ ] Scan vs insert compared
- [ ] Cache line size stated
- [ ] Conclusion ties to representation choice

### Problem 2 — `advanced`

**Prompt:** A trading feed requires bounded latency on `push_back`. Compare doubling growth vs fixed chunk growth; propose a hybrid policy with measurable SLO.

**Acceptance criteria:**

- [ ] Policy names reallocation trigger
- [ ] Worst-case per-op bound stated
- [ ] Benchmark or back-of-envelope numbers

## Debug Invariant

### Problem 1 — `intermediate`

**Prompt:** A dynamic array reports `len=5` but internal `capacity=8` and `size=6` after a buggy `pop`. Write a debug checklist and invariant function catching the drift before the next `get`.

**Acceptance criteria:**

- [ ] Invariant references size/capacity bounds
- [ ] Reproduction steps documented
- [ ] Fix strategy named

### Problem 2 — `advanced`

**Prompt:** Concurrent modification during iteration yields duplicate/missing elements without exceptions. Identify contract violation and add debug-mode detection.

**Hint:** See [[04-Data-Structures/00-Orientation-and-Contracts/Interface Design Capacity Errors and Iteration|Interface Design and Iteration]].

**Acceptance criteria:**

- [ ] Fail-fast or versioning strategy chosen
- [ ] Tests demonstrate detection
- [ ] User-facing contract updated

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Design public interfaces for list-like storage exposing `capacity`, iteration, and error semantics. Choose throw vs Result per language idioms.

**Acceptance criteria:**

- [ ] Contract table per operation
- [ ] Backward compatibility plan
- [ ] Mermaid ownership diagram

### Problem 2 — `advanced`

**Prompt:** Production logs show O(n) hotspots from repeated `insert(0,x)` on a vector-backed list. Propose telemetry, guardrails, and migration without flag day.

**Acceptance criteria:**

- [ ] Metrics name misuse patterns
- [ ] Alternative structure justified
- [ ] Rollout phases defined

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contracts | Names operations only | States invariants, errors, and complexity assumptions |
| Implementation | Passes happy path | Shared vectors green; edge cases and debug checks |
| Production | Picks a structure by habit | Justifies layout, telemetry, migration, and rollback |

## Related Notes

- [[04-Data-Structures/code/README|code labs]]
- [[04-Data-Structures/_interview/Orientation and Contracts Interview.md|Orientation and Contracts Interview]]
- [[04-Data-Structures/README|Data Structures]]
- [[Career/README|Career]]
