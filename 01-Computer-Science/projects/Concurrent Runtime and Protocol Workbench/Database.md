---
title: Concurrent Runtime and Protocol Workbench — Database
aliases: []
track: 01-Computer-Science
topic: concurrent-runtime-protocol-workbench-database
difficulty: beginner
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/README|Concurrent Runtime and Protocol Workbench]]"
tags: [project, database, n/a]
created: 2026-07-21
updated: 2026-07-21
---

# Database — Concurrent Runtime and Protocol Workbench

## Status: Not Applicable (Explicit Non-Goal)

This workbench **does not use a database**. Job state lives in **process memory** only:

| Data | Storage | Lifetime |
| --- | --- | --- |
| Pending jobs | `BoundedBuffer` queue | Until processed or process exit |
| Worker counters | In-memory integers | Process lifetime |
| VM output | Ephemeral response buffer | Per request |

## Why No Database

- **Learning focus:** Concurrency, framing, and VM mechanics—not ORM or migration tooling
- **Operational simplicity:** Zero external dependencies for local runs
- **Accepted trade-off:** Crash loses queued jobs (durability non-goal)

## If Persistence Were Required Later

An ADR would be needed before adding storage. Likely options and why deferred:

| Store | Would solve | Why rejected now |
| --- | --- | --- |
| SQLite | Crash-safe queue | Scope creep; hand off to [[08-Databases/README\|Databases]] track |
| Redis | Fast queue + pub/sub | External dependency; not first-principles |
| File append log | Audit trail | Durability lab belongs in I/O module |

## Related Documents

- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/README|README]] — non-goals
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Architecture|Architecture]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/ADR/0002-concurrency-model|ADR-0002]]
