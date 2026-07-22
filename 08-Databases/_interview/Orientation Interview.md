---
title: Orientation Interview
aliases: [Orientation Interview Questions]
track: 08-Databases
topic: orientation-interview
difficulty: beginner
status: active
prerequisites: ["[[08-Databases/00-Orientation/Why Databases Exist|Why Databases Exist]]"]
tags: [interviews, databases, orientation]
created: 2026-07-22
updated: 2026-07-22
---

# Orientation Interview

## Linked Topic

- [[08-Databases/00-Orientation/Why Databases Exist|Why Databases Exist]]
- [[08-Databases/00-Orientation/Files vs Engines vs Services|Files vs Engines vs Services]]
- [[08-Databases/00-Orientation/Relational Document and KV Contracts|Relational Document and KV Contracts]]
- [[08-Databases/00-Orientation/Backend Databases and System Design Boundaries|Backend Databases and System Design Boundaries]]
- [[08-Databases/00-Orientation/Database Failure Modes Corruption and Durability|Database Failure Modes Corruption and Durability]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw files vs engine vs service boundaries before discussing fixes.
3. Separate ORM/repository usage from engine internals explicitly.
4. Close with a durability failure mode and mitigation.

## Contracts

1. What problem do database engines solve that flat files and in-memory maps do not?

   - Durability, concurrent access, query planning
   - ACID contracts vs best-effort writes
   - When "just use JSON files" is insufficient

2. What is the boundary between Backend data-access patterns and database engine internals?

   - Repositories, transactions as service boundaries → Backend
   - Pages, WAL, indexes, isolation → Databases
   - Multi-region CAP product design → System Design

## Architecture

3. Compare relational, document, and key-value storage contracts with one example each.

   - Joins vs embedded documents vs cache lookups
   - Schema evolution trade-offs
   - Access-path-driven selection

4. Name five database failure modes that survive "we use an ORM."

   - Missing indexes, wrong isolation, WAL misconfiguration
   - Vacuum/bloat, replica lag, Redis-as-primary without durability
   - Link symptoms to owning module

## Coding

5. Sketch a minimal educational engine: append log + in-memory table. Where does crash recovery hook in?

   - Log-before-data rule
   - Replay on startup
   - Test crash between append and apply

6. Review service code that reads/writes files directly — migration plan to an engine.

   - Identify concurrency and durability gaps
   - Phased cutover with dual-write risks
   - Success criteria for engine boundary

## Runtime Assumptions

7. Why does the Databases track require storage literacy if PostgreSQL "just works"?

   - EXPLAIN, isolation anomalies, autovacuum
   - Connection limits and pool sizing
   - When defaults hide footguns

8. When would you choose embedded SQLite vs managed PostgreSQL vs MongoDB?

   - Tenancy, backup, query shapes
   - Ops burden and team skill
   - Migration and CI gate strategy

## Production Judgment

9. Two services share one database schema — what breaks at the engine boundary?

   - Migration coupling and hot-row contention
   - Isolation surprises across services
   - Path to service-owned schemas

10. "Data lost after restart" — how do you triage engine vs application?

    - WAL presence and fsync policy
    - Application idempotency and double-write
    - Restore drill evidence

## Staff-Level Selection

11. How would you define database engineering standards across 30 teams?

    - Required: EXPLAIN review, migration process, backup drills
    - Shared runbooks vs per-team improvisation
    - Exception process for engine selection

12. Platform proposes Redis as primary store for all features — assess and counterproposal.

    - Durability vs latency trade-offs
    - Minimum viable persistence requirements
    - Pilot criteria and success metrics

13. Draft hiring rubric for database senior: what must they demonstrate live?

    - Storage contract, isolation prediction, EXPLAIN literacy
    - Alignment with [[08-Databases/_exercises/README|Databases Exercises]]
    - Production incident storytelling

14. How would you onboard engineers from backend-only backgrounds?

    - Study order: pages → WAL → indexes → isolation → ops
    - Lab path through [[08-Databases/code/README|code labs]]
    - Pairing on migration and EXPLAIN review checklist

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Boundaries | "SQL and ORMs" | Files vs engines vs services with handoffs |
| Contracts | One engine for all | Access-path-driven engine selection |
| Production | Blames application | Failure taxonomy, durability evidence, org standards |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/Orientation Exercises.md|Orientation Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
