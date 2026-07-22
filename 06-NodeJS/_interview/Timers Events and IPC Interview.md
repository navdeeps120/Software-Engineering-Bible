---
title: Timers Events and IPC Interview
aliases: [Timers Events and IPC Interview Questions]
track: 06-NodeJS
topic: timers-events-and-ipc-interview
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/07-Timers-Events-and-IPC/EventEmitter Host Semantics and MaxListeners|EventEmitter Host Semantics and MaxListeners]]"]
tags: [interviews, nodejs, timers, events, ipc]
created: 2026-07-22
updated: 2026-07-22
---

# Timers Events and IPC Interview

## Linked Topic

- [[06-NodeJS/07-Timers-Events-and-IPC/Timers Immediate and Scheduling Nuance|Timers Immediate and Scheduling Nuance]]
- [[06-NodeJS/07-Timers-Events-and-IPC/EventEmitter Host Semantics and MaxListeners|EventEmitter Host Semantics and MaxListeners]]
- [[06-NodeJS/07-Timers-Events-and-IPC/AbortSignal Propagation Across Node APIs|AbortSignal Propagation Across Node APIs]]
- [[06-NodeJS/07-Timers-Events-and-IPC/MessagePort BroadcastChannel and Structured Clone|MessagePort BroadcastChannel and Structured Clone]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Place timers in loop phases when discussing ordering.
3. Explain EventEmitter error semantics before listener patterns.
4. Close with scheduler and cancellation production stories.

## Contracts

1. Timer ref/unref contract — what keeps process alive, and when to use `unref`?

   - Background pollers vs shutdown
   - Drift under event-loop load
   - Clearing timers on abort

2. EventEmitter `'error'` event contract — what happens if unhandled?

   - Sync throw in listener
   - `captureRejections` on async emitters (awareness)
   - MaxListenersExceededWarning meaning

## Internal Implementation

3. Compare `setImmediate` and `setTimeout(0)` placement in loop phases.

   - Main module vs I/O callback ordering puzzle
   - Relation to check phase
   - Testing approach

4. AbortSignal propagation through Node APIs — listener cleanup rules.

   - `abort` event and reason
   - Composing signals (any vs all)
   - Leaked listeners after completion

## Coding

5. Implement debounce/throttle with AbortSignal; prove no timer leaks on abort.

   - Tests for rapid calls
   - Process exit harness
   - Edge cases (zero ms, negative)

6. MessagePort RPC with timeout and structured clone error handling.

   - Request id correlation
   - Worker parent lifecycle
   - Cancellation mid-flight

## Runtime Assumptions

7. Consolidating 500 `setInterval` pollers — scheduler design and jitter.

   - Thundering herd prevention
   - Handle count metrics
   - Failure if single tick blocks

8. BroadcastChannel cache invalidation across workers — ordering guarantees.

   - at-most-once vs at-least-once
   - Fallback for older Node
   - Schema versioning

## Production Judgment

9. In-process job scheduler with retries, idempotency, and SIGTERM drain.

   - Backoff caps and DLQ
   - Persistence without double execution
   - Observability per job type

10. Test suite hangs — listener leak on HTTP client — org prevention.

    - Checklist for `close`/`abort`
    - CI timeout as backstop
    - Library patterns (scoped listeners)

## Staff-Level Selection

11. Standardize cancellation (`AbortSignal`) usage in internal HTTP/fs wrappers.

    - Required API shape
    - Lint or code review gate
    - Migration from manual flags

12. Incident: timer storm after clock skew / NTP jump — response playbook.

    - Detection signals
    - Defensive scheduling (monotonic clocks)
    - Comms and customer impact

13. Evaluate EventEmitter vs explicit return types for internal domain events.

    - Type safety and error propagation
    - Memory leak risk at scale
    - Published guidance for teams

14. Interview: design rate limiter using timers — depth beyond mutex map.

    - Token bucket on event loop
    - Distributed rate limit handoff
    - Career bar for backend-node role

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Timers/events | Uses setInterval | ref/unref, phases, error event semantics |
| IPC | JSON stringify only | MessagePort RPC, clone limits, BroadcastChannel |
| Production | Hangs tests | Idempotent scheduler, signal standards, leak prevention |

## Related Notes

- [[Career/README|Career]]
- [[06-NodeJS/_exercises/Timers Events and IPC Exercises.md|Timers Events and IPC Exercises]]
- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/README|Node.js]]
