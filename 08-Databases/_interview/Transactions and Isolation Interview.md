---
title: Transactions and Isolation Interview
aliases: [Transactions and Isolation Interview Questions]
track: 08-Databases
topic: transactions-and-isolation-interview
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/05-Transactions-and-Isolation/ACID as Engine Contracts|ACID as Engine Contracts]]"]
tags: [interviews, databases, transactions, isolation]
created: 2026-07-22
updated: 2026-07-22
---

# Transactions and Isolation Interview

## Linked Topic

- [[08-Databases/05-Transactions-and-Isolation/ACID as Engine Contracts|ACID as Engine Contracts]]
- [[08-Databases/05-Transactions-and-Isolation/Anomalies Dirty Nonrepeatable Phantom Serialization|Anomalies Dirty Nonrepeatable Phantom Serialization]]
- [[08-Databases/05-Transactions-and-Isolation/Locking vs MVCC|Locking vs MVCC]]
- [[08-Databases/05-Transactions-and-Isolation/Isolation Levels and Product Defaults|Isolation Levels and Product Defaults]]
- [[08-Databases/05-Transactions-and-Isolation/Snapshot Isolation and SSI Concepts|Snapshot Isolation and SSI Concepts]]

## How to Practice

1. Draw two-session timelines for anomaly questions.
2. Separate engine isolation from application idempotency.
3. Name Postgres default vs SQL standard mapping.
4. Close with retry policy and monitoring.

## ACID and Contracts

1. Explain ACID with engine mechanisms, not app patterns.

   - WAL + fsync for durability
   - MVCC/locks for isolation
   - Constraints for consistency

2. What is the difference between service transaction boundary and engine transaction?

   - Backend unit-of-work scope
   - Engine BEGIN/COMMIT
   - Distributed transaction handoff limit

## Anomalies

3. Define dirty, non-repeatable, phantom reads with examples.

   - Minimum isolation preventing each
   - Postgres READ COMMITTED behavior
   - Serializable difference

4. What is write skew? Does snapshot isolation prevent it?

   - Predicate dependencies
   - SSI detection in Postgres
   - Application-level fix

## Locking vs MVCC

5. Compare locking readers-writers vs MVCC snapshots.

   - Read doesn't block write in MVCC
   - Vacuum/version chain cost
   - When explicit locks still needed

6. When use `SELECT FOR UPDATE` vs rely on MVCC?

   - Hot row updates
   - Queue consumption
   - Lost update prevention

## Isolation Levels

7. Postgres isolation levels vs SQL standard — quirks?

   - Default READ COMMITTED
   - Repeatable read vs snapshot isolation
   - Serializable SSI conflicts

8. Global SERIALIZABLE — why might that hurt and alternatives?

   - Conflict rate and retries
   - Targeted serializable transactions
   - Explicit lock ordering

## Production

9. Intermittent wrong balance — isolation debug approach?

   - Reproduce with two sessions
   - Lost update vs read skew
   - Fix isolation or locking

10. Serialization failure spike — triage and policy?

    - Retry with backoff
    - Hot row splitting
    - Metrics on conflict rate

## Staff-Level

11. Org transaction policy — what do you standardize?

    - Default isolation, timeouts
    - Forbidden long transactions
    - Idempotency for retries

12. Teach isolation module — lab scenarios?

    - Anomaly clinic timelines
    - MVCC visibility lab
    - Assessment rubric

13. Compare Postgres isolation to MongoDB write concern — conceptual gap?

    - Document-level atomicity
    - Multi-document transactions
    - Application compensation patterns

14. Inventory deduction across warehouses — design without global lock?

    - Serializable or row locks
    - Deadlock ordering
    - Business rollback path

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| ACID | Definitions | WAL, MVCC, constraint mapping |
| Anomalies | Names only | Timelines, levels, write skew |
| Production | Max isolation | Risk-based policy, retries, metrics |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/Transactions and Isolation Exercises.md|Transactions and Isolation Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
