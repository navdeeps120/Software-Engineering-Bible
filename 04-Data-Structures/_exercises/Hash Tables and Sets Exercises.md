---
title: Hash Tables and Sets Exercises
aliases: [Hash Tables and Sets Drills]
track: 04-Data-Structures
topic: hash-tables-and-sets-exercises
difficulty: intermediate
status: active
prerequisites: ["[[04-Data-Structures/README|Data Structures]]"]
tags: [exercises, data-structures, hash-tables-and-sets]
created: 2026-07-21
updated: 2026-07-21
---

# Hash Tables and Sets Exercises

Build and defend hash maps and sets under chaining, open addressing, equality contracts, and adversarial load.

## Linked Topic

- [[04-Data-Structures/04-Hash-Tables-and-Sets/Hash Functions Avalanche and Equality Contracts|Hash Functions Avalanche and Equality Contracts]]
- [[04-Data-Structures/04-Hash-Tables-and-Sets/Separate Chaining|Separate Chaining]]
- [[04-Data-Structures/04-Hash-Tables-and-Sets/Open Addressing|Open Addressing]]
- [[04-Data-Structures/04-Hash-Tables-and-Sets/Sets Multisets and Map vs Set|Sets Multisets and Map vs Set]]
- [[04-Data-Structures/04-Hash-Tables-and-Sets/Hash-Flooding DoS and Randomized Hashing|Hash-Flooding DoS and Randomized Hashing]]
- [[04-Data-Structures/04-Hash-Tables-and-Sets/Ordered Maps via Trees vs Hashing|Ordered Maps via Trees vs Hashing]]

## Progression

**Understand → Implement → Optimize → Debug Invariant → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Explain why mutable keys break hash tables. Relate `hash(k)`, `==`, and bucket placement using [[04-Data-Structures/04-Hash-Tables-and-Sets/Hash Functions Avalanche and Equality Contracts|Hash Functions and Equality Contracts]].

**Acceptance criteria:**

- [ ] Hash-equality contract stated
- [ ] Mutation failure example
- [ ] Immutable key recommendation

### Problem 2 — `intermediate`

**Prompt:** For load factor 0.75, compare expected probes for successful/unsuccessful lookup in chaining vs linear probing under uniform hashing assumption.

**Hint:** See [[04-Data-Structures/04-Hash-Tables-and-Sets/Separate Chaining|Separate Chaining]] and [[04-Data-Structures/04-Hash-Tables-and-Sets/Open Addressing|Open Addressing]].

**Acceptance criteria:**

- [ ] Assumptions listed
- [ ] Probe counts compared
- [ ] Deletion tombstone note for OA

## Implement

### Problem 1 — `beginner`

**Prompt:** Implement ChainingHashMap + HashSet labs against shared vectors with explicit load-factor rehash threshold.

**Acceptance criteria:**

- [ ] Rehash triggers tested
- [ ] TS/Python parity
- [ ] Load factor metric exposed in debug

### Problem 2 — `intermediate`

**Prompt:** Implement linear probing with tombstones; add vectors that insert/delete/reinsert the same key and verify find still O(1) expected.

**Acceptance criteria:**

- [ ] Tombstone cleanup or find logic correct
- [ ] Clustering discussed in comments
- [ ] Regression vectors added

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Measure pause times during rehash at 1M keys. Propose incremental rehash or double-buffer strategy with correctness sketch.

**Acceptance criteria:**

- [ ] Pause distribution measured
- [ ] Incremental plan outlined
- [ ] User-visible latency target

### Problem 2 — `advanced`

**Prompt:** When should an implementation switch from flat open addressing to overflow buckets? Define threshold with benchmark on 0–32 entry maps.

**Acceptance criteria:**

- [ ] Threshold justified
- [ ] Memory footprint compared
- [ ] Fallback path tested

## Debug Invariant

### Problem 1 — `intermediate`

**Prompt:** Open addressing search loops forever when table full without tombstones. Identify missing guard and add invariant on empty slots.

**Acceptance criteria:**

- [ ] Probe limit or load cap enforced
- [ ] Test reproduces loop
- [ ] Error surfaced clearly

### Problem 2 — `advanced`

**Prompt:** Craft collision-heavy keys to degrade chaining buckets. Add per-bucket length metrics and mitigation per [[04-Data-Structures/04-Hash-Tables-and-Sets/Hash-Flooding DoS and Randomized Hashing|Hash-Flooding DoS]].

**Acceptance criteria:**

- [ ] Adversarial vector
- [ ] Mitigation named (seeded hash, treeify bucket)
- [ ] Alert threshold defined

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Pick map implementation for 500K sessions with TTL eviction elsewhere. Document concurrency and serialization assumptions.

**Acceptance criteria:**

- [ ] Structure + external TTL split
- [ ] Memory estimate
- [ ] DoS considerations

### Problem 2 — `advanced`

**Prompt:** Product needs sorted iteration occasionally but mostly O(1) lookup. Compare tree map vs hash + sort-on-export for 10K keys.

**Acceptance criteria:**

- [ ] Workload assumptions
- [ ] Complexity for each access pattern
- [ ] Migration if requirements shift

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contracts | Names operations only | States invariants, errors, and complexity assumptions |
| Implementation | Passes happy path | Shared vectors green; edge cases and debug checks |
| Production | Picks a structure by habit | Justifies layout, telemetry, migration, and rollback |

## Related Notes

- [[04-Data-Structures/code/README|code labs]]
- [[04-Data-Structures/_interview/Hash Tables and Sets Interview.md|Hash Tables and Sets Interview]]
- [[04-Data-Structures/README|Data Structures]]
- [[Career/README|Career]]
