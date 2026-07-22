---
title: Indexing on Disk Exercises
aliases: [Indexing on Disk Drills]
track: 08-Databases
topic: indexing-on-disk-exercises
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, indexes, b-plus-tree]
created: 2026-07-22
updated: 2026-07-22
---

# Indexing on Disk Exercises

Build B+ trees as page structures, design secondary/covering/partial indexes, compare hash and GIN/GiST paths, and exploit index-only scans with visibility maps.

## Linked Topic

- [[08-Databases/03-Indexing-on-Disk/B-Plus Trees as Page Structures|B-Plus Trees as Page Structures]]
- [[08-Databases/03-Indexing-on-Disk/Secondary Covering and Partial Indexes|Secondary Covering and Partial Indexes]]
- [[08-Databases/03-Indexing-on-Disk/Hash Indexes and Equality Lookups|Hash Indexes and Equality Lookups]]
- [[08-Databases/03-Indexing-on-Disk/GIN GiST and Bitmap Index Concepts|GIN GiST and Bitmap Index Concepts]]
- [[08-Databases/03-Indexing-on-Disk/Index-Only Scans and Visibility Map Hooks|Index-Only Scans and Visibility Map Hooks]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Draw a three-level B+ tree with internal nodes pointing to leaf linked list. Label fanout, separator keys, and range scan path.

**Hint:** Cross-link [[04-Data-Structures/05-Trees-and-Ordered-Maps/B-Trees and B-Plus Trees Concepts|B-Trees and B-Plus Trees Concepts]] for invariants; this module covers *on-disk pages*.

**Acceptance criteria:**

- [ ] Leaf sibling pointers for range scans
- [ ] Split on insert illustrated
- [ ] Page-sized nodes vs in-memory tree noted

### Problem 2 — `intermediate`

**Prompt:** For query `SELECT id, email FROM users WHERE status = 'active' AND created_at > ?`, compare secondary, covering, and partial index designs.

**Hint:** [[08-Databases/03-Indexing-on-Disk/Secondary Covering and Partial Indexes|Secondary Covering and Partial Indexes]].

**Acceptance criteria:**

- [ ] Index definitions with column order justified
- [ ] Heap fetch count estimated per design
- [ ] Partial index predicate trade-offs

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], implement B+ tree leaf page insert and point lookup with fixed fanout; split leaf when full.

**Acceptance criteria:**

- [ ] Point lookup returns row id or key
- [ ] Split propagates to parent stub (single level OK for lab)
- [ ] Property test: keys remain sorted after random inserts

### Problem 2 — `intermediate`

**Prompt:** Add secondary index mapping `(key → heap tid)` and simulate index scan + heap fetch vs covering index returning columns from leaf.

**Acceptance criteria:**

- [ ] Counters for index pages vs heap pages read
- [ ] Covering index avoids heap fetch in test
- [ ] README links to [[08-Databases/projects/Mini B-Plus Index Lab/README|Mini B-Plus Index Lab]]

## Optimize

### Problem 1 — `intermediate`

**Prompt:** A JSONB `@>` query is slow. Design GIN index vs expression btree; estimate build cost and write amplification.

**Hint:** [[08-Databases/03-Indexing-on-Disk/GIN GiST and Bitmap Index Concepts|GIN GiST and Bitmap Index Concepts]].

**Acceptance criteria:**

- [ ] Access path for containment query
- [ ] Index build/maintenance cost named
- [ ] When sequential scan still wins

### Problem 2 — `advanced`

**Prompt:** Enable index-only scan on `(tenant_id, status)` covering index. Document visibility map requirement and autovacuum coupling.

**Hint:** [[08-Databases/03-Indexing-on-Disk/Index-Only Scans and Visibility Map Hooks|Index-Only Scans and Visibility Map Hooks]].

**Acceptance criteria:**

- [ ] EXPLAIN shows Index Only Scan conditions
- [ ] VM all-visible bits explained
- [ ] Regression when bloat prevents index-only

## Debug

### Problem 1 — `intermediate`

**Prompt:** Planner chooses seq scan despite index existing. Build triage checklist: statistics, selectivity, correlation, `enable_seqscan`.

**Acceptance criteria:**

- [ ] `EXPLAIN ANALYZE` evidence template
- [ ] Three root causes with fixes
- [ ] Link to [[08-Databases/04-Query-Processing-and-Planning/Cost Models Statistics and Cardinality|Cost Models]]

### Problem 2 — `advanced`

**Prompt:** Index size exploded after multikey array indexing on documents. Diagnose MongoDB multikey vs Postgres GIN posting lists.

**Acceptance criteria:**

- [ ] Cardinality explosion mechanism
- [ ] Partial/compound index mitigation
- [ ] Cross-link [[08-Databases/09-Document-Engines-MongoDB/Indexes on Documents and Multikey Behavior|Multikey Behavior]]

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Draft index review checklist for PRs: naming, column order, partial predicates, write amplification, migration `CONCURRENTLY`.

**Acceptance criteria:**

- [ ] Checklist items map to module topics
- [ ] Online index build risks
- [ ] Rollback if index unused after 30 days

### Problem 2 — `advanced`

**Prompt:** Production table 2 TB; proposed index would add 400 GB. Assess build window, replication lag during build, and query ROI.

**Acceptance criteria:**

- [ ] `CREATE INDEX CONCURRENTLY` timeline
- [ ] Disk and I/O budget
- [ ] Alternative: BRIN, partitioning handoff to ops

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| B+ pages | In-memory BST | Page splits, leaf links, fanout |
| Index design | "Add index" | Covering/partial/hash/GIN matched to query |
| Production | Index everything | ROI, build ops, write amplification |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/Indexing on Disk Interview.md|Indexing on Disk Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
