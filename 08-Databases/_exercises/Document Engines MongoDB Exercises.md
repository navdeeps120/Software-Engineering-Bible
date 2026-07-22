---
title: Document Engines MongoDB Exercises
aliases: [Document Engines MongoDB Drills]
track: 08-Databases
topic: document-engines-mongodb-exercises
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, mongodb, documents]
created: 2026-07-22
updated: 2026-07-22
---

# Document Engines MongoDB Exercises

Model documents and storage engines, design multikey indexes, trace aggregation pipeline execution, configure write concern and journaling, and judge when document engines win or lose.

## Linked Topic

- [[08-Databases/09-Document-Engines-MongoDB/Document Model and Storage Engines|Document Model and Storage Engines]]
- [[08-Databases/09-Document-Engines-MongoDB/Indexes on Documents and Multikey Behavior|Indexes on Documents and Multikey Behavior]]
- [[08-Databases/09-Document-Engines-MongoDB/Aggregation Pipeline as Execution|Aggregation Pipeline as Execution]]
- [[08-Databases/09-Document-Engines-MongoDB/Write Concern and Journaling Mechanics|Write Concern and Journaling Mechanics]]
- [[08-Databases/09-Document-Engines-MongoDB/When Document Engines Win or Lose|When Document Engines Win or Lose]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Contrast embedded document vs normalized relational schema for a blog with posts, comments, and tags. Name one read and one write advantage per model.

**Hint:** [[08-Databases/09-Document-Engines-MongoDB/Document Model and Storage Engines|Document Model and Storage Engines]].

**Acceptance criteria:**

- [ ] Access-path-driven choice
- [ ] Document size growth risk noted
- [ ] Cross-link [[08-Databases/11-Modeling-and-Engine-Selection/Normalization vs Denormalization at Storage|Normalization vs Denormalization]]

### Problem 2 — `intermediate`

**Prompt:** Explain multikey index behavior when indexing array field `tags`. How many index entries per document?

**Hint:** [[08-Databases/09-Document-Engines-MongoDB/Indexes on Documents and Multikey Behavior|Indexes on Documents and Multikey Behavior]].

**Acceptance criteria:**

- [ ] One entry per array element
- [ ] Compound multikey limitations
- [ ] Index explosion scenario quantified

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], create MongoDB fixtures: insert documents, query with `$match` + `$project`, explain winning index.

**Acceptance criteria:**

- [ ] Fixture seed script
- [ ] `explain("executionStats")` captured
- [ ] Index created to avoid COLLSCAN

### Problem 2 — `intermediate`

**Prompt:** Implement aggregation pipeline: `$match` → `$group` → `$sort` → `$limit`. Compare `$lookup` join cost vs embedded denormalization for same result.

**Hint:** [[08-Databases/09-Document-Engines-MongoDB/Aggregation Pipeline as Execution|Aggregation Pipeline as Execution]].

**Acceptance criteria:**

- [ ] Pipeline stages documented with row counts
- [ ] `$lookup` N+1 style cost named
- [ ] When `$merge` / `$out` appropriate

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Write concern `{ w: 1, j: true }` vs `{ w: 'majority' }` — map to durability latency and failover data loss for replica set.

**Hint:** [[08-Databases/09-Document-Engines-MongoDB/Write Concern and Journaling Mechanics|Write Concern and Journaling Mechanics]].

**Acceptance criteria:**

- [ ] Journal fsync role
- [ ] Majority commit window
- [ ] Application retry on write concern error

### Problem 2 — `advanced`

**Prompt:** Working set exceeds RAM; page faults spike. Design schema + index changes to reduce document width and working set footprint.

**Acceptance criteria:**

- [ ] Projection-only queries
- [ ] Bucket pattern or reference for large arrays
- [ ] WiredTiger cache metrics monitored

## Debug

### Problem 1 — `intermediate`

**Prompt:** Slow queries after shard key migration attempt. Diagnose scatter-gather vs targeted queries; document shard key choice rules.

**Acceptance criteria:**

- [ ] `mongot`/`explain` evidence template
- [ ] Monotonic shard key vs hashed trade-off
- [ ] Handoff to [[09-System-Design/README|System Design]] for sharding product design

### Problem 2 — `advanced`

**Prompt:** Duplicate documents appear under retry storm. Trace idempotency, unique index, and transaction boundaries across multi-document updates.

**Acceptance criteria:**

- [ ] Multi-document ACID availability noted
- [ ] Unique partial index pattern
- [ ] Outbox comparison from Backend track

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Team proposes Mongo for financial ledger. Use [[08-Databases/09-Document-Engines-MongoDB/When Document Engines Win or Lose|When Document Engines Win or Lose]] to accept or redirect with evidence.

**Acceptance criteria:**

- [ ] Transaction, constraint, reporting requirements checklist
- [ ] Alternative: Postgres JSONB hybrid
- [ ] Decision record for stakeholders

### Problem 2 — `advanced`

**Prompt:** Draft MongoDB ops baseline: replica set election monitoring, backup with point-in-time, index build `background` vs foreground policy.

**Acceptance criteria:**

- [ ] RPO/RTO with oplog window
- [ ] Index build impact on writes
- [ ] Link [[08-Databases/12-Production-Database-Ops/Backups PITR and Restore Drills|Backups PITR]]

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Document model | "Flexible schema" | Access-path embed vs reference |
| Indexes | Single field only | Multikey, compound, explosion awareness |
| Durability | Default write concern | w/j/majority mapped to RPO |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/Document Engines MongoDB Interview.md|Document Engines MongoDB Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
