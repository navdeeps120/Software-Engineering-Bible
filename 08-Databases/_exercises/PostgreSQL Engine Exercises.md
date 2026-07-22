---
title: PostgreSQL Engine Exercises
aliases: [PostgreSQL Engine Drills]
track: 08-Databases
topic: postgresql-engine-exercises
difficulty: advanced
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, postgresql, mvcc, autovacuum]
created: 2026-07-22
updated: 2026-07-22
---

# PostgreSQL Engine Exercises

Navigate catalogs and system tables, tune MVCC and autovacuum, enforce constraints as engine invariants, evaluate extensions, and weigh online DDL costs vs migration process.

## Linked Topic

- [[08-Databases/08-PostgreSQL-Engine/Catalogs System Tables and Types|Catalogs System Tables and Types]]
- [[08-Databases/08-PostgreSQL-Engine/PostgreSQL MVCC and Autovacuum|PostgreSQL MVCC and Autovacuum]]
- [[08-Databases/08-PostgreSQL-Engine/Constraints as Engine Invariants|Constraints as Engine Invariants]]
- [[08-Databases/08-PostgreSQL-Engine/Extensions and Procedural Surfaces Concepts|Extensions and Procedural Surfaces Concepts]]
- [[08-Databases/08-PostgreSQL-Engine/Online DDL Costs vs Migration Process|Online DDL Costs vs Migration Process]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Query `pg_catalog` to trace table `orders` from OID to columns, types, and indexes. Document which catalogs answer "what indexes exist?"

**Hint:** [[08-Databases/08-PostgreSQL-Engine/Catalogs System Tables and Types|Catalogs System Tables and Types]].

**Acceptance criteria:**

- [ ] SQL queries against `pg_class`, `pg_attribute`, `pg_index`
- [ ] Diagram catalog → object relationships
- [ ] Cross-link [[08-Databases/03-Indexing-on-Disk/Secondary Covering and Partial Indexes|Secondary Indexes]]

### Problem 2 — `intermediate`

**Prompt:** Explain autovacuum triggers using `autovacuum_vacuum_scale_factor` vs table-specific settings for 100M-row append-only events table.

**Hint:** [[08-Databases/08-PostgreSQL-Engine/PostgreSQL MVCC and Autovacuum|PostgreSQL MVCC and Autovacuum]].

**Acceptance criteria:**

- [ ] Dead tuple threshold calculation
- [ ] Freeze/autovacuum wraparound mention
- [ ] When manual `VACUUM` still required

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], run SQL fixture against embedded Postgres or docker: create table with CHECK and FK constraints; demonstrate violation errors and deferrable option.

**Hint:** [[08-Databases/08-PostgreSQL-Engine/Constraints as Engine Invariants|Constraints as Engine Invariants]].

**Acceptance criteria:**

- [ ] Fixture scripts in repo
- [ ] Tests assert constraint failure messages
- [ ] Document app vs engine enforcement boundary

### Problem 2 — `intermediate`

**Prompt:** Install and exercise `pg_stat_statements` or citext extension in lab; document operational requirements (shared preload, upgrade path).

**Hint:** [[08-Databases/08-PostgreSQL-Engine/Extensions and Procedural Surfaces Concepts|Extensions and Procedural Surfaces Concepts]].

**Acceptance criteria:**

- [ ] Extension enabled in lab README
- [ ] Security/upgrade checklist
- [ ] When extension vs application logic

## Optimize

### Problem 1 — `intermediate`

**Prompt:** `UPDATE`-heavy table bloats despite autovacuum. Tune per-table autovacuum, adjust fillfactor, enable HOT-friendly column layout.

**Acceptance criteria:**

- [ ] Before/after `n_dead_tup` metrics
- [ ] HOT update eligibility verified
- [ ] Link [[08-Databases/06-Concurrency-Internals/Vacuum Version GC and Bloat|Vacuum and Bloat]]

### Problem 2 — `advanced`

**Prompt:** Add column with default to 500M-row table. Compare `ADD COLUMN DEFAULT` instant metadata vs rewrite; plan `CONCURRENTLY` index after.

**Hint:** [[08-Databases/08-PostgreSQL-Engine/Online DDL Costs vs Migration Process|Online DDL Costs vs Migration Process]].

**Acceptance criteria:**

- [ ] Postgres version behavior noted (fast default since v11)
- [ ] Lock modes and duration estimated
- [ ] Handoff to [[07-Backend/08-Data-Access-and-Persistence-Patterns/Migrations as Operational Process|Migrations as Operational Process]]

## Debug

### Problem 1 — `intermediate`

**Prompt:** Queries slowed after upgrade. Compare planner stats, extensions, and `search_path` changes using catalog inspection.

**Acceptance criteria:**

- [ ] Pre/post upgrade catalog diff approach
- [ ] Extension version mismatch check
- [ ] `pg_stat_all_tables` seq vs idx scan flip

### Problem 2 — `advanced`

**Prompt:** `duplicate key violates unique constraint` during app retry storm. Distinguish sequence cache, UUID collision, and split-brain write paths.

**Acceptance criteria:**

- [ ] Constraint definition verified in catalog
- [ ] Idempotency key pattern recommended
- [ ] Replication split-brain cross-check

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Draft Postgres major upgrade runbook: logical vs physical migration, extension compatibility matrix, rollback window.

**Acceptance criteria:**

- [ ] Version check queries
- [ ] Replication-based upgrade option
- [ ] Application connection string cutover

### Problem 2 — `advanced`

**Prompt:** Multi-tenant DB: propose schema-per-tenant vs row-level tenant_id with RLS. Engine costs: catalog bloat, connection count, vacuum parallelism.

**Acceptance criteria:**

- [ ] Mermaid comparison architecture
- [ ] Connection pool math per approach
- [ ] Security model with engine enforcement

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Catalogs | GUI-only admin | pg_catalog queries, OID trace |
| MVCC/vacuum | "Run vacuum" | Tuning, HOT, wraparound awareness |
| DDL | "Run migration" | Lock duration, CONCURRENTLY, version behavior |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/PostgreSQL Engine Interview.md|PostgreSQL Engine Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
