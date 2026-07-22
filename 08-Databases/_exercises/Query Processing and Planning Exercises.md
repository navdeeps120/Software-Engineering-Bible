---
title: Query Processing and Planning Exercises
aliases: [Query Processing and Planning Drills]
track: 08-Databases
topic: query-processing-and-planning-exercises
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, query-planner, explain]
created: 2026-07-22
updated: 2026-07-22
---

# Query Processing and Planning Exercises

Trace parse/bind/plan/execute pipelines, interpret cost models and cardinality estimates, compare join algorithms and access paths, and read EXPLAIN ANALYZE evidence.

## Linked Topic

- [[08-Databases/04-Query-Processing-and-Planning/Parse Bind Plan Execute Pipeline|Parse Bind Plan Execute Pipeline]]
- [[08-Databases/04-Query-Processing-and-Planning/Cost Models Statistics and Cardinality|Cost Models Statistics and Cardinality]]
- [[08-Databases/04-Query-Processing-and-Planning/Access Paths Seq Scan vs Index|Access Paths Seq Scan vs Index]]
- [[08-Databases/04-Query-Processing-and-Planning/Join Algorithms Nested Loop Hash Merge|Join Algorithms Nested Loop Hash Merge]]
- [[08-Databases/04-Query-Processing-and-Planning/EXPLAIN and EXPLAIN ANALYZE Literacy|EXPLAIN and EXPLAIN ANALYZE Literacy]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Draw the parse → bind → plan → execute pipeline for a parameterized `SELECT`. Label where statistics influence plan choice.

**Hint:** [[08-Databases/04-Query-Processing-and-Planning/Parse Bind Plan Execute Pipeline|Parse Bind Plan Execute Pipeline]].

**Acceptance criteria:**

- [ ] Prepared statement bind step shown
- [ ] Planner input: parse tree + stats
- [ ] Executor pulls tuples from access path

### Problem 2 — `intermediate`

**Prompt:** Given nested loop, hash join, and merge join, match each to small-inner, equi-join large-large, and pre-sorted inputs scenarios.

**Hint:** [[08-Databases/04-Query-Processing-and-Planning/Join Algorithms Nested Loop Hash Merge|Join Algorithms Nested Loop Hash Merge]].

**Acceptance criteria:**

- [ ] Complexity/memory trade-offs table
- [ ] Spill to disk when work_mem exceeded
- [ ] Cross-link [[05-Algorithms/README|Algorithms]] for sort algorithms handoff

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], implement naive cost chooser: seq scan cost = pages; index scan cost = tree height + matching rows; pick minimum for simple `WHERE id = ?`.

**Acceptance criteria:**

- [ ] Costs use configurable page count and selectivity
- [ ] Chooser returns access path enum
- [ ] Unit tests flip winner when table grows

### Problem 2 — `intermediate`

**Prompt:** Implement hash join over two in-memory relations with work_mem limit: spill partitions when budget exceeded.

**Acceptance criteria:**

- [ ] Build/probe phases correct
- [ ] Spill path tested with tiny work_mem
- [ ] Row count matches nested loop oracle

## Optimize

### Problem 1 — `intermediate`

**Prompt:** `EXPLAIN ANALYZE` shows nested loop with 10M iterations. Rewrite query or schema so hash join wins; document estimated vs actual rows mismatch.

**Hint:** [[08-Databases/04-Query-Processing-and-Planning/EXPLAIN and EXPLAIN ANALYZE Literacy|EXPLAIN and EXPLAIN ANALYZE Literacy]].

**Acceptance criteria:**

- [ ] Before/after plans pasted or summarized
- [ ] `ANALYZE` or extended stats fix identified
- [ ] Link to [[08-Databases/projects/EXPLAIN Literacy Workbench/README|EXPLAIN Literacy Workbench]]

### Problem 2 — `advanced`

**Prompt:** Correlated subquery causes repeated index scans. Rewrite to join or CTE; measure planner cost and execution time.

**Acceptance criteria:**

- [ ] Semantic equivalence test
- [ ] InitPlan vs join comparison
- [ ] When materialization helps

## Debug

### Problem 1 — `intermediate`

**Prompt:** Query regressed 10× after deploy — only data volume changed. Build EXPLAIN diff checklist: rows estimate, join order, parallel gather.

**Acceptance criteria:**

- [ ] Side-by-side plan comparison template
- [ ] Statistics stale detection steps
- [ ] Three mitigation options ranked

### Problem 2 — `advanced`

**Prompt:** Parameter sniffing: fast plan for `status='active'`, slow for `status='archived'`. Propose fixes: prepared plan freeze, separate statements, histogram.

**Acceptance criteria:**

- [ ] Root cause tied to bind-time planning
- [ ] Fix trade-offs (generic vs custom plan)
- [ ] Monitoring for plan flip detection

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Draft query review rubric for services: EXPLAIN required for new joins, row estimate sanity bounds, forbidden `SELECT *` on large tables.

**Acceptance criteria:**

- [ ] Rubric items map to module notes
- [ ] CI or PR bot hook described
- [ ] Handoff to [[07-Backend/08-Data-Access-and-Persistence-Patterns/N-plus-1 and Query Shape Discipline|Query Shape Discipline]]

### Problem 2 — `advanced`

**Prompt:** OLAP report starves OLTP during business hours. Design resource groups, pool routing, or replica strategy with planner evidence.

**Acceptance criteria:**

- [ ] Mermaid traffic split architecture
- [ ] `pg_stat_statements` metrics for regression
- [ ] Rollback if replica lag violates RYW

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Pipeline | "Query runs" | Parse/bind/plan/execute with stats role |
| Joins | One join algorithm | NL/hash/merge matched to shape and memory |
| EXPLAIN | Looks at time only | Est vs actual rows, plan diff, sniffing |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/Query Processing and Planning Interview.md|Query Processing and Planning Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
