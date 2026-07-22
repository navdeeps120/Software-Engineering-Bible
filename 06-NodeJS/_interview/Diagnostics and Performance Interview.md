---
title: Diagnostics and Performance Interview
aliases: [Diagnostics and Performance Interview Questions]
track: 06-NodeJS
topic: diagnostics-and-performance-interview
difficulty: advanced
status: active
prerequisites: ["[[06-NodeJS/08-Diagnostics-and-Performance/perf_hooks and Event Loop Delay|perf_hooks and Event Loop Delay]]"]
tags: [interviews, nodejs, diagnostics, performance, profiling]
created: 2026-07-22
updated: 2026-07-22
---

# Diagnostics and Performance Interview

## Linked Topic

- [[06-NodeJS/08-Diagnostics-and-Performance/Diagnostics Channel and Async Context Tracking|Diagnostics Channel and Async Context Tracking]]
- [[06-NodeJS/08-Diagnostics-and-Performance/Inspector CPU Profiling and Heap Snapshots|Inspector CPU Profiling and Heap Snapshots]]
- [[06-NodeJS/08-Diagnostics-and-Performance/perf_hooks and Event Loop Delay|perf_hooks and Event Loop Delay]]
- [[06-NodeJS/08-Diagnostics-and-Performance/Memory Limits and Heap Flags|Memory Limits and Heap Flags]]
- [[06-NodeJS/08-Diagnostics-and-Performance/Flamegraphs Bottlenecks and Production Profiling Discipline|Flamegraphs Bottlenecks and Production Profiling Discipline]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Match symptom → tool before recommending profiling.
3. State overhead and PII risks for production profiling.
4. Close with SLO-linked alerts and runbook triggers.

## Contracts

1. What observability contract should every Node HTTP service export?

   - Loop delay histogram, GC pauses (if available), RPS, errors
   - Correlation id in logs and traces
   - RED/USE method mapping

2. AsyncLocalStorage contract — what context must propagate across awaits?

   - requestId, auth, tenant
   - Failure when context dropped
   - Alternative to parameter drilling

## Internal Implementation

3. Walk CPU sampling profiler data from hot JS function to native stack.

   - Interpreter vs optimized code
   - Symbolication requirements
   - Misleading self time in async code

4. Heap snapshot diff — how do you find retained Buffer leak after response end?

   - Retainers view interpretation
   - Listener vs closure paths
   - Before/after snapshot discipline

## Coding

5. Implement event-loop delay sampler exporting p50/p99 every N seconds.

   - Synthetic blocking demo
   - Histogram reset policy
   - Low overhead design

6. Fix missing correlation id on async error path using AsyncLocalStorage.

   - Repro with two awaits then throw
   - Listener cleanup verification
   - Test assertions on log fields

## Runtime Assumptions

7. OOM at `--max-old-space-size=512` — leak vs legitimate peak decision tree.

   - Monotonic heap growth pattern
   - Container limit vs V8 limit
   - When to raise limit vs fix code

8. p99 latency spike, CPU flat — differentiate loop block vs GC vs pool saturation.

   - Metrics and commands
   - trace_events usage (awareness)
   - Correct remediation per cause

## Production Judgment

9. Continuous profiling strategy: sample rate, retention, access control.

   - When on-call captures 30s profile
   - PII in stacks and heap
   - Overhead budget approval

10. SLO dashboard: loop lag burn-rate alerts without flapping.

    - Multi-window alert design
    - User-facing latency linkage
    - False positive controls

## Staff-Level Selection

11. Org-wide requirement: loop delay SLI on all Node services — rollout.

    - Shared library vs sidecar
    - Enforcement in CI/charts
    - Exemptions for batch workers

12. Post-mortem culture: flamegraph literacy training program.

    - Curriculum tied to exercises
    - Game day profiling scenarios
    - Hiring rubric alignment

13. Evaluate eBPF vs in-process profilers for Node fleet.

    - Overhead, accuracy, operator skill
    - Vendor vs open source
    - Decision record template

14. Staff interview: "We'd add more pods" for latency — required pushback.

    - Loop delay, sync work, GC, pool
    - Evidence-based optimization
    - Career expectations for performance champions

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Tooling | console.time | Loop delay, snapshots, ALS, flamegraphs with discipline |
| Diagnosis | Adds CPU | Symptom→tool tree; leak vs peak; pool vs GC |
| Production | Profiles prod always | Sampling policy, PII, SLO alerts, org rollout |

## Related Notes

- [[Career/README|Career]]
- [[06-NodeJS/_exercises/Diagnostics and Performance Exercises.md|Diagnostics and Performance Exercises]]
- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/README|Node.js]]
