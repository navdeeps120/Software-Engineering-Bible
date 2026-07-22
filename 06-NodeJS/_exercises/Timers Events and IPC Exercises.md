---
title: Timers Events and IPC Exercises
aliases: [Timers Events and IPC Drills]
track: 06-NodeJS
topic: timers-events-and-ipc-exercises
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [exercises, nodejs, timers, events, ipc]
created: 2026-07-22
updated: 2026-07-22
---

# Timers Events and IPC Exercises

Master timers and immediates, EventEmitter semantics, AbortSignal propagation, and MessagePort/BroadcastChannel IPC patterns that glue Node subsystems together.

## Linked Topic

- [[06-NodeJS/07-Timers-Events-and-IPC/Timers Immediate and Scheduling Nuance|Timers Immediate and Scheduling Nuance]]
- [[06-NodeJS/07-Timers-Events-and-IPC/EventEmitter Host Semantics and MaxListeners|EventEmitter Host Semantics and MaxListeners]]
- [[06-NodeJS/07-Timers-Events-and-IPC/AbortSignal Propagation Across Node APIs|AbortSignal Propagation Across Node APIs]]
- [[06-NodeJS/07-Timers-Events-and-IPC/MessagePort BroadcastChannel and Structured Clone|MessagePort BroadcastChannel and Structured Clone]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Compare `setTimeout`, `setInterval`, and `setImmediate` ref behavior, unref'd timers, and interaction with `clearTimeout`. When does a timer keep the process alive?

**Hint:** [[06-NodeJS/07-Timers-Events-and-IPC/Timers Immediate and Scheduling Nuance|Timers Immediate and Scheduling Nuance]].

**Acceptance criteria:**

- [ ] Ref/unref examples with process exit outcome
- [ ] Phase placement for each timer type
- [ ] Drift behavior for `setInterval` under load noted

### Problem 2 — `intermediate`

**Prompt:** Document EventEmitter contract: sync vs async listener errors, `once`, `prependListener`, and meaning of `MaxListenersExceededWarning`. When is raising the limit legitimate?

**Hint:** [[06-NodeJS/07-Timers-Events-and-IPC/EventEmitter Host Semantics and MaxListeners|EventEmitter Host Semantics]].

**Acceptance criteria:**

- [ ] Error propagation rules for sync throw in listener
- [ ] Memory leak detection scenario
- [ ] Legitimate high-listener case named

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[06-NodeJS/code/README|code labs]], implement `debounce(fn, ms, { signal })` and `throttle(fn, ms, { signal })` that honor `AbortSignal` and clear timers on abort.

**Acceptance criteria:**

- [ ] Abort prevents pending invocation
- [ ] Tests cover rapid calls and abort mid-wait
- [ ] No timer leaks after abort (process exits)

### Problem 2 — `intermediate`

**Prompt:** Build a parent/child MessagePort RPC: request id, method dispatch, timeout, and cancellation via AbortSignal. Handle structured clone errors gracefully.

**Hint:** [[06-NodeJS/07-Timers-Events-and-IPC/MessagePort BroadcastChannel and Structured Clone|MessagePort and Structured Clone]].

**Acceptance criteria:**

- [ ] RPC schema documented
- [ ] Timeout returns typed error
- [ ] Non-cloneable payload surfaces clear message

## Optimize

### Problem 1 — `intermediate`

**Prompt:** A service registers 500 `setInterval` pollers. Consolidate to one scheduler tick with jittered jobs. Measure handle count and loop delay before/after.

**Acceptance criteria:**

- [ ] Scheduler design with priority queue or bucketed ticks
- [ ] Jitter formula prevents thundering herd
- [ ] Metrics: active timer count, loop lag

### Problem 2 — `advanced`

**Prompt:** Propagate `AbortSignal` through a custom library wrapping `fetch`, fs read stream, and database query stub. Define composable `linkSignals(signals[])` helper.

**Hint:** [[06-NodeJS/07-Timers-Events-and-IPC/AbortSignal Propagation Across Node APIs|AbortSignal Propagation]].

**Acceptance criteria:**

- [ ] All three APIs abort cleanly in demo
- [ ] Listener cleanup on completion verified
- [ ] Documentation for consumer pattern

## Debug

### Problem 1 — `intermediate`

**Prompt:** Tests hang after suite — `'data'` listener leak on HTTP client. Write checklist using `process._getActiveHandles()` (dev) and `emitter.listenerCount` to find orphan listeners.

**Acceptance criteria:**

- [ ] Repro fixture with hanging process
- [ ] Fix removes listeners on `close`/`abort`
- [ ] Test asserts clean shutdown

### Problem 2 — `advanced`

**Prompt:** `EventEmitter` `'error'` events crash process when unhandled on nested emitters. Patch library to forward errors or use `captureRejections` pattern where applicable.

**Acceptance criteria:**

- [ ] Explains Node default for `'error'` event
- [ ] Patch strategy with regression tests
- [ ] Guidance for application error boundaries

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Design a job scheduler inside Node: delayed jobs, retries with exponential backoff, idempotency keys, and shutdown that persists pending jobs without double execution.

**Acceptance criteria:**

- [ ] Mermaid state machine for job lifecycle
- [ ] Backoff caps and dead-letter policy
- [ ] SIGTERM drains in-flight jobs

### Problem 2 — `advanced`

**Prompt:** Real-time fan-out uses BroadcastChannel across worker threads for cache invalidation. Define message schema, ordering guarantees, and fallback when channel unavailable (older Node).

**Acceptance criteria:**

- [ ] Schema versioned
- [ ] Ordering: at-most-once vs at-least-once stated
- [ ] Compatibility shim for deployment mix

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Scheduling | Treats all timers equal | Explains ref/unref, phases, drift, consolidated scheduling |
| Implementation | Raw setInterval everywhere | Abort-aware debounce, MessagePort RPC, signal linking |
| Production | Double-fires jobs on restart | Idempotent scheduler, BroadcastChannel invalidation with fallbacks |

## Related Notes

- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/_interview/Timers Events and IPC Interview.md|Timers Events and IPC Interview]]
- [[06-NodeJS/README|Node.js]]
- [[Career/README|Career]]
