---
title: Contiguous Sequences Exercises
aliases: [Contiguous Sequences Drills]
track: 04-Data-Structures
topic: contiguous-sequences-exercises
difficulty: beginner
status: active
prerequisites: ["[[04-Data-Structures/README|Data Structures]]"]
tags: [exercises, data-structures, contiguous-sequences]
created: 2026-07-21
updated: 2026-07-21
---

# Contiguous Sequences Exercises

Master fixed and dynamic contiguous layouts, strides, bitsets, and ring buffers as the locality baseline for the track.

## Linked Topic

- [[04-Data-Structures/01-Contiguous-Sequences/Fixed-Capacity Arrays|Fixed-Capacity Arrays]]
- [[04-Data-Structures/01-Contiguous-Sequences/Dynamic Arrays and Amortized Growth|Dynamic Arrays and Amortized Growth]]
- [[04-Data-Structures/01-Contiguous-Sequences/Multidimensional Arrays and Strides|Multidimensional Arrays and Strides]]
- [[04-Data-Structures/01-Contiguous-Sequences/Bitsets and Compact Boolean Arrays|Bitsets and Compact Boolean Arrays]]
- [[04-Data-Structures/01-Contiguous-Sequences/Ring Buffers as Contiguous Queues|Ring Buffers as Contiguous Queues]]

## Progression

**Understand → Implement → Optimize → Debug Invariant → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** For a row-major `float64` matrix shape `(rows=4, cols=3)`, compute byte offset of element `(2,1)` from base. Show formula using strides from [[04-Data-Structures/01-Contiguous-Sequences/Multidimensional Arrays and Strides|Multidimensional Arrays and Strides]].

**Acceptance criteria:**

- [ ] Stride values shown
- [ ] Offset calculation correct
- [ ] Out-of-bounds index behavior stated

### Problem 2 — `intermediate`

**Prompt:** Compare 1.5× vs 2× growth for dynamic arrays under 1M append operations. When does each win on memory vs realloc count?

**Hint:** See [[04-Data-Structures/01-Contiguous-Sequences/Dynamic Arrays and Amortized Growth|Dynamic Arrays and Amortized Growth]].

**Acceptance criteria:**

- [ ] Amortized O(1) argument sketched
- [ ] Peak memory compared
- [ ] Trade-off paragraph

## Implement

### Problem 1 — `beginner`

**Prompt:** Pass all shared vectors for DynamicArray in [[04-Data-Structures/code/README|code labs]] (TS + Python). Document `capacity`, `size`, and growth factor.

**Acceptance criteria:**

- [ ] All vectors green
- [ ] Growth factor configurable in tests
- [ ] Debug invariant on size ≤ capacity

### Problem 2 — `intermediate`

**Prompt:** Extend RingBuffer with optional overwrite-on-full policy for telemetry streams. Add vectors for both reject-full and overwrite modes.

**Hint:** See [[04-Data-Structures/01-Contiguous-Sequences/Ring Buffers as Contiguous Queues|Ring Buffers]].

**Acceptance criteria:**

- [ ] Policy explicit in API
- [ ] Head/tail invariants tested
- [ ] Both modes covered by vectors

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Optimize `next_set_bit(i)` in Bitset lab for dense vs sparse patterns without changing semantics.

**Acceptance criteria:**

- [ ] Benchmark on two fixtures
- [ ] Technique named (word-at-a-time, popcount)
- [ ] No semantic regression

### Problem 2 — `advanced`

**Prompt:** Prototype a bump-arena allocator backing fixed-capacity arrays for a batch job. Compare alloc count vs system malloc for 10M inserts.

**Acceptance criteria:**

- [ ] Arena lifecycle documented
- [ ] Reset vs destroy semantics
- [ ] Numbers or reasoned estimate

## Debug Invariant

### Problem 1 — `intermediate`

**Prompt:** Queue appears full when empty after wraparound. Formalize `(head, tail, count)` invariants and locate the bug.

**Acceptance criteria:**

- [ ] Invariants written
- [ ] Minimal repro vector
- [ ] Fix verified by tests

### Problem 2 — `advanced`

**Prompt:** Two views mutate the same dynamic array backing store causing stale length. Add versioning or copy-on-write guard in debug builds.

**Acceptance criteria:**

- [ ] Aliasing scenario reproduced
- [ ] Detection strategy
- [ ] User contract clarified

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Design a fixed-size ring buffer for per-host metrics shipped to Kafka. Define drop vs block policy under overload.

**Acceptance criteria:**

- [ ] Capacity sizing rationale
- [ ] Mermaid producer/consumer flow
- [ ] Observability for drops

### Problem 2 — `advanced`

**Prompt:** Choose contiguous layouts for analytics ingestion (SoA vs AoS). Justify cache behavior and migration from row JSON.

**Acceptance criteria:**

- [ ] Layout diagram
- [ ] Scan vs update trade-offs
- [ ] Phased migration plan

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contracts | Names operations only | States invariants, errors, and complexity assumptions |
| Implementation | Passes happy path | Shared vectors green; edge cases and debug checks |
| Production | Picks a structure by habit | Justifies layout, telemetry, migration, and rollback |

## Related Notes

- [[04-Data-Structures/code/README|code labs]]
- [[04-Data-Structures/_interview/Contiguous Sequences Interview.md|Contiguous Sequences Interview]]
- [[04-Data-Structures/README|Data Structures]]
- [[Career/README|Career]]
