---
title: "EXPLAIN Literacy Workbench — Testing"
aliases: []
track: 08-Databases
topic: explain-literacy-workbench-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, databases, testing]
created: 2026-07-22
updated: 2026-07-22
---

# Testing — EXPLAIN Literacy Workbench

## Strategy

Golden plan JSON per fixture; chooser unit tests at cardinality boundaries; parser round-trip; harness scoring integration; optional Postgres adapter gated behind env flag.

## Critical Paths

1. Low selectivity + index available → index scan chosen
2. High selectivity or tiny table → seq scan chosen
3. Join crossover: nested loop wins small outer; hash join wins large
4. `diffPlan` detects extra sort node
5. Missing index fixture → hint contains suggested column
6. Reject multi-statement and DDL fixtures

## Commands

```bash
cd 08-Databases/code
npm test -- tests/labs.test.ts -t "ExplainHarness|CostModel|PlanParser"
```

Optional live Postgres (local only):

```bash
DEB_PG_URL=postgres://localhost/deb_test npm test -- tests/postgres-explain.integration.test.ts
```

## Definition of Done

- [ ] All rubric categories have at least one fixture
- [ ] Parser handles nested plans of depth ≥ 4
- [ ] Offline CI passes without Postgres
- [ ] Live adapter skips gracefully when env unset
- [ ] Score output stable for identical inputs

## Related Documents

- [[08-Databases/projects/EXPLAIN Literacy Workbench/README|README]]
- [[08-Databases/projects/Database Engines Workbench/Testing|Database Engines Workbench Testing]]
