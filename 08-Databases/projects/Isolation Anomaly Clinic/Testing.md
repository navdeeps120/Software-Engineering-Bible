---
title: "Isolation Anomaly Clinic — Testing"
aliases: []
track: 08-Databases
topic: isolation-anomaly-clinic-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, databases, testing]
created: 2026-07-22
updated: 2026-07-22
---

# Testing — Isolation Anomaly Clinic

## Strategy

One golden schedule per anomaly kind; negative tests proving prevention under stronger isolation; deadlock cycle fixtures; MVCC visibility unit tests isolated from scheduler.

## Critical Paths

1. Dirty read schedule → detected under RU, not under RC
2. Non-repeatable read → detected under RC snapshot-off, not under RR snapshot
3. Phantom insert → detected under RR snapshot, not under serializable locks
4. Write skew → detected under SI, abort under serializable
5. Deadlock `A→B→A` → victim chosen deterministically (lowest txn id lab policy)
6. Same schedule JSON → identical timeline hash across runs

## Commands

```bash
cd 08-Databases/code
npm test -- tests/labs.test.ts -t "IsolationLab|LockManager|Mvcc"
```

Fixture catalog: `08-Databases/code/tests/fixtures/isolation/*.json`.

## Definition of Done

- [ ] Every anomaly in wiki note has matching schedule fixture
- [ ] Classifier false-positive guard: serializable runs report `none`
- [ ] Lock cap exceeded throws typed error, not hang
- [ ] MVCC tuple visibility table tests independent of scheduler
- [ ] Postgres comparison docstrings link from test names (optional metadata)

## Related Documents

- [[08-Databases/projects/Isolation Anomaly Clinic/README|README]]
- [[08-Databases/projects/Database Engines Workbench/ADR/ADR-004 Isolation Lab Defaults|ADR-004]]
