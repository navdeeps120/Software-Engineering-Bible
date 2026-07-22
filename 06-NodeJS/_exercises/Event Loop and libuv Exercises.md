---
title: Event Loop and libuv Exercises
aliases: [Event Loop and libuv Drills]
track: 06-NodeJS
topic: event-loop-and-libuv-exercises
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [exercises, nodejs, event-loop, libuv]
created: 2026-07-22
updated: 2026-07-22
---

# Event Loop and libuv Exercises

Trace libuv loop phases, nextTick/microtask ordering, handles vs requests, thread-pool blocking, and starvation patterns that masquerade as "mysterious latency."

## Linked Topic

- [[06-NodeJS/02-Event-Loop-and-libuv/libuv Architecture Overview|libuv Architecture Overview]]
- [[06-NodeJS/02-Event-Loop-and-libuv/Event Loop Phases|Event Loop Phases]]
- [[06-NodeJS/02-Event-Loop-and-libuv/process.nextTick vs Microtasks vs Timers|process.nextTick vs Microtasks vs Timers]]
- [[06-NodeJS/02-Event-Loop-and-libuv/Handles and Requests|Handles and Requests]]
- [[06-NodeJS/02-Event-Loop-and-libuv/Thread Pool and Blocking Work|Thread Pool and Blocking Work]]
- [[06-NodeJS/02-Event-Loop-and-libuv/Starvation Backpressure and Loop Health|Starvation Backpressure and Loop Health]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Order the following for a single turn of the loop: `setTimeout`, `setImmediate`, `Promise.then`, `process.nextTick`, I/O callbacks. Explain *why* the order differs between main module and `fs.readFile` callback.

**Hint:** [[06-NodeJS/02-Event-Loop-and-libuv/process.nextTick vs Microtasks vs Timers|process.nextTick vs Microtasks vs Timers]].

**Acceptance criteria:**

- [ ] Correct ordering in both contexts with phase names
- [ ] Mermaid phase diagram referenced
- [ ] Handoff note to [[02-JavaScript/05-Async-and-Concurrency/Event Loop and Task Queues|JavaScript Event Loop]]

### Problem 2 — `intermediate`

**Prompt:** Classify ten Node APIs as handle-based, request-based, or purely V8 (e.g., `setInterval`, `fs.readFile`, `crypto.pbkdf2`, `TCP socket`). State which use the libuv thread pool.

**Hint:** [[06-NodeJS/02-Event-Loop-and-libuv/Handles and Requests|Handles and Requests]].

**Acceptance criteria:**

- [ ] Table with API, type, and thread-pool column
- [ ] At least two non-obvious pool users identified
- [ ] Pool size default noted

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[06-NodeJS/code/README|code labs]], build `loop-tracer.ts` that wraps `setTimeout`, `setImmediate`, and `queueMicrotask` to log registration order vs execution order for a provided scenario file.

**Acceptance criteria:**

- [ ] Tracer output matches documented golden transcript
- [ ] Does not mutate global timers in production code path
- [ ] README explains how to run scenarios

### Problem 2 — `intermediate`

**Prompt:** Implement a `runWithPoolBudget(fn, label)` wrapper that times thread-pool operations and warns when concurrent pool work exceeds `UV_THREADPOOL_SIZE`.

**Hint:** [[06-NodeJS/02-Event-Loop-and-libuv/Thread Pool and Blocking Work|Thread Pool and Blocking Work]].

**Acceptance criteria:**

- [ ] Uses `perf_hooks` or `process.hrtime.bigint`
- [ ] Warn threshold configurable
- [ ] Demo script saturates pool with sync crypto

## Optimize

### Problem 1 — `intermediate`

**Prompt:** A JSON API p99 latency spikes when uploads run. Profile event-loop delay during mixed I/O and CPU work. Propose splitting thread-pool work vs moving CPU to `worker_threads`.

**Acceptance criteria:**

- [ ] Before/after loop delay metrics defined
- [ ] Split plan names boundaries and message costs
- [ ] Link to [[06-NodeJS/06-Concurrency-and-Scaling/worker_threads Model|worker_threads Model]]

### Problem 2 — `advanced`

**Prompt:** Design a `nextTick`/`microtask` starvation detector that samples timer slip (scheduled vs actual fire time) and alerts when slip exceeds 50ms for 1 minute.

**Hint:** [[06-NodeJS/02-Event-Loop-and-libuv/Starvation Backpressure and Loop Health|Starvation Backpressure and Loop Health]].

**Acceptance criteria:**

- [ ] Detector algorithm specified with false-positive controls
- [ ] Integration point with metrics backend
- [ ] Runbook action when firing

## Debug

### Problem 1 — `intermediate`

**Prompt:** Given a script where `setImmediate` always fires before `setTimeout(0)`, explain the environment condition causing it. Provide a fixed variant and a broken variant side by side.

**Acceptance criteria:**

- [ ] Root cause tied to I/O phase vs main module
- [ ] Both outputs captured in test fixtures
- [ ] No hand-waving "timing dependent" without phase explanation

### Problem 2 — `advanced`

**Prompt:** Production symptom: health checks time out during backup job. Trace blocking `fs.readFileSync` in a request handler. Write patch using async fs + backpressure, and a regression test measuring loop delay.

**Acceptance criteria:**

- [ ] Loop delay measurement in test
- [ ] Sync call removed from hot path
- [ ] Health endpoint stays sub-10ms under load test

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** SRE asks for SLI definitions: event-loop lag, active handles, and thread-pool queue depth (proxy metrics). Define collection interval, alert thresholds, and dashboard panels.

**Acceptance criteria:**

- [ ] Three SLIs with formulas
- [ ] Thresholds tied to user-facing latency SLO
- [ ] Link to [[06-NodeJS/08-Diagnostics-and-Performance/perf_hooks and Event Loop Delay|perf_hooks and Event Loop Delay]]

### Problem 2 — `advanced`

**Prompt:** A shared platform runs untrusted user plugins in-process. Argue for/out against with isolation strategies (worker offload, resource limits, loop watchdog). Pick one architecture and define kill criteria.

**Acceptance criteria:**

- [ ] Threat model includes infinite microtasks and sync fs
- [ ] Architecture diagram with failure containment
- [ ] Kill switch and blast-radius analysis

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Phase model | Names "async" generically | Orders phases, nextTick, microtasks, and I/O with context |
| Implementation | Logs timestamps ad hoc | Tracer and pool-budget labs with golden transcripts |
| Production | Restarts on CPU spike | Loop-delay SLIs, starvation detection, and isolation design |

## Related Notes

- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/_interview/Event Loop and libuv Interview.md|Event Loop and libuv Interview]]
- [[06-NodeJS/README|Node.js]]
- [[Career/README|Career]]
