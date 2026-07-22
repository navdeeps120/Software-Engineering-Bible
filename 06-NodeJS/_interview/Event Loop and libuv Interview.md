---
title: Event Loop and libuv Interview
aliases: [Event Loop and libuv Interview Questions]
track: 06-NodeJS
topic: event-loop-and-libuv-interview
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/02-Event-Loop-and-libuv/Event Loop Phases|Event Loop Phases]]"]
tags: [interviews, nodejs, event-loop, libuv]
created: 2026-07-22
updated: 2026-07-22
---

# Event Loop and libuv Interview

## Linked Topic

- [[06-NodeJS/02-Event-Loop-and-libuv/libuv Architecture Overview|libuv Architecture Overview]]
- [[06-NodeJS/02-Event-Loop-and-libuv/Event Loop Phases|Event Loop Phases]]
- [[06-NodeJS/02-Event-Loop-and-libuv/process.nextTick vs Microtasks vs Timers|process.nextTick vs Microtasks vs Timers]]
- [[06-NodeJS/02-Event-Loop-and-libuv/Handles and Requests|Handles and Requests]]
- [[06-NodeJS/02-Event-Loop-and-libuv/Thread Pool and Blocking Work|Thread Pool and Blocking Work]]
- [[06-NodeJS/02-Event-Loop-and-libuv/Starvation Backpressure and Loop Health|Starvation Backpressure and Loop Health]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw loop phases before explaining timer ordering puzzles.
3. Distinguish JS thread, libuv pool, and worker threads.
4. Close with loop-delay metrics and operational thresholds.

## Contracts

1. What guarantees does the Node event loop provide — and what does it not guarantee?

   - Fairness between phases
   - No guarantee on timer precision under load
   - Backpressure is cooperative, not automatic

2. Contract for `process.nextTick` vs microtasks vs macrotasks — who runs first and why?

   - Starvation risk of recursive nextTick
   - Relation to [[02-JavaScript/05-Async-and-Concurrency/Promises Internals|Promises Internals]]
   - I/O callback context differences

## Internal Implementation

3. Walk one full event loop turn with pending timers, I/O, check, and close callbacks.

   - Phase purposes and typical work in each
   - `setImmediate` vs `setTimeout(0)` ordering cases
   - When loop exits

4. Explain handles vs requests with two examples each.

   - Ref/unref impact on process lifetime
   - Thread-pool requests vs async syscall completion
   - Default `UV_THREADPOOL_SIZE` implications

## Coding

5. Predict and verify output order for a provided nextTick/Promise/setImmediate/setTimeout script.

   - Explain both main module and I/O callback contexts
   - Minimal tracer implementation approach
   - Golden transcript in tests

6. Fix a health-check timeout caused by synchronous crypto on the request path.

   - Move work off hot path
   - Measure loop delay before/after
   - Preserve API contract

## Runtime Assumptions

7. Which operations use the libuv thread pool and what happens when it saturates?

   - fs, crypto, dns (platform-dependent) examples
   - Queueing delay vs JS blocking
   - Tuning pool size — benefits and limits

8. How do you detect event-loop starvation in production?

   - `monitorEventLoopDelay` histogram interpretation
   - Timer slip and p99 latency correlation
   - False positives during GC

## Production Judgment

9. API latency SLO missed during batch job on same process — architectural options.

   - Process isolation vs worker offload
   - Priority queues (limitations in Node)
   - Autoscaling signals

10. Untrusted plugin code in-process — loop watchdog and containment.

    - Infinite microtask/nextTick detection
    - Isolation via workers/child processes
    - Kill criteria and blast radius

## Staff-Level Selection

11. Standardize event-loop SLOs and dashboards for all Node services.

    - Required metrics and library choice
    - Alert thresholds tied to user latency
    - Exemption process for batch workers

12. Post-mortem:  minute-long pauses — build org learning from loop blocking.

    - Category taxonomy (sync fs, JSON, regex catastrophic)
    - Static analysis or lint rules
    - Profiling game day cadence

13. Evaluate libuv vs worker_threads vs external service for CPU work — decision matrix.

    - Latency, cost, deploy complexity
    - Published architecture guidance
    - Review checkpoint in design docs

14. How do you interview senior candidates on loop fluency without trivia?

    - Scenario-based ordering and production symptoms
    - Rubric aligned with exercises
    - Red flags (blocking calls dismissed)

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Phase model | "Async non-blocking" | Phase order, nextTick/microtasks, pool saturation |
| Internals | Names libuv | Handles/requests, ref rules, thread pool queueing |
| Production | Restart on CPU | Loop-delay SLIs, isolation, org SLO standards |

## Related Notes

- [[Career/README|Career]]
- [[06-NodeJS/_exercises/Event Loop and libuv Exercises.md|Event Loop and libuv Exercises]]
- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/README|Node.js]]
