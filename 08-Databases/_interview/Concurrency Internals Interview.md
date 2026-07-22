---
title: Concurrency Internals Interview
aliases: [Concurrency Internals Interview Questions]
track: 08-Databases
topic: concurrency-internals-interview
difficulty: advanced
status: active
prerequisites: ["[[08-Databases/06-Concurrency-Internals/Latches Locks and Lock Managers|Latches Locks and Lock Managers]]"]
tags: [interviews, databases, concurrency, vacuum]
created: 2026-07-22
updated: 2026-07-22
---

# Concurrency Internals Interview

## Linked Topic

- [[08-Databases/06-Concurrency-Internals/Latches Locks and Lock Managers|Latches Locks and Lock Managers]]
- [[08-Databases/06-Concurrency-Internals/Hot Rows Write Skew and Contention|Hot Rows Write Skew and Contention]]
- [[08-Databases/06-Concurrency-Internals/Vacuum Version GC and Bloat|Vacuum Version GC and Bloat]]
- [[08-Databases/06-Concurrency-Internals/Long Transactions and Snapshot Horizons|Long Transactions and Snapshot Horizons]]
- [[08-Databases/06-Concurrency-Internals/Advisory Locks as Engine Primitives|Advisory Locks as Engine Primitives]]

## How to Practice

1. Use wait events and lock views vocabulary.
2. Draw version chains for vacuum questions.
3. Separate hot row from bloat from latch contention.
4. Close with autovacuum and timeout policy.

## Locks and Latches

1. Latch vs lock manager lock — differences?

   - Internal vs user-visible
   - Duration, deadlock handling
   - Example wait events

2. How does Postgres deadlock detection work?

   - Waits-for graph
   - Victim selection
   - Application retry expectations

## MVCC and Vacuum

3. Explain dead tuples and why vacuum cannot remove them.

   - Snapshot horizon
   - Long transaction impact
   - Bloat symptoms

4. What is HOT update and when does it apply?

   - Same page, no indexed column change
   - Chain visibility
   - Fillfactor interaction

5. Transaction id wraparound — cause and prevention?

   - Frozen xmin horizon
   - Autovacuum anti-wraparound
   - Emergency ops

## Contention

6. Hot row counter — mitigation patterns?

   - Sharded counters
   - Advisory locks vs row locks
   - Application batching

7. Write skew example and fixes?

   - Snapshot isolation gap
   - Serializable SSI
   - Explicit locking

## Advisory Locks

8. When use Postgres advisory locks vs app distributed lock?

   - Same-database coordination
   - Transaction-scoped release
   - Failure modes

9. Queue worker mutual exclusion design with advisory locks?

   - Session vs xact level
   - Timeout handling
   - Crash recovery behavior

## Production

10. Autovacuum falling behind — triage order?

    - Long idle transactions
    - Table-specific settings
    - IO/autovacuum worker limits

11. `LWLock:buffer_mapping` spikes — causes?

    - Buffer pool churn
    - Missing indexes
    - Mitigation paths

## Staff-Level

12. Org policy for `idle in transaction` and statement timeouts?

    - Pool interaction
    - ORM defaults
    - Enforcement mechanisms

13. Noisy neighbor on shared sequence — architectural fix?

    - Per-tenant sequences/UUIDs
    - Migration plan
    - Uniqueness guarantees

14. Teach concurrency module — essential labs?

    - Hot row sharding
    - Vacuum horizon simulation
    - Rubric alignment

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Internals | "Lock the row" | Latches, MVCC chain, wait events |
| Vacuum | Manual VACUUM | Horizon, HOT, autovacuum policy |
| Architecture | Scale-up only | Shard, advisory locks, id generation |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/Concurrency Internals Exercises.md|Concurrency Internals Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
