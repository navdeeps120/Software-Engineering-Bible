---
title: "Database Engines Workbench — Debug Diary"
aliases: []
track: 08-Databases
topic: database-engines-workbench-debug-diary
difficulty: intermediate
status: active
prerequisites: []
tags: [project, databases, debugging]
created: 2026-07-22
updated: 2026-07-22
---

# Debug Diary — Database Engines Workbench

## Investigation Index

| Date | Observation | Finding | Prevention | Status |
| --- | --- | --- | --- | --- |
| 2026-07-22 | Portfolio requested integrated workbench while code tree is greenfield | Facade/CLI not yet present; module docs reference target paths under `08-Databases/code/src` | Mark CLI as target; gate release claims on tarball smoke + contract tests | tracked |
| 2026-07-22 | WAL recovery ordering easy to get wrong in tests | Flush-before-WAL must fail fast in debug builds | Add explicit invariant assertion in buffer pool | tracked |
| 2026-07-22 | Isolation schedules can hang if lock cap missing | Need max steps and max locks | Enforce caps in schedule runner | tracked |

## Debug Protocol

Reproduce with smallest fixture, capture Node/Vitest versions and exact command, classify contract versus implementation failure, add failing test, then fix without weakening assertions. Preserve WAL LSN traces, recovery page dumps, isolation timelines, and AOF replay diffs when relevant.

```mermaid
flowchart LR
    Symptom --> Reproduce --> Minimize --> Test[Failing test]
    Test --> Fix --> Verify[Focused + full suite]
    Verify --> Learn[Known issue lesson or ADR]
```

Escalate release-impacting or repeated failures to [[08-Databases/projects/Database Engines Workbench/Postmortem|Postmortem]].

## Related Documents

- [[08-Databases/projects/Database Engines Workbench/Known Issues|Known Issues]]
- [[08-Databases/12-Production-Database-Ops/Operational Readiness for Database Engines|Operational Readiness for Database Engines]]
