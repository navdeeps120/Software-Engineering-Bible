---
title: Transactions and Isolation Exercises
aliases: [Transactions and Isolation Drills]
track: 08-Databases
topic: transactions-and-isolation-exercises
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, transactions, isolation, mvcc]
created: 2026-07-22
updated: 2026-07-22
---

# Transactions and Isolation Exercises

Reason about ACID as engine contracts, classify isolation anomalies, compare locking vs MVCC, map product defaults, and explore snapshot isolation and SSI.

## Linked Topic

- [[08-Databases/05-Transactions-and-Isolation/ACID as Engine Contracts|ACID as Engine Contracts]]
- [[08-Databases/05-Transactions-and-Isolation/Anomalies Dirty Nonrepeatable Phantom Serialization|Anomalies Dirty Nonrepeatable Phantom Serialization]]
- [[08-Databases/05-Transactions-and-Isolation/Locking vs MVCC|Locking vs MVCC]]
- [[08-Databases/05-Transactions-and-Isolation/Isolation Levels and Product Defaults|Isolation Levels and Product Defaults]]
- [[08-Databases/05-Transactions-and-Isolation/Snapshot Isolation and SSI Concepts|Snapshot Isolation and SSI Concepts]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** For each ACID property, give one engine mechanism (not application pattern) that enforces it in PostgreSQL.

**Hint:** [[08-Databases/05-Transactions-and-Isolation/ACID as Engine Contracts|ACID as Engine Contracts]].

**Acceptance criteria:**

- [ ] Four properties with WAL/MVCC/constraint examples
- [ ] Handoff to [[07-Backend/08-Data-Access-and-Persistence-Patterns/Transactions as Used by Services|Transactions as Used by Services]] for service boundaries
- [ ] One failure when property violated

### Problem 2 — `intermediate`

**Prompt:** Construct two-session timelines demonstrating dirty read, non-repeatable read, and phantom read. State which isolation levels prevent each.

**Hint:** [[08-Databases/05-Transactions-and-Isolation/Anomalies Dirty Nonrepeatable Phantom Serialization|Anomalies]].

**Acceptance criteria:**

- [ ] Mermaid sequence per anomaly
- [ ] Table anomaly → minimum isolation level
- [ ] Serializable prevention mechanism named

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], implement snapshot visibility: each row has `xmin`/`xmax`; transaction sees rows committed before snapshot start.

**Acceptance criteria:**

- [ ] Read committed vs repeatable read behavior differs in test
- [ ] Uncommitted rows invisible to other sessions
- [ ] Unit tests with interleaved operations

### Problem 2 — `intermediate`

**Prompt:** Implement two-phase lock table stub: shared/exclusive locks, block incompatible pairs, detect simple deadlock cycle.

**Hint:** [[08-Databases/05-Transactions-and-Isolation/Locking vs MVCC|Locking vs MVCC]].

**Acceptance criteria:**

- [ ] Lock matrix enforced
- [ ] Deadlock returns victim transaction id
- [ ] Contrast test: MVCC readers don't block writers

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Application uses `SERIALIZABLE` globally; p99 latency high. Identify queries safe at `READ COMMITTED` and document write skew risks for remainder.

**Acceptance criteria:**

- [ ] Query inventory with isolation recommendation
- [ ] Write skew example for downgraded queries
- [ ] SSI predicate locks when still needed

### Problem 2 — `advanced`

**Prompt:** Design transfer + audit log transaction with minimal lock duration. Compare explicit row lock vs optimistic retry vs advisory lock.

**Acceptance criteria:**

- [ ] Lock ordering prevents deadlock
- [ ] Idempotency key for retry path
- [ ] Metrics: lock wait time, retry count

## Debug

### Problem 1 — `intermediate`

**Prompt:** Users report "balance wrong intermittently." Build isolation anomaly checklist: lost update, read skew, double spend under concurrent transfers.

**Acceptance criteria:**

- [ ] Reproduction scripts with two sessions
- [ ] Link to [[08-Databases/projects/Isolation Anomaly Clinic/README|Isolation Anomaly Clinic]]
- [ ] Fix mapped to isolation level or explicit lock

### Problem 2 — `advanced`

**Prompt:** `could not serialize access due to concurrent update` spikes after deploy. Diagnose SSI conflicts vs hot row updates vs migration adding trigger.

**Acceptance criteria:**

- [ ] `pg_stat_database` conflict counters
- [ ] Retry policy vs isolation downgrade decision
- [ ] Regression test for concurrent workload

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Draft transaction policy for microservices: default isolation, max statement timeout, forbidden long-open transactions, idempotency requirements.

**Acceptance criteria:**

- [ ] Policy maps to Postgres defaults vs overrides
- [ ] Connection pool interaction (held connections)
- [ ] Link [[08-Databases/06-Concurrency-Internals/Long Transactions and Snapshot Horizons|Long Transactions]]

### Problem 2 — `advanced`

**Prompt:** Financial close window requires serializable inventory deduction across warehouses. Design engine-level approach without global table lock.

**Acceptance criteria:**

- [ ] Serializable or explicit locking strategy
- [ ] Deadlock avoidance ordering
- [ ] Rollback/compensation if business rule fails mid-flight

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| ACID | Buzzword list | Engine mechanisms per property |
| Anomalies | Name only | Timelines, isolation level mapping |
| Production | Max isolation everywhere | Risk-based levels, retry, lock ordering |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/Transactions and Isolation Interview.md|Transactions and Isolation Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
