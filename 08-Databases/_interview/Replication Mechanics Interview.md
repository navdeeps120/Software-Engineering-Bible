---
title: Replication Mechanics Interview
aliases: [Replication Mechanics Interview Questions]
track: 08-Databases
topic: replication-mechanics-interview
difficulty: advanced
status: active
prerequisites: ["[[08-Databases/07-Replication-Mechanics/Physical vs Logical Replication|Physical vs Logical Replication]]"]
tags: [interviews, databases, replication, failover]
created: 2026-07-22
updated: 2026-07-22
---

# Replication Mechanics Interview

## Linked Topic

- [[08-Databases/07-Replication-Mechanics/Physical vs Logical Replication|Physical vs Logical Replication]]
- [[08-Databases/07-Replication-Mechanics/Synchronous vs Asynchronous Durability|Synchronous vs Asynchronous Durability]]
- [[08-Databases/07-Replication-Mechanics/WAL Shipping and Streaming Replication|WAL Shipping and Streaming Replication]]
- [[08-Databases/07-Replication-Mechanics/Failover Promote and Split-Brain Mechanics|Failover Promote and Split-Brain Mechanics]]
- [[08-Databases/07-Replication-Mechanics/Replica Lag and Read-Your-Writes at Connection Level|Replica Lag and Read-Your-Writes at Connection Level]]

## How to Practice

1. Draw WAL flow primary → replica before answering.
2. Measure lag at flush vs replay separately.
3. State RPO/RTO with replication mode.
4. Name fencing and split-brain explicitly.

## Fundamentals

1. Physical vs logical replication — when each?

   - Byte-identical standby
   - Selective tables, upgrades
   - Conflict handling differences

2. Walk through streaming replication lifecycle.

   - WAL sender/receiver
   - Flush vs apply lag
   - Monitoring views

## Durability and Lag

3. Synchronous vs asynchronous replication trade-offs?

   - Commit wait on replica ack
   - RPO vs latency
   - Quorum configurations

4. What is replica lag and why does it matter for reads?

   - Stale read symptoms
   - Read-your-writes strategies
   - Session pinning

5. How implement read-your-writes with connection pools?

   - Sticky session after write
   - Primary fallback window
   - Pooler limitations (PgBouncer)

## Failover

6. Describe controlled failover steps.

   - Drain, promote, fence
   - DNS/proxy update
   - Reconnect storm

7. Split-brain after failover — how does it happen and prevent?

   - Old primary still accepting writes
   - STONITH, leader election
   - `pg_rewind` vs rebuild

8. Replication slot lag unbounded — causes and fix?

   - Consumer stopped
   - WAL retention on primary
   - Safe slot management

## Production

9. Async replication RPO for payments — acceptable?

   - Data loss window quantified
   - Sync alternative cost
   - Application idempotency

10. Multi-region read scaling — what replication gives vs doesn't?

    - Lag per region
    - No automatic multi-master
    - Handoff to System Design

## Staff-Level

11. Failover runbook essentials for org?

    - RTO owners, game days
    - Pool behavior documented
    - Post-failover verification

12. Logical replication for zero-downtime major upgrade — plan?

    - Publication/subscription setup
    - Cutover moment
    - Rollback path

13. Compare Postgres replication to MongoDB replica set election?

    - Durability defaults
    - Read preference semantics
    - Split-brain protections

14. Design replication lab for hires — learning outcomes?

    - Lag simulation
    - RYW router stub
    - Assessment rubric

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Mechanics | "Replica copies data" | WAL stream, lag points, slot retention |
| Failover | "Promote" | Fence, split-brain, reconnect storm |
| Product | Global low-latency reads fantasy | Honest lag, RYW, SD handoff |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/Replication Mechanics Exercises.md|Replication Mechanics Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
