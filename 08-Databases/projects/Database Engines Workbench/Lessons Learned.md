---
title: "Database Engines Workbench — Lessons Learned"
aliases: []
track: 08-Databases
topic: database-engines-workbench-lessons-learned
difficulty: intermediate
status: active
prerequisites: []
tags: [project, databases, lessons]
created: 2026-07-22
updated: 2026-07-22
---

# Lessons Learned — Database Engines Workbench

## Technical Lessons

- WAL ordering is the spine of crash safety—if the lab allows flush-before-WAL, learners inherit the wrong mental model.
- B+ splits are page-local events until WAL makes them durable; separating index pedagogy from heap storage clarifies secondary indexes.
- Isolation anomalies need **schedules**, not hope—deterministic interleaving beats random threading for teaching.
- Snapshot isolation is not serializable; write skew must be demonstrated, not asserted.
- AOF durability modes change the loss window more than command throughput charts suggest.
- EXPLAIN literacy requires both estimated and actual rows—fixtures can teach the gap without production access.

## Process and Product Lessons

Documentation must separate implemented behavior from target integration. Portfolio value comes from evidence—tests, trade-offs, security boundaries—not engine feature breadth. A CLI creates reproducible demos but adds schema and exit-code compatibility obligations. Engine-selection advice belongs in advisor + wiki matrix, not hidden in ORM defaults.

## Repeat and Change

Repeat test-first edge-case work and explicit non-goals (no Express, ORM, repos, database replacement claims). Next: contract tests before facade/CLI; benchmark baselines only after representative fixtures exist; ADR-005 drill scripts tied to wiki ops notes.

## Curriculum Feedback

Cross-link storage, WAL, indexes, isolation, Redis persistence, EXPLAIN, and ops notes to mini-project READMEs and [[08-Databases/projects/Database Engines Workbench/Architecture|Architecture]].

## Related Documents

- [[08-Databases/projects/Database Engines Workbench/Engineering Journal|Engineering Journal]]
- [[08-Databases/projects/Database Engines Workbench/Postmortem|Postmortem]]
