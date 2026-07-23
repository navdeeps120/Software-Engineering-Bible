---
title: Production Database Ops Exercises
aliases: [Production Database Ops Drills]
track: 08-Databases
topic: production-database-ops-exercises
difficulty: advanced
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, production, ops, backups]
created: 2026-07-22
updated: 2026-07-22
---

# Production Database Ops Exercises

Synthesize connection pooling at engine and proxy, backups with PITR and restore drills, monitoring checkpoints/lag/bloat/cache hit, roles/TLS/least privilege, and operational readiness checklists.

## Linked Topic

- [[08-Databases/12-Production-Database-Ops/Connection Pooling at Engine and Proxy|Connection Pooling at Engine and Proxy]]
- [[08-Databases/12-Production-Database-Ops/Backups PITR and Restore Drills|Backups PITR and Restore Drills]]
- [[08-Databases/12-Production-Database-Ops/Monitoring Checkpoints Lag Bloat Cache Hit|Monitoring Checkpoints Lag Bloat Cache Hit]]
- [[08-Databases/12-Production-Database-Ops/Roles TLS and Least Privilege to the Database|Roles TLS and Least Privilege to the Database]]
- [[08-Databases/12-Production-Database-Ops/Operational Readiness for Database Engines|Operational Readiness for Database Engines]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Draw connection path: app → pooler (PgBouncer) → Postgres. Label transaction vs statement pooling modes and what breaks prepared statements.

**Hint:** [[08-Databases/12-Production-Database-Ops/Connection Pooling at Engine and Proxy|Connection Pooling at Engine and Proxy]].

**Acceptance criteria:**

- [ ] Mermaid diagram with pool modes
- [ ] `max_connections` vs pool size math
- [ ] Handoff to [[07-Backend/README|Backend]] for client pool settings

### Problem 2 — `intermediate`

**Prompt:** Compare logical backup (`pg_dump`) vs physical base backup + WAL archiving for RPO/RTO on 2 TB database.

**Hint:** [[08-Databases/12-Production-Database-Ops/Backups PITR and Restore Drills|Backups PITR and Restore Drills]].

**Acceptance criteria:**

- [ ] RPO/RTO table per method
- [ ] PITR restore steps outlined
- [ ] Restore drill success criteria

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], configure health check script: connect, `SELECT 1`, report replication lag and connection count thresholds.

**Acceptance criteria:**

- [ ] JSON health output for orchestrator
- [ ] Lag threshold fails readiness
- [ ] No superuser credentials in app path

### Problem 2 — `intermediate`

**Prompt:** Script automated restore drill to staging: restore base backup, replay WAL to target time, run smoke queries, record duration.

**Acceptance criteria:**

- [ ] Idempotent drill script documented
- [ ] Smoke tests validate row counts
- [ ] Runbook entry with owner and frequency

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Dashboard shows checkpoint spikes correlating with p99 latency. Tune `max_wal_size`, `checkpoint_completion_target`, and schedule IO-friendly windows.

**Hint:** [[08-Databases/12-Production-Database-Ops/Monitoring Checkpoints Lag Bloat Cache Hit|Monitoring Checkpoints Lag Bloat Cache Hit]].

**Acceptance criteria:**

- [ ] Before/after checkpoint graph
- [ ] WAL generation rate metric
- [ ] Link [[08-Databases/02-WAL-Durability-and-Recovery/Checkpoints and Dirty Page Flushing|Checkpoints]]

### Problem 2 — `advanced`

**Prompt:** Right-size connection pools across 50 microservices: eliminate connection storms after deploy. Model total connections vs `max_connections`.

**Acceptance criteria:**

- [ ] Per-service pool formula
- [ ] PgBouncer transaction pooling decision
- [ ] Alert on connection saturation

## Debug

### Problem 1 — `intermediate`

**Prompt:** After certificate rotation, apps cannot connect. Build TLS debug checklist: verify-full, SAN mismatch, pooler TLS termination.

**Hint:** [[08-Databases/12-Production-Database-Ops/Roles TLS and Least Privilege to the Database|Roles TLS and Least Privilege]].

**Acceptance criteria:**

- [ ] openssl s_client steps
- [ ] Role vs certificate auth separation
- [ ] Rollback to previous cert window

### Problem 2 — `advanced`

**Prompt:** Table bloat alert fires; autovacuum runs but size unchanged. Diagnose long transaction, replication slot, and aggressive freeze needs.

**Acceptance criteria:**

- [ ] `pg_stat_user_tables` + slot queries
- [ ] `VACUUM FULL` last resort risks
- [ ] Cross-link concurrency module

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Complete [[08-Databases/12-Production-Database-Ops/Operational Readiness for Database Engines|Operational Readiness Checklist]] for new Postgres cluster: backups, monitoring, roles, pool, failover game day.

**Acceptance criteria:**

- [ ] Every checklist item evidenced or scheduled
- [ ] On-call runbook links
- [ ] Sign-off from Backend and platform teams

### Problem 2 — `advanced`

**Prompt:** Region loss requires restore in DR region within 1 hour RTO. Document backup chain, DNS cutover, pool drain, and replica promotion sequence.

**Acceptance criteria:**

- [ ] Mermaid timeline with RTO gates
- [ ] Data loss window stated honestly
- [ ] Handoff to [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Edge Admission Control and Global Traffic Steering|Edge Admission Control and Global Traffic Steering]] for product traffic shift

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Pooling | "Increase max_connections" | Pool math, PgBouncer modes, storm prevention |
| Backups | "We have snapshots" | PITR drill evidence, RPO/RTO measured |
| Security | Shared superuser | Roles, TLS verify, least privilege |
| Readiness | Ad hoc ops | Checklist, dashboards, game days |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/Production Database Ops Interview.md|Production Database Ops Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
