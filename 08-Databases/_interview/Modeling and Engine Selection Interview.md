---
title: Modeling and Engine Selection Interview
aliases: [Modeling and Engine Selection Interview Questions]
track: 08-Databases
topic: modeling-and-engine-selection-interview
difficulty: advanced
status: active
prerequisites: ["[[08-Databases/11-Modeling-and-Engine-Selection/Schema Design Driven by Queries|Schema Design Driven by Queries]]"]
tags: [interviews, databases, modeling, engine-selection]
created: 2026-07-22
updated: 2026-07-22
---

# Modeling and Engine Selection Interview

## Linked Topic

- [[08-Databases/11-Modeling-and-Engine-Selection/Normalization vs Denormalization at Storage|Normalization vs Denormalization at Storage]]
- [[08-Databases/11-Modeling-and-Engine-Selection/Keys Cardinality and Access Paths|Keys Cardinality and Access Paths]]
- [[08-Databases/11-Modeling-and-Engine-Selection/Schema Design Driven by Queries|Schema Design Driven by Queries]]
- [[08-Databases/11-Modeling-and-Engine-Selection/PostgreSQL vs MongoDB vs Redis Decision Matrix|PostgreSQL vs MongoDB vs Redis Decision Matrix]]
- [[08-Databases/11-Modeling-and-Engine-Selection/Handoff Back to Backend Repositories|Handoff Back to Backend Repositories]]

## How to Practice

1. List queries before schema or engine choice.
2. Quantify read vs write amplification.
3. Use decision matrix vocabulary.
4. Close with Backend repository handoff.

## Query-Driven Design

1. How do you design schema from access paths?

   - Query inventory first
   - PK and index derivation
   - Anti-patterns (UUID everywhere)

2. Normalize vs denormalize at storage — trade-offs?

   - Join cost vs update anomalies
   - Document embed alternative
   - Materialized views

## Keys and Cardinality

3. UUID primary keys — problems and alternatives?

   - Random insert I/O
   - ULID, sequences, snowflake
   - Privacy considerations

4. High-cardinality secondary index — when hurts?

   - Selectivity low
   - Write amplification
   - Partial index mitigation

## Engine Selection

5. Postgres vs MongoDB vs Redis — decision framework?

   - Transactions, queries, durability
   - Ops maturity
   - Link decision matrix

6. Redis for sessions — requirements?

   - Eviction, TTL, persistence mode
   - Failover behavior
   - Not authoritative ledger

7. Mongo for catalog with heavy joins — assess?

   - Embed vs `$lookup`
   - Postgres JSONB hybrid
   - Migration cost

## Handoffs

8. Where does engine knowledge stop and Backend repository begin?

   - SQL shape vs connection management
   - Transaction scope in service
   - Migration process ownership

9. CQRS read model — engine vs Backend responsibilities?

   - Projection storage
   - Repository interface stability
   - Event ordering handoff

## Production

10. Wrong engine chosen — remediation paths?

    - Strangler migration
    - ETL to warehouse
    - Accept cost honesty

11. Cache stale after DB update — fixes?

    - Invalidation on write
    - Version stamps
    - TTL-only risks

## Staff-Level

12. Engine selection RFC — mandatory sections?

    - Workloads, SLA, exit strategy
    - Sign-off roles
    - Forbidden patterns

13. Acquire company dual engines — 18-month consolidation?

    - Bounded contexts
    - Per-service strangler
    - Risk register

14. Teach modeling module — assessment?

    - Same domain two engines lab
    - ADR writing exercise
    - Rubric alignment

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Design | ER-first | Query-driven keys/indexes |
| Selection | Preference | Matrix: durability, ops, access |
| Boundaries | ORM hides all | Repository handoff, ADR process |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/Modeling and Engine Selection Exercises.md|Modeling and Engine Selection Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
