---
title: Caches and Eviction Interview
aliases: [Caches and Eviction Interview Questions]
track: 04-Data-Structures
topic: caches-and-eviction-interview
difficulty: intermediate
status: active
prerequisites: ["[[04-Data-Structures/11-Caches-and-Eviction/Cache ADT Get Put and Capacity|Cache ADT Get Put and Capacity]]"]
tags: [interviews, data-structures, caches-and-eviction]
created: 2026-07-21
updated: 2026-07-21
---

# Caches and Eviction Interview

## Linked Topic

- [[04-Data-Structures/11-Caches-and-Eviction/Cache ADT Get Put and Capacity|Cache ADT Get Put and Capacity]]
- [[04-Data-Structures/11-Caches-and-Eviction/LRU via Hash Map and Doubly Linked List|LRU via Hash Map and Doubly Linked List]]
- [[04-Data-Structures/11-Caches-and-Eviction/LFU Clock and Segmented LRU Concepts|LFU Clock and Segmented LRU Concepts]]
- [[04-Data-Structures/11-Caches-and-Eviction/TTL Soft References and Coalesced Expiry|TTL Soft References and Coalesced Expiry]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw memory layout and invariant checks before coding.
3. State complexity assumptions before quoting Big-O.
4. Close with a production failure mode and mitigation.

## Contracts

1. What ADT contract does Caches and Eviction expose (operations, errors, iteration)?

   - Name core ops with pre/post conditions
   - Distinguish abstract API from concrete representation
   - State failure modes: empty, full, invalid key/index

2. Which invariants must hold after every public mutation?

   - Size/count consistency with storage
   - Ordering, connectivity, or heap property as applicable
   - Capacity bounds and load-factor thresholds

## Internal Implementation

3. Walk memory layout for the primary lab structure (LRUCache).

   - Contiguous vs pointer-chasing layout
   - Header fields, alignment, metadata overhead
   - What is stored per element/key

4. What happens step-by-step on the hottest mutation path?

   - Algorithm steps with index/pointer updates
   - When reallocation, rehash, or rebalance triggers
   - Auxiliary structures updated in lockstep (e.g., LRU list)

## Coding

5. Implement or extend LRUCache to pass a new shared vector scenario.

   - Edge cases: empty, singleton, full capacity
   - Stable public API and error taxonomy
   - Tests in TypeScript and Python

6. Review buggy code that violates an invariant; patch and add regression tests.

   - Identify the broken invariant first
   - Minimal fix without scope creep
   - Optional debug assertion for future catches

## Complexity Assumptions

7. Give worst, average, and amortized costs for core operations with explicit assumptions.

   - Table with case labels on every cell
   - Input distribution and capacity assumptions stated
   - When Big-O hides large constants or periodic spikes

8. When does advertised O(1) fail in practice for this module?

   - Rehash, resize, rebalance, or pathological inputs
   - Adversarial workloads (hash flooding, sorted insert BST)
   - Memory pressure and allocator effects

## Locality and Memory Layout

9. Compare cache behavior for sequential scan vs random updates.

   - Cache lines, stride, and TLB effects at high level
   - When linked or node-heavy layouts win despite Big-O
   - Measure before claiming superiority

10. How do allocation patterns and false sharing affect throughput?

   - Arena/bump alloc vs per-node heap alloc
   - Padding or sharding for contended counters
   - Production profiling signals to watch

## Production Judgment

11. Choose between this module's structure and an alternative for a stated workload.

   - Latency, memory, and operational cost trade-offs
   - Concurrency model and attack surface (DoS, flooding)
   - Migration cost and observability plan

12. What telemetry detects structure misuse or mis-selection in production?

   - Hotspot operations (front insert, full scans, unbounded growth)
   - Capacity, eviction, rehash, and imbalance metrics
   - Alert thresholds tied to SLO impact

## Staff-Level Selection

13. How would you standardize structure selection across engineering teams?

   - Published decision matrix and review checklist
   - Exception process requiring evidence and expiry
   - Training/onboarding tied to shared vectors

14. How would you deprecate a representation without a flag day?

   - Dual-write, shadow reads, or compatibility adapters
   - Contract tests at service boundaries
   - Rollback triggers and communication plan

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contracts | Lists API names | States invariants, errors, iteration rules |
| Internals | Hand-waves pointers | Explains layout, hot paths, rehash/rebalance |
| Production | Picks a library default | Names workload, telemetry, migration, attack surface |

## Related Notes

- [[Career/README|Career]]
- [[04-Data-Structures/_exercises/Caches and Eviction Exercises.md|Caches and Eviction Exercises]]
- [[04-Data-Structures/code/README|code labs]]
- [[04-Data-Structures/README|Data Structures]]
