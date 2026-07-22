---
title: Data Access and Persistence Patterns Exercises
aliases: [Data Access and Persistence Patterns Drills]
track: 07-Backend
topic: data-access-and-persistence-patterns-exercises
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [exercises, backend, repository, transactions, orm]
created: 2026-07-22
updated: 2026-07-22
---

# Data Access and Persistence Patterns Exercises

Use repository and unit-of-work patterns, service-scoped transactions, query shape discipline, migrations as operational process, and clear handoffs to database engines.

## Linked Topic

- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Repository and Unit of Work|Repository and Unit of Work]]
- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Transactions as Used by Services|Transactions as Used by Services]]
- [[07-Backend/08-Data-Access-and-Persistence-Patterns/N-plus-1 and Query Shape Discipline|N-plus-1 and Query Shape Discipline]]
- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Migrations as Operational Process|Migrations as Operational Process]]
- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Mini ORM Concepts and Query Builders|Mini ORM Concepts and Query Builders]]
- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Handing Off to Database Engines|Handing Off to Database Engines]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Contrast active record, repository, and DAO patterns for an Express service. Where does business logic live?

**Hint:** [[07-Backend/08-Data-Access-and-Persistence-Patterns/Repository and Unit of Work|Repository and Unit of Work]].

**Acceptance criteria:**

- [ ] Three patterns with layering diagram
- [ ] Test double strategy for repository port
- [ ] Handoff boundary to [[08-Databases/README|Databases]]

### Problem 2 — `intermediate`

**Prompt:** Define transaction boundary for `transferFunds(from, to, amount)`: which operations must be atomic and what isolation level risks exist?

**Hint:** [[07-Backend/08-Data-Access-and-Persistence-Patterns/Transactions as Used by Services|Transactions as Used by Services]].

**Acceptance criteria:**

- [ ] ACID properties mapped to operations
- [ ] Phantom read / lost update scenarios named
- [ ] When to avoid long transactions

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[07-Backend/code/README|code labs]], implement `UserRepository` port with in-memory adapter and SQL adapter stub sharing the same interface.

**Acceptance criteria:**

- [ ] Service depends on interface, not adapter
- [ ] CRUD methods return domain types, not raw rows
- [ ] Unit tests use in-memory adapter only

### Problem 2 — `intermediate`

**Prompt:** Implement unit-of-work wrapping two repository writes in one transaction with rollback on validation failure mid-flight.

**Acceptance criteria:**

- [ ] `commit`/`rollback` explicit in service
- [ ] Partial state impossible after rollback
- [ ] Integration test with real or fake transaction

## Optimize

### Problem 1 — `intermediate`

**Prompt:** List endpoint triggers N+1 queries loading authors per book. Fix with eager load or batch query; measure query count before/after.

**Hint:** [[07-Backend/08-Data-Access-and-Persistence-Patterns/N-plus-1 and Query Shape Discipline|N-plus-1 and Query Shape Discipline]].

**Acceptance criteria:**

- [ ] Query count drops from N+1 to ≤2
- [ ] Pagination preserved
- [ ] Document when denormalization is justified

### Problem 2 — `advanced`

**Prompt:** Build minimal query builder generating parameterized SQL (no string concat). Support `where`, `limit`, and `join` with injection-safe bindings.

**Hint:** [[07-Backend/08-Data-Access-and-Persistence-Patterns/Mini ORM Concepts and Query Builders|Mini ORM Concepts and Query Builders]].

**Acceptance criteria:**

- [ ] All user input bound as parameters
- [ ] Tests include malicious input strings
- [ ] Explain what ORM adds beyond builder

## Debug

### Problem 1 — `intermediate`

**Prompt:** Production deadlock on concurrent order updates. Capture deadlock graph, reorder lock acquisition, or use retry with backoff.

**Acceptance criteria:**

- [ ] Consistent lock ordering documented
- [ ] Retry only on serialization/deadlock errors
- [ ] Metrics for deadlock rate

### Problem 2 — `advanced`

**Prompt:** Migration added non-null column without default—deploy failed mid-rollout. Write safe expand-contract migration plan retroactively.

**Hint:** [[07-Backend/08-Data-Access-and-Persistence-Patterns/Migrations as Operational Process|Migrations as Operational Process]].

**Acceptance criteria:**

- [ ] Expand → backfill → enforce → contract phases
- [ ] Zero-downtime deploy sequence
- [ ] Rollback per phase defined

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Read replica lag causes stale dashboards. Route read-heavy reports to replica with max staleness header; writes always primary.

**Acceptance criteria:**

- [ ] Connection routing policy in repository layer
- [ ] `X-Read-Staleness-Seconds` or similar contract
- [ ] Fallback to primary on replica failure

### Problem 2 — `advanced`

**Prompt:** Service outgrows single Postgres—team wants micro-DB per tenant. Assess repository abstraction readiness, migration tooling, and cross-tenant reporting gap.

**Hint:** [[07-Backend/08-Data-Access-and-Persistence-Patterns/Handing Off to Database Engines|Handing Off to Database Engines]].

**Acceptance criteria:**

- [ ] Decision matrix: shared schema vs DB-per-tenant
- [ ] Repository must not leak connection strings to handlers
- [ ] Reporting via event stream or warehouse handoff

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Layering | SQL in route handlers | Repository ports, UoW, domain types |
| Query discipline | ORM magic | N+1 eliminated, parameterized queries |
| Operations | `ALTER` in prod Friday | Expand-contract migrations, replica routing |

## Related Notes

- [[07-Backend/code/README|code labs]]
- [[07-Backend/_interview/Data Access and Persistence Patterns Interview.md|Data Access and Persistence Patterns Interview]]
- [[07-Backend/README|Backend]]
- [[Career/README|Career]]
