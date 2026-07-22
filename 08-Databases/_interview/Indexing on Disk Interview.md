---
title: Indexing on Disk Interview
aliases: [Indexing on Disk Interview Questions]
track: 08-Databases
topic: indexing-on-disk-interview
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/03-Indexing-on-Disk/B-Plus Trees as Page Structures|B-Plus Trees as Page Structures]]"]
tags: [interviews, databases, indexes, b-plus-tree]
created: 2026-07-22
updated: 2026-07-22
---

# Indexing on Disk Interview

## Linked Topic

- [[08-Databases/03-Indexing-on-Disk/B-Plus Trees as Page Structures|B-Plus Trees as Page Structures]]
- [[08-Databases/03-Indexing-on-Disk/Secondary Covering and Partial Indexes|Secondary Covering and Partial Indexes]]
- [[08-Databases/03-Indexing-on-Disk/Hash Indexes and Equality Lookups|Hash Indexes and Equality Lookups]]
- [[08-Databases/03-Indexing-on-Disk/GIN GiST and Bitmap Index Concepts|GIN GiST and Bitmap Index Concepts]]
- [[08-Databases/03-Indexing-on-Disk/Index-Only Scans and Visibility Map Hooks|Index-Only Scans and Visibility Map Hooks]]

## How to Practice

1. Sketch B+ tree page layout before answering.
2. Quantify heap fetches vs index-only paths.
3. Name write amplification for each index type.
4. Use EXPLAIN vocabulary in production questions.

## B+ Tree Mechanics

1. How does on-disk B+ tree differ from in-memory B-tree pedagogy?

   - Page-sized nodes, fanout
   - Leaf linked list for ranges
   - Split/merge on disk cost

2. Walk through point lookup from root to leaf.

   - Separator keys
   - TID/row pointer fetch
   - Buffer pool interaction

## Index Types

3. Secondary vs covering vs partial index — examples.

   - Column order for composite
   - Predicate selectivity
   - Write amplification trade-off

4. When use hash index vs btree?

   - Equality only
   - Rebuild/regression in Postgres history
   - Engine support differences

5. GIN vs GiST — what queries each serves?

   - JSONB containment, full text
   - Posting lists size explosion
   - Build and maintenance cost

## Index-Only Scans

6. What enables index-only scan in PostgreSQL?

   - Covering columns in index
   - Visibility map all-visible
   - Vacuum role

7. Index exists but seq scan chosen — debug order?

   - Statistics, correlation
   - Selectivity misestimate
   - `EXPLAIN ANALYZE` evidence

## Production

8. Review proposed index on 2 TB table — questions you ask?

   - Query ROI, size estimate
   - `CONCURRENTLY` duration
   - Replication lag during build

9. Too many indexes on write-heavy table — symptoms and policy?

   - Insert/update slowdown
   - Index usage monitoring
   - Drop unused safely

## Staff-Level

10. Index standards for org — what is in the checklist?

    - Naming, column order, partial predicates
    - PR review integration
    - Exception for emergency hotfix index

11. BRIN vs btree vs partition for time-series — decision tree?

    - Correlation with physical order
    - Retention and scan patterns
    - Handoff to ops monitoring

12. Multikey index explosion in document store — explain and fix.

    - Array indexing semantics
    - Schema normalization alternative
    - Partial/compound mitigation

13. Teach index module — lab design and assessment?

    - Mini B+ split lab
    - EXPLAIN before/after
    - Alignment with [[08-Databases/_exercises/Indexing on Disk Exercises.md|Indexing Exercises]]

14. Bitmap index scan vs index scan — when planner combines?

    - Multiple indexes AND/OR
    - Selectivity thresholds
    - Memory/work_mem limits

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Structure | Generic tree | Page B+, splits, leaf links |
| Design | Index all columns | Query-driven covering/partial/GIN |
| Ops | Online DDL ignored | CONCURRENTLY, size, lag, ROI |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/Indexing on Disk Exercises.md|Indexing on Disk Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
