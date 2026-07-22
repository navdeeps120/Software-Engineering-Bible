---
title: WAL Durability and Recovery Exercises
aliases: [WAL Durability and Recovery Drills]
track: 08-Databases
topic: wal-durability-and-recovery-exercises
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, wal, durability, recovery]
created: 2026-07-22
updated: 2026-07-22
---

# WAL Durability and Recovery Exercises

Implement write-ahead logging, reason about fsync and group commit, checkpoint dirty pages, replay redo/undo on crash, and defend against torn pages.

## Linked Topic

- [[08-Databases/02-WAL-Durability-and-Recovery/Write-Ahead Logging Protocol|Write-Ahead Logging Protocol]]
- [[08-Databases/02-WAL-Durability-and-Recovery/fsync Group Commit and Durability Levels|fsync Group Commit and Durability Levels]]
- [[08-Databases/02-WAL-Durability-and-Recovery/Checkpoints and Dirty Page Flushing|Checkpoints and Dirty Page Flushing]]
- [[08-Databases/02-WAL-Durability-and-Recovery/Crash Recovery Redo and Undo Concepts|Crash Recovery Redo and Undo Concepts]]
- [[08-Databases/02-WAL-Durability-and-Recovery/Torn Pages and Doublewrite Concepts|Torn Pages and Doublewrite Concepts]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Draw the WAL rule: log record must reach durable storage before data page write. Show commit record ordering vs page flush.

**Hint:** [[08-Databases/02-WAL-Durability-and-Recovery/Write-Ahead Logging Protocol|Write-Ahead Logging Protocol]].

**Acceptance criteria:**

- [ ] Mermaid sequence: BEGIN → log → commit log → fsync → ack
- [ ] Dirty page may lag commit explicitly shown
- [ ] Cross-link to [[08-Databases/01-Storage-and-Buffer-Pool/Buffer Pool vs OS Page Cache|Buffer Pool]]

### Problem 2 — `intermediate`

**Prompt:** Compare `synchronous_commit=on`, `remote_apply`, and `off` durability contracts. What data loss window does each admit on single-node crash vs primary failure?

**Hint:** [[08-Databases/02-WAL-Durability-and-Recovery/fsync Group Commit and Durability Levels|fsync Group Commit and Durability Levels]].

**Acceptance criteria:**

- [ ] Three settings with loss window table
- [ ] Latency trade-off named
- [ ] When `off` is never acceptable for financial ledger

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], implement append-only WAL with sequence numbers: append insert/update records, replay on startup to rebuild table state.

**Acceptance criteria:**

- [ ] Monotonic LSN per record
- [ ] Replay idempotent for same LSN range
- [ ] Test: crash after log append, before page apply — recovery succeeds

### Problem 2 — `intermediate`

**Prompt:** Add checkpoint: flush all dirty pages, write checkpoint record with max LSN, truncate WAL before checkpoint on clean restart.

**Hint:** [[08-Databases/02-WAL-Durability-and-Recovery/Checkpoints and Dirty Page Flushing|Checkpoints and Dirty Page Flushing]].

**Acceptance criteria:**

- [ ] Recovery starts from last checkpoint LSN
- [ ] Redo applies records after checkpoint only
- [ ] Metrics: checkpoint duration, WAL bytes retained

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Measure commit latency with sync vs async fsync in lab. Implement group commit batching: multiple transactions share one fsync.

**Acceptance criteria:**

- [ ] Latency histogram before/after
- [ ] Throughput vs p99 trade-off documented
- [ ] Correctness oracle: no acknowledged commit lost on crash test

### Problem 2 — `advanced`

**Prompt:** Design doublewrite buffer stub for torn page detection on simulated partial page write. On recovery, detect torn page and restore from doublewrite copy.

**Hint:** [[08-Databases/02-WAL-Durability-and-Recovery/Torn Pages and Doublewrite Concepts|Torn Pages and Doublewrite Concepts]].

**Acceptance criteria:**

- [ ] Torn page checksum or magic failure detected
- [ ] Recovery path uses doublewrite before redo
- [ ] Test injects partial write at random offset

## Debug

### Problem 1 — `intermediate`

**Prompt:** After power loss, database starts but recent commits missing. Write debug brief: fsync policy, `synchronous_commit`, battery-backed cache assumptions.

**Acceptance criteria:**

- [ ] Timeline of last acknowledged commit vs last fsync'd WAL
- [ ] Three config knobs checked
- [ ] Links to [[08-Databases/00-Orientation/Database Failure Modes Corruption and Durability|Failure Modes]]

### Problem 2 — `advanced`

**Prompt:** WAL disk fills; checkpoints cannot keep pace. Diagnose checkpoint tuning vs insert spike vs `archive_command` stall.

**Acceptance criteria:**

- [ ] `max_wal_size`, checkpoint timeout, IO saturation
- [ ] Mermaid feedback loop WAL growth → checkpoint pressure
- [ ] Mitigation runbook with rollback

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Draft durability SLA for payments service: define RPO with Postgres settings, replication, and application ack policy.

**Acceptance criteria:**

- [ ] RPO/RTO table with config mapping
- [ ] Handoff to [[08-Databases/07-Replication-Mechanics/Synchronous vs Asynchronous Durability|Sync Replication]]
- [ ] Quarterly crash-recovery drill checklist

### Problem 2 — `advanced`

**Prompt:** Cloud provider offers "ephemeral local SSD" for WAL at half price. Assess torn-page risk, AZ failure, and migration to durable WAL volume.

**Acceptance criteria:**

- [ ] Failure modes beyond single-node crash
- [ ] Doublewrite and replication requirements
- [ ] Cost vs risk decision matrix

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| WAL ordering | "Transactions are safe" | Log-before-data, commit LSN, redo start point |
| Durability | Binary safe/unsafe | fsync levels, loss windows, group commit |
| Production | Default sync | SLA-mapped settings, WAL capacity planning |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/WAL Durability and Recovery Interview.md|WAL Durability and Recovery Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
