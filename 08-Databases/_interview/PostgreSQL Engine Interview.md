---
title: PostgreSQL Engine Interview
aliases: [PostgreSQL Engine Interview Questions]
track: 08-Databases
topic: postgresql-engine-interview
difficulty: advanced
status: active
prerequisites: ["[[08-Databases/08-PostgreSQL-Engine/Catalogs System Tables and Types|Catalogs System Tables and Types]]"]
tags: [interviews, databases, postgresql]
created: 2026-07-22
updated: 2026-07-22
---

# PostgreSQL Engine Interview

## Linked Topic

- [[08-Databases/08-PostgreSQL-Engine/Catalogs System Tables and Types|Catalogs System Tables and Types]]
- [[08-Databases/08-PostgreSQL-Engine/PostgreSQL MVCC and Autovacuum|PostgreSQL MVCC and Autovacuum]]
- [[08-Databases/08-PostgreSQL-Engine/Constraints as Engine Invariants|Constraints as Engine Invariants]]
- [[08-Databases/08-PostgreSQL-Engine/Extensions and Procedural Surfaces Concepts|Extensions and Procedural Surfaces Concepts]]
- [[08-Databases/08-PostgreSQL-Engine/Online DDL Costs vs Migration Process|Online DDL Costs vs Migration Process]]

## How to Practice

1. Answer with catalog queries where applicable.
2. Tie MVCC behavior to autovacuum metrics.
3. Separate engine constraints from app validation.
4. State lock duration for DDL questions.

## Catalogs

1. How find all indexes on a table from catalogs?

   - `pg_index`, `pg_class`, `pg_attribute`
   - OID relationships
   - When to use `\d` vs SQL

2. What lives in pg_catalog vs information_schema?

   - Postgres-specific metadata
   - Portability trade-off

## MVCC and Autovacuum

3. Explain Postgres MVCC implementation specifics.

   - `xmin`/`xmax`, hint bits
   - Tuple visibility rules
   - Index-only scan VM tie-in

4. How tune autovacuum for large append-only table?

   - Scale factor vs threshold
   - Cost delay settings
   - Freeze requirements

5. HOT updates — conditions and benefits?

   - Same page, indexed columns unchanged
   - Reduced index churn
   - Fillfactor role

## Constraints and Extensions

6. Engine constraints vs application validation — division?

   - FK, CHECK, UNIQUE enforcement
   - Deferrable constraints
   - Error mapping to API

7. Extension operational concerns?

   - `shared_preload_libraries`
   - Upgrade/migration path
   - Security review process

## DDL and Migrations

8. Add column with default on huge table — what happens modern Postgres?

   - Metadata-only default
   - Rewrite exceptions
   - Lock modes

9. `CREATE INDEX CONCURRENTLY` — failures and recovery?

   - Invalid index state
   - Retry procedure
   - Replication impact

## Production

10. Major version upgrade strategies?

    - pg_upgrade vs logical replication
    - Extension compatibility
    - Rollback window

11. Schema-per-tenant vs shared schema RLS?

    - Catalog/connection costs
    - Vacuum and stats per tenant
    - Security enforcement

## Staff-Level

12. Postgres standards doc for org — contents?

    - Autovacuum baselines
    - Index/DDL review
    - Extension allowlist

13. Post-upgrade planner regression — investigation?

    - Stats reset, config diff
    - Extension versions
    - `pg_stat_statements` comparison

14. When recommend Postgres vs MongoDB for new service?

    - Access paths, transactions
    - Link [[08-Databases/11-Modeling-and-Engine-Selection/PostgreSQL vs MongoDB vs Redis Decision Matrix|Decision Matrix]]
    - Honest team skill factor

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Catalogs | GUI admin | SQL metadata trace |
| MVCC | Generic snapshot | xmin/xmax, HOT, autovacuum tuning |
| Ops | "Run migration tool" | DDL locks, CONCURRENTLY, upgrade paths |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/PostgreSQL Engine Exercises.md|PostgreSQL Engine Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
