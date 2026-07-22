---
title: Data Access and Persistence Patterns Interview
aliases: [Data Access and Persistence Patterns Interview Questions]
track: 07-Backend
topic: data-access-and-persistence-patterns-interview
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/08-Data-Access-and-Persistence-Patterns/Repository and Unit of Work|Repository and Unit of Work]]"]
tags: [interviews, backend, repository, transactions, orm]
created: 2026-07-22
updated: 2026-07-22
---

# Data Access and Persistence Patterns Interview

## Linked Topic

- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Repository and Unit of Work|Repository and Unit of Work]]
- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Transactions as Used by Services|Transactions as Used by Services]]
- [[07-Backend/08-Data-Access-and-Persistence-Patterns/N-plus-1 and Query Shape Discipline|N-plus-1 and Query Shape Discipline]]
- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Migrations as Operational Process|Migrations as Operational Process]]
- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Mini ORM Concepts and Query Builders|Mini ORM Concepts and Query Builders]]
- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Handing Off to Database Engines|Handing Off to Database Engines]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw service → repository → engine boundaries first.
3. Name transaction scope and isolation risks explicitly.
4. Close with migration ops and handoff to Databases track.

## Contracts

1. Compare active record, repository, and DAO — where does business logic live?

   - Port interfaces for test doubles
   - Domain types vs row shapes
   - Handoff to [[08-Databases/README|Databases]]

2. Define transaction boundary for `transferFunds`.

   - Atomic operations list
   - Isolation level trade-offs
   - Long transaction hazards

## Query Discipline

3. Diagnose and fix N+1 in list endpoint.

   - Eager load vs batch query
   - Query count before/after
   - Pagination interaction

4. When is denormalization justified in a service?

   - Read vs write ratio
   - Consistency repair path
   - Migration cost

## Coding

5. Implement repository port with in-memory and SQL adapters.

   - Service depends on interface
   - No SQL in route handlers
   - Unit vs integration tests

6. Review string-concatenated SQL — parameterized fix.

   - Injection test cases
   - Query builder binding
   - ORM value proposition

## Migrations and Operations

7. Safe zero-downtime migration adding non-null column.

   - Expand → backfill → enforce → contract
   - Rollback per phase
   - Deploy ordering with app versions

8. Read replica lag — routing policy in repository layer.

   - Max staleness contract
   - Fallback to primary
   - User-visible impact

## Production Judgment

9. Deadlock on concurrent order updates — response and prevention.

   - Lock ordering
   - Retry on serialization failure
   - Metrics and alerts

10. Team shares database — path to service-owned persistence.

    - Repository readiness
    - Cross-service reporting via events
    - Migration coordination

## Staff-Level Selection

11. Standardize data access layer org-wide — ban SQL in handlers.

    - Shared repository patterns
    - Lint or arch unit tests
    - Exception for analytics paths

12. DB-per-tenant vs shared schema — backend authorization implications.

    - Connection routing
    - Blast radius
    - Operational cost

13. Mini ORM vs full ORM vs raw SQL — decision framework.

    - Team skill and query complexity
    - Migration and typing needs
    - Performance observability

14. Migration failed mid-rollout — incident playbook.

    - Stop deploy, assess schema state
    - Forward fix vs rollback
    - Communication to consumers

15. Hand off index tuning to Databases team — what service team still owns?

    - Query shape and EXPLAIN requests
    - N+1 prevention in code
    - SLA for slow query fixes

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Layering | SQL in Express routes | Repository ports, UoW, domain types |
| Queries | ORM magic | N+1 eliminated, parameterized SQL |
| Operations | Friday ALTER | Expand-contract migrations, replica routing |

## Related Notes

- [[Career/README|Career]]
- [[07-Backend/_exercises/Data Access and Persistence Patterns Exercises.md|Data Access and Persistence Patterns Exercises]]
- [[07-Backend/code/README|code labs]]
- [[07-Backend/README|Backend]]
