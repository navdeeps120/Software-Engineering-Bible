---
title: Storage and Buffer Pool Interview
aliases: [Storage and Buffer Pool Interview Questions]
track: 08-Databases
topic: storage-and-buffer-pool-interview
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/01-Storage-and-Buffer-Pool/Pages Blocks and I/O Units|Pages Blocks and I/O Units]]"]
tags: [interviews, databases, storage, buffer-pool]
created: 2026-07-22
updated: 2026-07-22
---

# Storage and Buffer Pool Interview

## Linked Topic

- [[08-Databases/01-Storage-and-Buffer-Pool/Pages Blocks and I/O Units|Pages Blocks and I/O Units]]
- [[08-Databases/01-Storage-and-Buffer-Pool/Heap Tables vs Clustered Layouts|Heap Tables vs Clustered Layouts]]
- [[08-Databases/01-Storage-and-Buffer-Pool/Tuple Layout and Oversized Values|Tuple Layout and Oversized Values]]
- [[08-Databases/01-Storage-and-Buffer-Pool/Buffer Pool vs OS Page Cache|Buffer Pool vs OS Page Cache]]
- [[08-Databases/01-Storage-and-Buffer-Pool/Free Space Maps Fillfactor and Fragmentation|Free Space Maps Fillfactor and Fragmentation]]

## How to Practice

1. Answer with page diagrams before prose.
2. Quantify I/O in pages, not rows.
3. Separate buffer pool from OS page cache explicitly.
4. Close with monitoring metrics and sizing trade-offs.

## Storage Fundamentals

1. What is a page and why do engines use fixed-size blocks?

   - Alignment, prefetch, buffer management
   - Typical sizes (8 KiB Postgres)
   - Relationship to disk sector and SSD page

2. Walk through heap page layout: header, line pointers, tuples.

   - Insert finding free space
   - Delete leaving holes; compaction vs HOT
   - Slot id stability

## Layout and Access

3. Heap vs clustered (index-organized) table — when does each win?

   - Range scans on clustering key
   - Random updates and page splits
   - Secondary index overhead difference

4. How do oversized values (TOAST, overflow pages) affect read amplification?

   - Inline threshold
   - Lazy fetch vs eager
   - Query design implications

## Buffer Pool

5. Why does Postgres maintain its own buffer pool if the OS has a page cache?

   - Double caching problem
   - Pin/evict/dirty lifecycle
   - `shared_buffers` vs OS cache interaction

6. Explain pin/unpin, dirty pages, and eviction policy.

   - LRU variants; clock sweep intuition
   - Cannot evict pinned pages
   - Checkpoint interaction

## Optimization

7. How would you tune fillfactor for a mixed insert/update table?

   - Update-in-place vs new row version
   - FSM role after deletes
   - Bloat and vacuum linkage

8. Sequential scan storm evicts OLTP hot set — mitigation options?

   - Replicas, resource groups, pool routing
   - `pg_prewarm`, buffer pool sizing
   - Workload separation

## Debug and Production

9. Buffer hit ratio dropped sharply — triage checklist.

   - Working set growth vs new scan pattern
   - Measurement tools
   - False comfort from OS cache

10. Inserts slow despite "plenty of free space" on disk — explain FSM staleness.

    - Visibility of free space to inserter
    - Vacuum/FSM update
    - `INSERT` path diagnosis

## Staff-Level

11. Size `shared_buffers` on a 64 GiB OLTP host — show your work.

    - Heuristics vs measurement
    - SLIs during rollout
    - When more buffers hurt

12. Design educational page store lab for new hires — learning outcomes?

    - Slot array, buffer pool LRU
    - Alignment with [[08-Databases/_exercises/Storage and Buffer Pool Exercises.md|Storage Exercises]]
    - Assessment rubric

13. When does storage layout belong in code review vs DBA review?

    - Wide rows, clustering keys, fillfactor
    - Migration ownership
    - Cross-team standards

14. Compare Postgres page model to MongoDB WiredTiger cache/page — similarities?

    - Document vs tuple packing
    - Cache pressure signals
    - Engine selection handoff

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Pages | Row storage vague | Header, slots, FSM, I/O units |
| Buffer pool | "Increase RAM" | Pin/dirty/evict, OS cache distinction |
| Production | Defaults | Sized, measured, mixed-workload plan |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/Storage and Buffer Pool Exercises.md|Storage and Buffer Pool Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
