---
title: Concurrency Internals Exercises
aliases: [Concurrency Internals Drills]
track: 08-Databases
topic: concurrency-internals-exercises
difficulty: advanced
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, concurrency, vacuum, locks]
created: 2026-07-22
updated: 2026-07-22
---

# Concurrency Internals Exercises

Diagnose latches vs locks, hot-row contention and write skew, vacuum/version GC and bloat, long-transaction snapshot horizons, and advisory locks as coordination primitives.

## Linked Topic

- [[08-Databases/06-Concurrency-Internals/Latches Locks and Lock Managers|Latches Locks and Lock Managers]]
- [[08-Databases/06-Concurrency-Internals/Hot Rows Write Skew and Contention|Hot Rows Write Skew and Contention]]
- [[08-Databases/06-Concurrency-Internals/Vacuum Version GC and Bloat|Vacuum Version GC and Bloat]]
- [[08-Databases/06-Concurrency-Internals/Long Transactions and Snapshot Horizons|Long Transactions and Snapshot Horizons]]
- [[08-Databases/06-Concurrency-Internals/Advisory Locks as Engine Primitives|Advisory Locks as Engine Primitives]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Contrast latches (internal, short) with lock manager locks (transaction-scoped, user-visible). Give one example of each in Postgres.

**Hint:** [[08-Databases/06-Concurrency-Internals/Latches Locks and Lock Managers|Latches Locks and Lock Managers]].

**Acceptance criteria:**

- [ ] Duration and visibility differences
- [ ] `pg_locks` vs wait event types
- [ ] When latch contention appears in metrics

### Problem 2 — `intermediate`

**Prompt:** Draw MVCC version chain for row updated 5 times. Show which tuples vacuum can remove given active snapshot horizons.

**Hint:** [[08-Databases/06-Concurrency-Internals/Vacuum Version GC and Bloat|Vacuum Version GC and Bloat]].

**Acceptance criteria:**

- [ ] `xmin`/`xmax` chain diagram
- [ ] Dead tuples retained because of old snapshot
- [ ] Bloat symptom on table size vs live rows

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], simulate hot counter row: 100 concurrent increments with row-level lock vs sharded counters table.

**Acceptance criteria:**

- [ ] Throughput comparison logged
- [ ] Correct final count oracle
- [ ] Sharded design reduces lock waits in test

### Problem 2 — `intermediate`

**Prompt:** Implement advisory lock wrapper: acquire namespaced lock key, timeout, release on transaction end; demonstrate queue worker mutual exclusion.

**Hint:** [[08-Databases/06-Concurrency-Internals/Advisory Locks as Engine Primitives|Advisory Locks as Engine Primitives]].

**Acceptance criteria:**

- [ ] Session vs transaction-level lock modes tested
- [ ] Timeout prevents indefinite wait
- [ ] Document difference from app distributed lock

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Table bloat 3× live rows after ORM `UPDATE` all columns pattern. Propose HOT-friendly updates, fillfactor, and vacuum tuning.

**Acceptance criteria:**

- [ ] HOT update conditions listed
- [ ] Before/after dead tuple rate estimate
- [ ] Link [[08-Databases/08-PostgreSQL-Engine/PostgreSQL MVCC and Autovacuum|Autovacuum]]

### Problem 2 — `advanced`

**Prompt:** Write skew on shift scheduling: two doctors both see coverage OK and take off. Design SSI-safe or lock-based fix with minimal contention.

**Hint:** [[08-Databases/06-Concurrency-Internals/Hot Rows Write Skew and Contention|Hot Rows Write Skew and Contention]].

**Acceptance criteria:**

- [ ] Anomaly timeline reproduced
- [ ] Fix uses serializable or predicate lock
- [ ] Throughput impact measured

## Debug

### Problem 1 — `intermediate`

**Prompt:** Autovacuum never keeps up; `transaction id wraparound` warning. Trace long-running queries holding snapshot horizon.

**Hint:** [[08-Databases/06-Concurrency-Internals/Long Transactions and Snapshot Horizons|Long Transactions and Snapshot Horizons]].

**Acceptance criteria:**

- [ ] `pg_stat_activity`/`xact_age` checklist
- [ ] `idle in transaction` as common culprit
- [ ] Mitigation: statement timeout, pool settings

### Problem 2 — `advanced`

**Prompt:** Spikes in `LWLock:buffer_mapping` waits. Distinguish buffer pool contention from missing index causing page churn.

**Acceptance criteria:**

- [ ] Wait event analysis steps
- [ ] Correlation with sequential scans
- [ ] Fix path: index vs pool sizing vs partition

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Draft autovacuum policy per table class: OLTP hot, append-only events, large JSON blobs. Include monitoring thresholds.

**Acceptance criteria:**

- [ ] Per-table settings rationale
- [ ] Alerts on dead tuples, wraparound age
- [ ] Handoff to [[08-Databases/12-Production-Database-Ops/Monitoring Checkpoints Lag Bloat Cache Hit|Monitoring]]

### Problem 2 — `advanced`

**Prompt:** Multi-tenant SaaS shares one database; noisy neighbor causes lock storms on shared sequence table. Design tenant-scoped id generation without global hot row.

**Acceptance criteria:**

- [ ] Mermaid architecture options (sequences per tenant, UUID, snowflake)
- [ ] Durability and uniqueness guarantees
- [ ] Migration from global sequence

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Locks vs latches | "Deadlocks" | Scope, duration, wait events |
| Vacuum/bloat | "Run VACUUM" | Snapshot horizon, HOT, autovacuum tuning |
| Hot rows | Bigger hardware | Shard, advisory lock, algorithm change |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/Concurrency Internals Interview.md|Concurrency Internals Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
