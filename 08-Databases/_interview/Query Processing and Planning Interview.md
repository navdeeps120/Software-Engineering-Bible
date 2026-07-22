---
title: Query Processing and Planning Interview
aliases: [Query Processing and Planning Interview Questions]
track: 08-Databases
topic: query-processing-and-planning-interview
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/04-Query-Processing-and-Planning/Parse Bind Plan Execute Pipeline|Parse Bind Plan Execute Pipeline]]"]
tags: [interviews, databases, query-planner, explain]
created: 2026-07-22
updated: 2026-07-22
---

# Query Processing and Planning Interview

## Linked Topic

- [[08-Databases/04-Query-Processing-and-Planning/Parse Bind Plan Execute Pipeline|Parse Bind Plan Execute Pipeline]]
- [[08-Databases/04-Query-Processing-and-Planning/Cost Models Statistics and Cardinality|Cost Models Statistics and Cardinality]]
- [[08-Databases/04-Query-Processing-and-Planning/Access Paths Seq Scan vs Index|Access Paths Seq Scan vs Index]]
- [[08-Databases/04-Query-Processing-and-Planning/Join Algorithms Nested Loop Hash Merge|Join Algorithms Nested Loop Hash Merge]]
- [[08-Databases/04-Query-Processing-and-Planning/EXPLAIN and EXPLAIN ANALYZE Literacy|EXPLAIN and EXPLAIN ANALYZE Literacy]]

## How to Practice

1. Draw pipeline stages before discussing a slow query.
2. Read EXPLAIN nodes aloud: type, rows, loops, actual time.
3. Match join algorithm to data sizes and sort order.
4. Close with stats maintenance and monitoring.

## Pipeline

1. Describe parse, bind, plan, execute for prepared statement.

   - Where parameters bind
   - Plan cache/generic vs custom
   - Executor vs planner separation

2. What inputs does the cost-based optimizer use?

   - Table stats, index stats
   - Selectivity functions
   - `cpu_tuple_cost`, `seq_page_cost`

## Access Paths

3. Seq scan vs index scan — when does each win?

   - Fraction of table read
   - Index selectivity and correlation
   - Bitmap index scan middle ground

4. How do bad cardinality estimates happen and fix them?

   - Stale stats, missing extended stats
   - Correlated columns
   - `ANALYZE`, histograms

## Joins

5. Compare nested loop, hash join, merge join.

   - Memory (`work_mem`) limits
   - Sorted inputs advantage
   - Semi/anti join variants

6. Query plan shows nested loop 10M loops — what do you do?

   - Rewrite to hash join
   - Index on inner side
   - Stats fix

## EXPLAIN Literacy

7. Walk through reading `EXPLAIN ANALYZE` output.

   - Estimated vs actual rows
   - Loops multiplier
   - Buffers extension value

8. Parameter sniffing — explain and mitigations.

   - Plan tied to first bind values
   - `prepare_threshold`, force generic plan
   - Separate statements per skew

## Production

9. Query regressed 10× after data growth — investigation order?

   - `pg_stat_statements`, plan diff
   - Stats refresh
   - Index addition vs rewrite

10. OLAP on primary — architecture alternatives?

    - Replicas, pool routing
    - Materialized views
    - Resource limits

## Staff-Level

11. Org-wide query review standards — what is mandatory?

    - EXPLAIN for new joins
    - Row estimate bounds
    - Integration with Backend PRs

12. Design cost-model teaching lab — minimal viable planner?

    - Seq vs index chooser
    - Hash join spill
    - Assessment criteria

13. When is hinting or planner tuning acceptable vs schema fix?

    - `enable_*` knobs danger
    - pg_hint_plan exceptions
    - Schema/index preferred path

14. Correlated subquery performance — rewrite patterns you teach?

    - Join flattening, CTE materialization
    - Lateral alternatives
    - Semantic equivalence testing

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Pipeline | Executes SQL | Parse/bind/plan/execute, plan cache |
| Plans | "Add index" | Join choice, stats, est vs actual |
| Production | Reactive tuning | Standards, monitoring, replica split |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/Query Processing and Planning Exercises.md|Query Processing and Planning Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
