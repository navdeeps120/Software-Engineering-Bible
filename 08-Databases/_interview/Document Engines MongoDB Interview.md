---
title: Document Engines MongoDB Interview
aliases: [Document Engines MongoDB Interview Questions]
track: 08-Databases
topic: document-engines-mongodb-interview
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/09-Document-Engines-MongoDB/Document Model and Storage Engines|Document Model and Storage Engines]]"]
tags: [interviews, databases, mongodb]
created: 2026-07-22
updated: 2026-07-22
---

# Document Engines MongoDB Interview

## Linked Topic

- [[08-Databases/09-Document-Engines-MongoDB/Document Model and Storage Engines|Document Model and Storage Engines]]
- [[08-Databases/09-Document-Engines-MongoDB/Indexes on Documents and Multikey Behavior|Indexes on Documents and Multikey Behavior]]
- [[08-Databases/09-Document-Engines-MongoDB/Aggregation Pipeline as Execution|Aggregation Pipeline as Execution]]
- [[08-Databases/09-Document-Engines-MongoDB/Write Concern and Journaling Mechanics|Write Concern and Journaling Mechanics]]
- [[08-Databases/09-Document-Engines-MongoDB/When Document Engines Win or Lose|When Document Engines Win or Lose]]

## How to Practice

1. Anchor answers in access paths, not "schemaless."
2. Use aggregation stage vocabulary.
3. Map write concern to RPO explicitly.
4. State when Postgres JSONB is better.

## Document Model

1. When embed vs reference in MongoDB?

   - Read patterns, document size
   - Atomic update boundaries
   - Array growth risks

2. WiredTiger storage engine basics?

   - Document record store
   - Cache pressure
   - Checkpoint vs journal

## Indexes

3. Multikey index — how it works and pitfalls?

   - Index entry per array element
   - Compound multikey limits
   - Selectivity explosion

4. Explain `executionStats` for winning plan.

   - IXSCAN vs COLLSCAN
   - Keys examined vs docs returned
   - In-memory sort risk

## Aggregation

5. Aggregation pipeline execution model?

   - Stage pushdown
   - `$lookup` cost
   - `$merge` / `$out` durability

6. `$lookup` vs embedded data — trade-off?

   - Join-like cost at scale
   - Denormalization maintenance
   - Consistency on updates

## Durability

7. Write concern `w`, `j`, `majority` — explain?

   - Journal sync
   - Replica ack count
   - Failover loss window

8. MongoDB multi-document transactions — when use?

   - Overhead vs single doc atomicity
   - Comparison to Postgres
   - Retry on transient errors

## Selection and Ops

9. MongoDB for financial ledger — yes or no?

   - Constraints, reporting, isolation
   - Hybrid JSONB alternative
   - Team operational maturity

10. Shard key selection — rules and mistakes?

    - Targeted vs scatter-gather
    - Monotonic key hotspot
    - Hashed trade-offs

## Staff-Level

11. MongoDB vs Postgres decision for catalog service?

    - Query shapes, transactions
    - Link decision matrix note
    - Migration cost honesty

12. Index build policy on production — foreground vs background?

    - Write lock impact
    - Monitoring build progress
    - Rollback if build fails

13. Duplicate documents under retries — prevention?

    - Unique indexes
    - Idempotency keys
    - Application patterns

14. Teach Mongo module — lab design?

    - Multikey index lab
    - Write concern latency measure
    - Assessment rubric

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Modeling | Schemaless hype | Embed/reference by access path |
| Execution | "Add index" | explain stats, pipeline stages |
| Durability | Defaults | w/j/majority RPO mapping |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/Document Engines MongoDB Exercises.md|Document Engines MongoDB Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
