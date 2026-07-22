---
title: "Database Engines Workbench — Known Issues"
aliases: []
track: 08-Databases
topic: database-engines-workbench-known-issues
difficulty: intermediate
status: active
prerequisites: []
tags: [project, databases, issues]
created: 2026-07-22
updated: 2026-07-22
---

# Known Issues — Database Engines Workbench

## Open Issues

| ID | Summary | Severity | Workaround | Status |
| --- | --- | --- | --- | --- |
| KI-001 | Code lab tree [[08-Databases/code\|08-Databases/code]] not yet fully implemented | high | Follow module paths in docs; implement with test-first workflow | open |
| KI-002 | No package facade or `deb` CLI adapter yet | high | Import planned paths directly during development | open |
| KI-003 | WAL lab is redo-only; no undo/multi-page atomic commit | medium | Use isolation lab for txn semantics separately | accepted for lab |
| KI-004 | B+ tree delete not in v1 scope | medium | Rebuild tree from scratch in exercises | accepted for lab |
| KI-005 | Redis lab uses JSON AOF, not RESP | medium | Document mapping; compare with wiki RESP note | accepted for lab |
| KI-006 | EXPLAIN cost model differs from Postgres planner | medium | Use for teaching crossover, not production tuning | accepted for lab |
| KI-007 | Engine advisor is heuristic, not workload simulator | medium | Pair with [[08-Databases/11-Modeling-and-Engine-Selection/PostgreSQL vs MongoDB vs Redis Decision Matrix\|Decision Matrix]] wiki | open |

## Technical Debt

Add dedicated test modules per capability, public re-exports, CLI schema validation, clean-install CI, tarball smoke tests, benchmark fixtures, and backup drill scripts per ADR-005. Pay contract and safety debt before new capabilities.

## Risk Rule

No issue above may be hidden or represented as Postgres/Mongo/Redis compatibility. Track delivery in [[08-Databases/projects/Database Engines Workbench/Roadmap|Roadmap]] and investigations in [[08-Databases/projects/Database Engines Workbench/Debug Diary|Debug Diary]].

## Related Documents

- [[08-Databases/projects/Database Engines Workbench/Postmortem|Postmortem]]
- [[08-Databases/projects/Database Engines Workbench/Roadmap|Roadmap]]
