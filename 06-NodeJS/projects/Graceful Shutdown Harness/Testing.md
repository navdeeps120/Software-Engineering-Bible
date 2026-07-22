---
title: "Graceful Shutdown Harness — Testing"
aliases: []
track: 06-NodeJS
topic: graceful-shutdown-harness-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, nodejs, testing]
created: 2026-07-22
updated: 2026-07-22
---

# Testing — Graceful Shutdown Harness

## Strategy

In-process unit tests for hook order and inflight counting; subprocess tests for exit codes and timeout; HTTP integration with slow handlers.

## Critical Paths

1. Hook registration order `a`, `b`, `c` runs teardown `c`, `b`, `a`
2. `trackInflight` blocks exit until async work completes
3. `server.close` stops new connections; slow handler completes within drain window
4. Hard timeout with stuck inflight → exit code 1 (subprocess)
5. Second `shutdown()` while draining returns same promise
6. Readiness false immediately after drain begins

## Commands

```bash
cd 06-NodeJS/code
npm test -- tests/labs.test.ts -t "ShutdownCoordinator"
```

## Definition of Done

- [ ] Subprocess tests portable on Windows and Unix signal availability documented
- [ ] Fake timers used for timeout tests where possible
- [ ] No orphaned servers or timers after each test
- [ ] Exit code assertions match ADR-004 table

## Related Documents

- [[06-NodeJS/projects/Graceful Shutdown Harness/README|README]]
- [[06-NodeJS/projects/Node Runtime Toolkit/ADR/ADR-004 Graceful Shutdown Contract|ADR-004]]
