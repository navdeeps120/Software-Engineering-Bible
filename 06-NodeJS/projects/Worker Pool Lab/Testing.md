---
title: "Worker Pool Lab — Testing"
aliases: []
track: 06-NodeJS
topic: worker-pool-lab-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, nodejs, testing]
created: 2026-07-22
updated: 2026-07-22
---

# Testing — Worker Pool Lab

## Strategy

Deterministic worker script with configurable delay and failure hooks; assert ordering, queue depth, and clean termination.

## Critical Paths

1. `mapLimit` of 100 identity tasks preserves order with concurrency 4
2. Worker script throws on task id divisible by 7 → that task rejects, pool continues
3. Enqueue function (non-cloneable) → synchronous error
4. `close()` during queued work → pending reject with `PoolClosedError`
5. Replace worker after error event without pool size drift
6. Concurrent `run` never exceeds pool size active workers

## Commands

```bash
cd 06-NodeJS/code
npm test -- tests/labs.test.ts -t "WorkerPool"
```

## Definition of Done

- [ ] Tests use fixed worker script path relative to project root
- [ ] Timeouts on all pool operations in CI
- [ ] No reliance on real CPU-heavy crypto for correctness tests
- [ ] Worker threads terminated in `afterEach`

## Related Documents

- [[06-NodeJS/projects/Worker Pool Lab/README|README]]
- [[06-NodeJS/projects/Node Runtime Toolkit/Testing|Node Runtime Toolkit Testing]]
