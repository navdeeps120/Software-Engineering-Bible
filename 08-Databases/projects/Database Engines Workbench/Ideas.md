---
title: "Database Engines Workbench — Ideas"
aliases: []
track: 08-Databases
topic: database-engines-workbench-ideas
difficulty: intermediate
status: active
prerequisites: []
tags: [project, databases, ideas]
created: 2026-07-22
updated: 2026-07-22
---

# Ideas — Database Engines Workbench

## Idea Backlog

| ID | Idea | Value hypothesis | Cost | Next research step |
| --- | --- | --- | --- | --- |
| I-001 | Doublewrite / torn-page lab flag on page store | Teaches checksum recovery path | medium | Define page checksum layout |
| I-002 | B+ delete and merge operations | Completes index lifecycle | medium | Golden tests for underflow |
| I-003 | Vacuum/GC pass on MVCC tuples | Links isolation to bloat | medium | Snapshot horizon metrics |
| I-004 | RESP AOF adapter behind feature flag | Closer Redis fidelity | low | Map JSON lines ↔ RESP subset |
| I-005 | Mongo write concern simulator (document-only) | Extends engine advisor | high | Scope separate mini project |
| I-006 | `EXPLAIN (BUFFERS)` normalizer for imported plans | Richer literacy | medium | Define buffer field mapping |
| I-007 | PITR drill script template for local Postgres | Operationalizes ADR-005 | medium | Script under code/scripts |

## Parking Lot

Express/repos/ORM products, full SQL OLTP engines, replication clusters, multi-region CAP design, replacing Postgres/Mongo/Redis, and arbitrary SQL execution are deferred—they violate current safety and non-goal boundaries.

Ideas enter [[08-Databases/projects/Database Engines Workbench/Roadmap|Roadmap]] only with validated learning problem, measurable outcome, architecture impact, maintenance owner, and compatibility plan.

## Related Documents

- [[08-Databases/projects/Database Engines Workbench/Roadmap|Roadmap]]
- [[08-Databases/projects/Database Engines Workbench/Architecture|Architecture]]
