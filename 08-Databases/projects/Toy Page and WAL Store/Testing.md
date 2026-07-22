---
title: "Toy Page and WAL Store — Testing"
aliases: []
track: 08-Databases
topic: toy-page-and-wal-store-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, databases, testing]
created: 2026-07-22
updated: 2026-07-22
---

# Testing — Toy Page and WAL Store

## Strategy

Property-style unit tests for page slot math; integration tests for WAL-before-page ordering; crash-injection tests that restart `WalRecoverer` on temp directories.

## Critical Paths

1. Insert tuple → WAL record exists with matching payload before page marked clean-durable
2. Buffer pool hit/miss accounting under repeated reads
3. Eviction skips pinned frames; evicts LRU among unpinned
4. Checkpoint reduces recovery scan length—verify replay count drops
5. Simulated crash mid-transaction leaves store consistent to last durable WAL
6. Idempotent redo: run recovery twice, byte-compare pages

## Commands

```bash
cd 08-Databases/code
npm test -- tests/labs.test.ts -t "PageStore|BufferPool|Wal"
```

Crash injection helper:

```bash
npm run lab -- wal crash-test --records 500 --crash-probability 0.05
```

## Definition of Done

- [ ] Temp directories cleaned after each test; no cross-test file leaks
- [ ] fsync policy matrix covered: at least `always` and `never` cases
- [ ] Negative test: flush-before-WAL scenario fails fast in debug builds
- [ ] Recovery tests portable on Windows and Unix path separators
- [ ] Benchmark fixtures documented when bench job lands

## Related Documents

- [[08-Databases/projects/Toy Page and WAL Store/README|README]]
- [[08-Databases/projects/Database Engines Workbench/Testing|Database Engines Workbench Testing]]
