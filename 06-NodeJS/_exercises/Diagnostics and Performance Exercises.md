---
title: Diagnostics and Performance Exercises
aliases: [Diagnostics and Performance Drills]
track: 06-NodeJS
topic: diagnostics-and-performance-exercises
difficulty: advanced
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [exercises, nodejs, diagnostics, performance, profiling]
created: 2026-07-22
updated: 2026-07-22
---

# Diagnostics and Performance Exercises

Profile CPU and heap, measure event-loop delay, track async context across awaits, and interpret flamegraphs with production-safe profiling discipline.

## Linked Topic

- [[06-NodeJS/08-Diagnostics-and-Performance/Diagnostics Channel and Async Context Tracking|Diagnostics Channel and Async Context Tracking]]
- [[06-NodeJS/08-Diagnostics-and-Performance/Inspector CPU Profiling and Heap Snapshots|Inspector CPU Profiling and Heap Snapshots]]
- [[06-NodeJS/08-Diagnostics-and-Performance/perf_hooks and Event Loop Delay|perf_hooks and Event Loop Delay]]
- [[06-NodeJS/08-Diagnostics-and-Performance/Memory Limits and Heap Flags|Memory Limits and Heap Flags]]
- [[06-NodeJS/08-Diagnostics-and-Performance/Flamegraphs Bottlenecks and Production Profiling Discipline|Flamegraphs Bottlenecks and Production Profiling Discipline]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Contrast sampling CPU profiler vs allocation timeline vs event-loop delay histogram. For each, state what class of bugs it finds and production safety (overhead, PII risk).

**Hint:** [[06-NodeJS/08-Diagnostics-and-Performance/Flamegraphs Bottlenecks and Production Profiling Discipline|Flamegraphs and Profiling Discipline]].

**Acceptance criteria:**

- [ ] Three tools mapped to symptom types
- [ ] Overhead order-of-magnitude noted
- [ ] When *not* to profile in prod

### Problem 2 — `intermediate`

**Prompt:** Explain `AsyncLocalStorage` / async context propagation: what breaks context (native addons, some `then` chains, mixed callbacks). Diagram request id flow across `await` boundaries.

**Hint:** [[06-NodeJS/08-Diagnostics-and-Performance/Diagnostics Channel and Async Context Tracking|Diagnostics Channel and Async Context]].

**Acceptance criteria:**

- [ ] Mermaid context propagation success path
- [ ] Two failure modes listed with fixes
- [ ] Link to [[06-NodeJS/10-Production-Node/Structured Logging and Correlation IDs|Correlation IDs]]

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[06-NodeJS/code/README|code labs]], implement `monitorEventLoopDelay()` sampler exporting p50/p99 lag to stdout every 10s using `perf_hooks.monitorEventLoopDelay`.

**Acceptance criteria:**

- [ ] Histogram reset policy documented
- [ ] Synthetic blocking task increases p99 in demo
- [ ] README documents interpretation

### Problem 2 — `intermediate`

**Prompt:** Build middleware using `AsyncLocalStorage` storing `requestId` and emit structured logs from deep async call stack without explicit parameter threading.

**Acceptance criteria:**

- [ ] Context survives `await` in test handler
- [ ] Leak test: no ALS store growth over 1k requests
- [ ] Fallback when context missing

## Optimize

### Problem 1 — `intermediate`

**Prompt:** CPU profile shows 40% in `JSON.parse` on hot path. Propose schema validation relocation, streaming parser, or worker offload — measure each with micro-benchmark and pick one.

**Acceptance criteria:**

- [ ] Before/after flamegraph or tick counts
- [ ] Trade-offs: latency, complexity, memory
- [ ] Chosen path has regression budget

### Problem 2 — `advanced`

**Prompt:** Heap snapshot diff implicates `Closure` retaining HTTP buffers after response end. Trace listener leak vs global cache; fix and verify retained size drops in second snapshot.

**Hint:** [[06-NodeJS/08-Diagnostics-and-Performance/Inspector CPU Profiling and Heap Snapshots|Heap Snapshots]].

**Acceptance criteria:**

- [ ] Diff steps documented (baseline, load, diff)
- [ ] Retainer path explained
- [ ] Post-fix snapshot comparison attached

## Debug

### Problem 1 — `intermediate`

**Prompt:** OOM with `--max-old-space-size=512` during batch export. Use heap snapshot or `process.memoryUsage` timeline to distinguish leak vs legitimate peak; tune or fix accordingly.

**Hint:** [[06-NodeJS/08-Diagnostics-and-Performance/Memory Limits and Heap Flags|Memory Limits and Heap Flags]].

**Acceptance criteria:**

- [ ] Timeline shows monotonic vs sawtooth growth
- [ ] Fix or flag change justified
- [ ] Guardrail alert for heap percent

### Problem 2 — `advanced`

**Prompt:** p99 latency spikes without high CPU — diagnose event-loop blockage vs GC vs thread-pool saturation using `perf_hooks`, `trace_events`, and active handles dump.

**Acceptance criteria:**

- [ ] Decision tree for three root causes
- [ ] Evidence collection commands listed
- [ ] Correct root cause identified in provided scenario

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Define continuous profiling strategy: sample rate, storage retention, symbolication, and access control. Align with on-call — when to capture 30s profile during incident.

**Acceptance criteria:**

- [ ] Sampling policy and overhead budget
- [ ] PII scrubbing for stacks and heap
- [ ] Runbook trigger conditions

### Problem 2 — `advanced`

**Prompt:** SLO dashboard combines loop lag, GC pause, RPS, and error rate. Design alert rules avoiding flapping; include burn-rate style alerts for loop lag SLO.

**Acceptance criteria:**

- [ ] SLI definitions with queries
- [ ] Multi-window alert rationale
- [ ] Tie to user-facing latency SLO

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Measurement | Guesses bottleneck | Matches tool to symptom; cites loop delay vs CPU vs heap |
| Implementation | console.log timing | ALS logging, loop delay sampler, snapshot diff workflow |
| Production | Profiles prod at 100% | Sampling policy, PII controls, SLO-linked alerts |

## Related Notes

- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/_interview/Diagnostics and Performance Interview.md|Diagnostics and Performance Interview]]
- [[06-NodeJS/README|Node.js]]
- [[Career/README|Career]]
