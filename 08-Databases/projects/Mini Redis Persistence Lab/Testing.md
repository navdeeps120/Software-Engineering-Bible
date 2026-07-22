---
title: "Mini Redis Persistence Lab — Testing"
aliases: []
track: 08-Databases
topic: mini-redis-persistence-lab-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, databases, testing]
created: 2026-07-22
updated: 2026-07-22
---

# Testing — Mini Redis Persistence Lab

## Strategy

Command-level unit tests; fsync policy integration with crash simulator truncating AOF tail; rewrite equivalence (dict hash before/after); eviction under memory cap.

## Critical Paths

1. SET/GET/DEL/INCR semantics match Redis expectations on lab subset
2. Crash after write before fsync → bounded loss under `everysec`
3. Full replay equals pre-crash dict for `always` mode
4. Rewrite produces smaller file with identical `dumpAll()`
5. EXPIRE removes key after TTL in lazy path
6. Corrupt AOF line skipped or fails with line number per policy

## Commands

```bash
cd 08-Databases/code
npm test -- tests/labs.test.ts -t "RedisDict|RedisAof"
```

## Definition of Done

- [ ] All three fsync modes have crash-injection coverage
- [ ] Rewrite atomic swap tested via temp dir + failure injection
- [ ] Parser rejects oversize argv
- [ ] Memory accounting includes key overhead constant documented
- [ ] No open file handles after test teardown

## Related Documents

- [[08-Databases/projects/Mini Redis Persistence Lab/README|README]]
- [[08-Databases/projects/Database Engines Workbench/ADR/ADR-003 Redis Persistence Teaching Model|ADR-003]]
