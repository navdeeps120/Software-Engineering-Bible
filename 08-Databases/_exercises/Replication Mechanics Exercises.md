---
title: Replication Mechanics Exercises
aliases: [Replication Mechanics Drills]
track: 08-Databases
topic: replication-mechanics-exercises
difficulty: advanced
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, replication, wal, failover]
created: 2026-07-22
updated: 2026-07-22
---

# Replication Mechanics Exercises

Compare physical vs logical replication, sync vs async durability, WAL shipping and streaming, failover/promote/split-brain mechanics, and replica lag with read-your-writes at connection level.

## Linked Topic

- [[08-Databases/07-Replication-Mechanics/Physical vs Logical Replication|Physical vs Logical Replication]]
- [[08-Databases/07-Replication-Mechanics/Synchronous vs Asynchronous Durability|Synchronous vs Asynchronous Durability]]
- [[08-Databases/07-Replication-Mechanics/WAL Shipping and Streaming Replication|WAL Shipping and Streaming Replication]]
- [[08-Databases/07-Replication-Mechanics/Failover Promote and Split-Brain Mechanics|Failover Promote and Split-Brain Mechanics]]
- [[08-Databases/07-Replication-Mechanics/Replica Lag and Read-Your-Writes at Connection Level|Replica Lag and Read-Your-Writes at Connection Level]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Draw primary → standby physical replication path: WAL generate, stream, replay on replica. Label lag measurement points.

**Hint:** [[08-Databases/07-Replication-Mechanics/WAL Shipping and Streaming Replication|WAL Shipping and Streaming Replication]].

**Acceptance criteria:**

- [ ] Mermaid diagram with send/receive/flush/replay
- [ ] Difference flush vs replay lag
- [ ] Handoff to [[09-System-Design/README|System Design]] for multi-region product design

### Problem 2 — `intermediate`

**Prompt:** Compare physical byte-for-byte replication vs logical decoding for upgrade migration and selective table replicate.

**Hint:** [[08-Databases/07-Replication-Mechanics/Physical vs Logical Replication|Physical vs Logical Replication]].

**Acceptance criteria:**

- [ ] Use case table: DR, major version, partial replicate
- [ ] Schema change behavior difference
- [ ] Conflict handling on logical subscriber

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], simulate WAL stream: primary appends records; replica applies with configurable delay; expose lag seconds metric.

**Acceptance criteria:**

- [ ] Lag increases under load test
- [ ] Replica catches up when load stops
- [ ] Primary continues accepting writes during lag

### Problem 2 — `intermediate`

**Prompt:** Implement connection router stub: writes go to primary; reads use replica unless session flag `read-your-writes` pins to primary for 2s after write.

**Hint:** [[08-Databases/07-Replication-Mechanics/Replica Lag and Read-Your-Writes at Connection Level|Replica Lag and Read-Your-Writes]].

**Acceptance criteria:**

- [ ] After write, read sees own change on pin path
- [ ] Stale read possible without pin in test
- [ ] Document pool sticky session requirements

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Sync replica adds 40 ms commit latency. Model RPO gain vs p99 SLA; propose quorum sync vs async with fast failover.

**Hint:** [[08-Databases/07-Replication-Mechanics/Synchronous vs Asynchronous Durability|Synchronous vs Asynchronous Durability]].

**Acceptance criteria:**

- [ ] Latency/RPO table
- [ ] `synchronous_commit` and `remote_apply` mapping
- [ ] When async + DR drill acceptable

### Problem 2 — `advanced`

**Prompt:** Logical replication for analytics subset triggers bloat on publisher. Tune publication filters, replica identity, and initial copy strategy.

**Acceptance criteria:**

- [ ] Replica identity FULL vs DEFAULT impact
- [ ] Initial data sync vs concurrent load
- [ ] Monitoring replication slot lag

## Debug

### Problem 1 — `intermediate`

**Prompt:** Failover occurred; apps report duplicate key and missing rows. Build split-brain timeline: old primary not fenced, dual write window.

**Hint:** [[08-Databases/07-Replication-Mechanics/Failover Promote and Split-Brain Mechanics|Failover and Split-Brain]].

**Acceptance criteria:**

- [ ] STONITH / leader election requirement
- [ ] Rewind or rebuild decision tree
- [ ] Application idempotency role

### Problem 2 — `advanced`

**Prompt:** Replication slot lag grows unbounded; disk fills on primary. Diagnose long-running consumer vs orphaned slot vs WAL retention.

**Acceptance criteria:**

- [ ] `pg_replication_slots` inspection steps
- [ ] Risk of WAL removal blocked
- [ ] Safe slot drop procedure

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Draft failover runbook: detection, promote replica, fence old primary, DNS/proxy update, application reconnect storm mitigation.

**Acceptance criteria:**

- [ ] RTO steps with owners
- [ ] Connection pool drain behavior
- [ ] Quarterly game day checklist

### Problem 2 — `advanced`

**Prompt:** Global product needs read scaling in three regions. Clarify what replication mechanics provide vs what System Design must add (CRDT, conflict resolution).

**Acceptance criteria:**

- [ ] Read replica lag per region honest assessment
- [ ] No multi-master Postgres fantasy without trade-offs
- [ ] Explicit handoff to [[09-System-Design/README|System Design]]

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Replication types | "Master-slave" | Physical vs logical, WAL path, lag points |
| Durability | Sync good/async bad | RPO/latency quantified, quorum nuance |
| Failover | "Promote standby" | Fencing, split-brain, reconnect storm |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/Replication Mechanics Interview.md|Replication Mechanics Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
