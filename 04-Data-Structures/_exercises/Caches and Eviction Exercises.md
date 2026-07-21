---
title: Caches and Eviction Exercises
aliases: [Caches and Eviction Drills]
track: 04-Data-Structures
topic: caches-and-eviction-exercises
difficulty: intermediate
status: active
prerequisites: ["[[04-Data-Structures/README|Data Structures]]"]
tags: [exercises, data-structures, caches-and-eviction]
created: 2026-07-21
updated: 2026-07-21
---

# Caches and Eviction Exercises

Combine hash maps with eviction policies (LRU, LFU concepts, TTL) under capacity and latency constraints.

## Linked Topic

- [[04-Data-Structures/11-Caches-and-Eviction/Cache ADT Get Put and Capacity|Cache ADT Get Put and Capacity]]
- [[04-Data-Structures/11-Caches-and-Eviction/LRU via Hash Map and Doubly Linked List|LRU via Hash Map and Doubly Linked List]]
- [[04-Data-Structures/11-Caches-and-Eviction/LFU Clock and Segmented LRU Concepts|LFU Clock and Segmented LRU Concepts]]
- [[04-Data-Structures/11-Caches-and-Eviction/TTL Soft References and Coalesced Expiry|TTL Soft References and Coalesced Expiry]]

## Progression

**Understand → Implement → Optimize → Debug Invariant → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** State the LRU invariant relating hash map and doubly linked list in [[04-Data-Structures/11-Caches-and-Eviction/LRU via Hash Map and Doubly Linked List|LRU via Hash Map and DLL]]. Draw Mermaid for `get` promoting a node.

**Acceptance criteria:**

- [ ] Map size equals list size
- [ ] Recency order invariant
- [ ] Diagram shows splice steps

### Problem 2 — `intermediate`

**Prompt:** Compare LRU, LFU, and TTL expiry for a CDN edge cache with scan-heavy traffic. When does each fail?

**Hint:** See LFU/TTL topic notes in module 11.

**Acceptance criteria:**

- [ ] Three failure modes named
- [ ] Workload assumptions explicit
- [ ] Hybrid policy suggestion

## Implement

### Problem 1 — `beginner`

**Prompt:** Implement LRUCache in code labs with O(1) get/put and capacity eviction. Pass shared vectors.

**Acceptance criteria:**

- [ ] O(1) operations argued
- [ ] Eviction order verified
- [ ] TS/Python green

### Problem 2 — `intermediate`

**Prompt:** Extend cache API with lazy TTL expiry on access plus optional background sweep hook (interface only). Document amortized cleanup cost.

**Hint:** See [[04-Data-Structures/11-Caches-and-Eviction/TTL Soft References and Coalesced Expiry|TTL and Coalesced Expiry]].

**Acceptance criteria:**

- [ ] Expiry semantics defined
- [ ] Sweep vs lazy trade-off
- [ ] Tests for expired keys

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Shard LRU by key hash to reduce mutex contention. What invariant breaks if evictions cross shards?

**Acceptance criteria:**

- [ ] Sharding layout
- [ ] Cross-shard eviction policy
- [ ] Contention estimate

### Problem 2 — `advanced`

**Prompt:** Design clock or segmented LRU for millions of entries with bounded metadata per key.

**Acceptance criteria:**

- [ ] Metadata bytes/key
- [ ] Hit rate vs true LRU discussion
- [ ] When approximation acceptable

## Debug Invariant

### Problem 1 — `intermediate`

**Prompt:** Map contains key but DLL missing node causes NPE on get. Write invariants linking map keys to list nodes.

**Acceptance criteria:**

- [ ] Bidirectional invariant checks
- [ ] Minimal repro
- [ ] Fix + regression

### Problem 2 — `advanced`

**Prompt:** Entries never expire after leap second / NTP jump. Define monotonic expiry strategy.

**Acceptance criteria:**

- [ ] Monotonic clock choice
- [ ] Edge case tests
- [ ] Ops runbook note

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Design process-local LRU fronting Redis with stampede protection. Specify structures in each tier.

**Acceptance criteria:**

- [ ] Mermaid architecture
- [ ] Eviction coordination
- [ ] Metrics per tier

### Problem 2 — `advanced`

**Prompt:** Bad key generator creates 100% distinct keys bypassing cache. Propose detection, key normalization, and policy change.

**Acceptance criteria:**

- [ ] Root cause analysis
- [ ] Telemetry alerts
- [ ] Rollback plan

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contracts | Names operations only | States invariants, errors, and complexity assumptions |
| Implementation | Passes happy path | Shared vectors green; edge cases and debug checks |
| Production | Picks a structure by habit | Justifies layout, telemetry, migration, and rollback |

## Related Notes

- [[04-Data-Structures/code/README|code labs]]
- [[04-Data-Structures/_interview/Caches and Eviction Interview.md|Caches and Eviction Interview]]
- [[04-Data-Structures/README|Data Structures]]
- [[Career/README|Career]]
