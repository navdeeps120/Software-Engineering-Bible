---
title: Production Database Ops Interview
aliases: [Production Database Ops Interview Questions]
track: 08-Databases
topic: production-database-ops-interview
difficulty: advanced
status: active
prerequisites: ["[[08-Databases/12-Production-Database-Ops/Operational Readiness for Database Engines|Operational Readiness for Database Engines]]"]
tags: [interviews, databases, production, ops]
created: 2026-07-22
updated: 2026-07-22
---

# Production Database Ops Interview

## Linked Topic

- [[08-Databases/12-Production-Database-Ops/Connection Pooling at Engine and Proxy|Connection Pooling at Engine and Proxy]]
- [[08-Databases/12-Production-Database-Ops/Backups PITR and Restore Drills|Backups PITR and Restore Drills]]
- [[08-Databases/12-Production-Database-Ops/Monitoring Checkpoints Lag Bloat Cache Hit|Monitoring Checkpoints Lag Bloat Cache Hit]]
- [[08-Databases/12-Production-Database-Ops/Roles TLS and Least Privilege to the Database|Roles TLS and Least Privilege to the Database]]
- [[08-Databases/12-Production-Database-Ops/Operational Readiness for Database Engines|Operational Readiness for Database Engines]]

## How to Practice

1. Quantify RPO/RTO with backup method named.
2. Draw app → pooler → engine path for pooling questions.
3. List monitoring metrics with alert thresholds.
4. Close with game day or drill evidence.

## Connection Pooling

1. Why connection pool at app and pooler (PgBouncer)?

   - `max_connections` limits
   - Transaction vs session pooling
   - Prepared statement breakage

2. Connection storm after deploy — causes and fixes?

   - Pool misconfiguration
   - Thundering herd on cold start
   - Gradual ramp / pool limits

## Backups and PITR

3. Logical vs physical backup — when each?

   - pg_dump portability
   - Base backup + WAL for PITR
   - RPO/RTO comparison

4. Describe PITR restore procedure.

   - Base backup restore
   - WAL replay to target time
   - Verification queries

5. How often run restore drills and what proves success?

   - Staging automation
   - Row count oracles
   - Documented duration

## Monitoring

6. Key Postgres metrics on dashboard?

   - Replication lag, buffer hit, checkpoints
   - Dead tuples, xact age
   - Connection count

7. Checkpoint spikes hurting latency — tuning?

   - max_wal_size, completion target
   - WAL rate monitoring
   - IO scheduling

8. Bloat alert but vacuum "runs" — debug?

   - Long snapshots, slots
   - VACUUM FULL risks
   - Table-specific settings

## Security

9. Database least privilege model?

   - App role vs migration role
   - Schema usage grants
   - No superuser in app

10. TLS to Postgres — common failure modes?

    - verify-full, SAN mismatch
    - Pooler termination
    - Cert rotation playbook

## Production Readiness

11. Operational readiness checklist items?

    - Backups, monitoring, failover drill
    - Pool sizing, on-call runbooks
    - Link readiness note

12. Region loss RTO 1 hour — outline response?

    - Restore chain in DR
    - DNS/proxy cutover
    - Honest RPO statement

## Staff-Level

13. Database SRE standards for 30 teams?

    - Mandatory drills, dashboards
    - Migration review integration
    - Exception process

14. Post-incident: backup existed but restore failed — review agenda?

    - Untested backups root cause
    - Drill frequency policy
    - Tooling investment

15. When escalate ops issue to engine internals module owner?

    - WAL, vacuum, planner boundaries
    - Cross-team routing
    - Communication template

16. Design ops module capstone — what must hire demonstrate?

    - Pool math, PITR drill, readiness checklist
    - Alignment with [[08-Databases/_exercises/Production Database Ops Exercises.md|Ops Exercises]]
    - Career-level storytelling

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Pooling | max_connections only | Pooler modes, storm prevention |
| Backups | Snapshots mentioned | PITR steps, drill cadence |
| Readiness | Reactive firefighting | Checklists, metrics, game days |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/Production Database Ops Exercises.md|Production Database Ops Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
