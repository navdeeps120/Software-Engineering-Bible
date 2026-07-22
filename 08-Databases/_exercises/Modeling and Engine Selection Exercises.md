---
title: Modeling and Engine Selection Exercises
aliases: [Modeling and Engine Selection Drills]
track: 08-Databases
topic: modeling-and-engine-selection-exercises
difficulty: advanced
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, modeling, engine-selection]
created: 2026-07-22
updated: 2026-07-22
---

# Modeling and Engine Selection Exercises

Normalize vs denormalize at storage layer, design keys and cardinality for access paths, shape schema by queries, apply Postgres/Mongo/Redis decision matrix, and hand off clean boundaries to Backend repositories.

## Linked Topic

- [[08-Databases/11-Modeling-and-Engine-Selection/Normalization vs Denormalization at Storage|Normalization vs Denormalization at Storage]]
- [[08-Databases/11-Modeling-and-Engine-Selection/Keys Cardinality and Access Paths|Keys Cardinality and Access Paths]]
- [[08-Databases/11-Modeling-and-Engine-Selection/Schema Design Driven by Queries|Schema Design Driven by Queries]]
- [[08-Databases/11-Modeling-and-Engine-Selection/PostgreSQL vs MongoDB vs Redis Decision Matrix|PostgreSQL vs MongoDB vs Redis Decision Matrix]]
- [[08-Databases/11-Modeling-and-Engine-Selection/Handoff Back to Backend Repositories|Handoff Back to Backend Repositories]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Given queries Q1–Q5 for an e-commerce catalog, classify each as point lookup, range scan, aggregation, or graph-like join. Map to index/key design.

**Hint:** [[08-Databases/11-Modeling-and-Engine-Selection/Schema Design Driven by Queries|Schema Design Driven by Queries]].

**Acceptance criteria:**

- [ ] Query inventory table with access type
- [ ] Primary key and index candidates per query
- [ ] One query that punishes wrong engine choice

### Problem 2 — `intermediate`

**Prompt:** Explain when 3NF normalization helps engine performance vs when denormalization reduces read amplification. Give one example of each.

**Hint:** [[08-Databases/11-Modeling-and-Engine-Selection/Normalization vs Denormalization at Storage|Normalization vs Denormalization at Storage]].

**Acceptance criteria:**

- [ ] Write amplification vs read amplification trade-off
- [ ] Update anomaly risk when denormalized
- [ ] Materialized view as middle ground

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], model same domain twice: normalized Postgres schema and denormalized MongoDB documents. Run equivalent read queries; count I/O or documents examined.

**Acceptance criteria:**

- [ ] Fixture data shared between engines
- [ ] Metrics: pages vs docs examined
- [ ] README documents trade-off summary

### Problem 2 — `intermediate`

**Prompt:** Apply [[08-Databases/11-Modeling-and-Engine-Selection/PostgreSQL vs MongoDB vs Redis Decision Matrix|Decision Matrix]] to session store, product catalog, and analytics event log. Write ADR with engine choice per workload.

**Acceptance criteria:**

- [ ] Three workloads with durability/latency/consistency rows
- [ ] Redis rejected or accepted with persistence config
- [ ] Handoff note to Backend for repository interfaces

## Optimize

### Problem 1 — `intermediate`

**Prompt:** High-cardinality UUID primary key causes index bloat and random I/O. Propose sequential IDs, ULID, or BRIN/time partitioning; justify for insert-heavy table.

**Hint:** [[08-Databases/11-Modeling-and-Engine-Selection/Keys Cardinality and Access Paths|Keys Cardinality and Access Paths]].

**Acceptance criteria:**

- [ ] Insert locality comparison
- [ ] Index size estimate before/after
- [ ] Security/privacy trade-off for sequential ids

### Problem 2 — `advanced`

**Prompt:** Read pattern shifts from OLTP lookups to analytical aggregates. Design migration: CQRS read model, materialized view, or replica without breaking Backend repositories.

**Acceptance criteria:**

- [ ] Mermaid data flow post-migration
- [ ] Repository interface unchanged or versioned
- [ ] Link [[08-Databases/11-Modeling-and-Engine-Selection/Handoff Back to Backend Repositories|Handoff Back to Backend Repositories]]

## Debug

### Problem 1 — `intermediate`

**Prompt:** Team picked Mongo for relational reporting needs; BI tool requires SQL joins. Build remediation options with migration cost estimate.

**Acceptance criteria:**

- [ ] `$lookup` cost vs Postgres migration
- [ ] ETL to warehouse third path
- [ ] Decision criteria for exec summary

### Problem 2 — `advanced`

**Prompt:** Cache-aside with Redis shows stale reads after Postgres update. Trace TTL, invalidation, and read-your-writes; fix without dual-write inconsistency.

**Acceptance criteria:**

- [ ] Invalidation on write pattern
- [ ] Version stamp or pub/sub option
- [ ] Cross-link Backend cache module

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Draft engine selection RFC template: workloads, access paths, durability SLA, ops skill, exit strategy. Require sign-off from Backend and Databases owners.

**Acceptance criteria:**

- [ ] Template sections filled with example
- [ ] Forbidden patterns list (Redis primary ledger)
- [ ] Review cadence for revisited decisions

### Problem 2 — `advanced`

**Prompt:** Acquisition integrates two products on Postgres and Mongo. Propose consolidation strategy over 18 months without big-bang rewrite.

**Acceptance criteria:**

- [ ] Bounded context map
- [ ] Strangler per service with engine boundary
- [ ] Risk register: data migration, downtime

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Modeling | Entity diagrams only | Query-driven keys and indexes |
| Selection | Favorite engine | Matrix with durability and ops |
| Handoff | Leaky engine into API | Repository boundary, ADR, Backend contract |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/Modeling and Engine Selection Interview.md|Modeling and Engine Selection Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
