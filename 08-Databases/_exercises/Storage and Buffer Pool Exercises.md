---
title: Storage and Buffer Pool Exercises
aliases: [Storage and Buffer Pool Drills]
track: 08-Databases
topic: storage-and-buffer-pool-exercises
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, storage, buffer-pool, pages]
created: 2026-07-22
updated: 2026-07-22
---

# Storage and Buffer Pool Exercises

Reason about pages as I/O units, tuple layout on disk, heap vs clustered organization, buffer pool eviction vs OS page cache, and free-space fragmentation.

## Linked Topic

- [[08-Databases/01-Storage-and-Buffer-Pool/Pages Blocks and IO Units|Pages Blocks and I/O Units]]
- [[08-Databases/01-Storage-and-Buffer-Pool/Heap Tables vs Clustered Layouts|Heap Tables vs Clustered Layouts]]
- [[08-Databases/01-Storage-and-Buffer-Pool/Tuple Layout and Oversized Values|Tuple Layout and Oversized Values]]
- [[08-Databases/01-Storage-and-Buffer-Pool/Buffer Pool vs OS Page Cache|Buffer Pool vs OS Page Cache]]
- [[08-Databases/01-Storage-and-Buffer-Pool/Free Space Maps Fillfactor and Fragmentation|Free Space Maps Fillfactor and Fragmentation]]

## Progression

**Understand ↁEImplement ↁEOptimize ↁEDebug ↁEProduction Scenario**

## Understand

### Problem 1  E`beginner`

**Prompt:** Draw a page diagram with header, line pointers, and tuple slots. Label how a heap insert finds space and what happens when the page is full.

**Hint:** [[08-Databases/01-Storage-and-Buffer-Pool/Pages Blocks and IO Units|Pages Blocks and I/O Units]].

**Acceptance criteria:**

- [ ] Page header fields named (LSN, free space offset)
- [ ] Insert path through free space map sketched
- [ ] Cross-link to [[04-Data-Structures/00-Orientation-and-Contracts/Memory Layout Locality and Allocation Patterns|Memory Layout Locality]]

### Problem 2  E`intermediate`

**Prompt:** Contrast heap-organized tables with clustered (index-organized) layouts for a time-series events table. Which access patterns favor each?

**Hint:** [[08-Databases/01-Storage-and-Buffer-Pool/Heap Tables vs Clustered Layouts|Heap Tables vs Clustered Layouts]].

**Acceptance criteria:**

- [ ] Range scan vs random lookup trade-offs
- [ ] Update/insert amplification compared
- [ ] When HOT-style updates apply (forward reference to PostgreSQL module)

## Implement

### Problem 1  E`beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], implement a fixed-size page with slot array: insert tuple, read by slot id, delete leaving tombstone hole.

**Acceptance criteria:**

- [ ] Page size configurable (e.g., 8 KiB)
- [ ] Insert returns slot id; delete marks slot dead
- [ ] Unit tests for full-page rejection

### Problem 2  E`intermediate`

**Prompt:** Implement an LRU buffer pool over page ids: pin/unpin, dirty tracking, eviction of unpinned clean pages only.

**Hint:** Mirror [[08-Databases/01-Storage-and-Buffer-Pool/Buffer Pool vs OS Page Cache|Buffer Pool vs OS Page Cache]].

**Acceptance criteria:**

- [ ] Pin count prevents eviction
- [ ] Dirty pages flushed before eviction (stub flush OK)
- [ ] Hit/miss counters exposed for tests

## Optimize

### Problem 1  E`intermediate`

**Prompt:** A table with wide JSON payloads causes excessive TOAST/off-page storage. Propose tuple layout changes and measure I/O per row read.

**Hint:** [[08-Databases/01-Storage-and-Buffer-Pool/Tuple Layout and Oversized Values|Tuple Layout and Oversized Values]].

**Acceptance criteria:**

- [ ] Inline vs out-of-line threshold explained
- [ ] Before/after pages-read estimate for typical query
- [ ] Migration strategy without rewrite downtime fantasy

### Problem 2  E`advanced`

**Prompt:** Tune `fillfactor` and FSM maintenance for a table with 70% update-in-place vs 30% append-only inserts. Predict fragmentation and vacuum pressure.

**Acceptance criteria:**

- [ ] Fillfactor choice justified with update pattern
- [ ] FSM role in insert routing explained
- [ ] Monitoring metrics named (dead tuples, bloat)

## Debug

### Problem 1  E`intermediate`

**Prompt:** Buffer pool hit ratio drops from 99% to 60% after a deployment. Write a debug brief separating working-set growth from sequential scan storm.

**Acceptance criteria:**

- [ ] Distinguish buffer pool from OS page cache
- [ ] Three hypotheses with pg_buffercache or lab equivalent
- [ ] Links to [[01-Computer-Science/02-Machine-Model/Cache Hierarchy and Locality|Cache Hierarchy and Locality]]

### Problem 2  E`advanced`

**Prompt:** Inserts suddenly slow on a "small" table. Investigation shows every insert allocates a new page despite deletes. Diagnose FSM staleness vs fillfactor mismatch.

**Acceptance criteria:**

- [ ] Root cause tied to free space visibility
- [ ] `VACUUM` / FSM update role explained
- [ ] Regression test or replay vector defined

## Production Scenario

### Problem 1  E`intermediate`

**Prompt:** Platform defaults `shared_buffers` to 128 MiB on 64 GiB RAM hosts. Draft sizing guidance with measurement protocol before change.

**Acceptance criteria:**

- [ ] Sizing heuristic with upper-bound rationale
- [ ] Rollout plan with cache-hit and latency SLIs
- [ ] Rollback if working set exceeds pool

### Problem 2  E`advanced`

**Prompt:** A analytics workload runs sequential scans that evict OLTP hot pages from the buffer pool. Propose isolation without separate hardware—connection pools, extensions, or storage tiering.

**Acceptance criteria:**

- [ ] Mermaid architecture for mixed workload
- [ ] Trade-offs of read replicas vs `pg_prewarm` vs cgroup IO limits
- [ ] Handoff to [[08-Databases/12-Production-Database-Ops/Connection Pooling at Engine and Proxy|Connection Pooling]]

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Pages | "Rows on disk" | Page headers, slots, FSM, I/O unit reasoning |
| Buffer pool | "More RAM helps" | Pin/evict/dirty, vs OS cache, measurable hit ratio |
| Production | Default config | Sized from workload, mixed-workload isolation plan |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/Storage and Buffer Pool Interview.md|Storage and Buffer Pool Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
