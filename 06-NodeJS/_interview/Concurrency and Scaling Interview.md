---
title: Concurrency and Scaling Interview
aliases: [Concurrency and Scaling Interview Questions]
track: 06-NodeJS
topic: concurrency-and-scaling-interview
difficulty: advanced
status: active
prerequisites: ["[[06-NodeJS/06-Concurrency-and-Scaling/Choosing Threads Processes and Offload|Choosing Threads Processes and Offload]]"]
tags: [interviews, nodejs, concurrency, workers, cluster]
created: 2026-07-22
updated: 2026-07-22
---

# Concurrency and Scaling Interview

## Linked Topic

- [[06-NodeJS/06-Concurrency-and-Scaling/worker_threads Model|worker_threads Model]]
- [[06-NodeJS/06-Concurrency-and-Scaling/Worker Pools and Message Passing|Worker Pools and Message Passing]]
- [[06-NodeJS/06-Concurrency-and-Scaling/SharedArrayBuffer Atomics on Node|SharedArrayBuffer Atomics on Node]]
- [[06-NodeJS/06-Concurrency-and-Scaling/cluster and Multi-Process Scaling|cluster and Multi-Process Scaling]]
- [[06-NodeJS/06-Concurrency-and-Scaling/child_process IPC Patterns|child_process IPC Patterns]]
- [[06-NodeJS/06-Concurrency-and-Scaling/Choosing Threads Processes and Offload|Choosing Threads Processes and Offload]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw process/thread boundaries and IPC paths before scaling advice.
3. Quantify message-passing vs shared memory trade-offs.
4. Close with crash isolation and deploy coherence stories.

## Contracts

1. When should you scale via cluster vs worker_threads vs external workers?

   - CPU vs I/O bound phases
   - Shared state requirements
   - Crash blast radius

2. IPC contract for worker pool jobs: serialization, timeouts, cancellation, errors.

   - Structured clone limits
   - Transferables for buffers
   - Backpressure on job queue

## Internal Implementation

3. How does `cluster` share the listening port across workers?

   - Primary/worker roles
   - Scheduling incoming connections
   - Sticky sessions when needed (and alternatives)

4. SharedArrayBuffer + Atomics vs postMessage for hot counter — mechanics and races.

   - Memory ordering awareness (high level)
   - Security implications (Spectre-era policies)
   - When Atomics insufficient

## Coding

5. Implement worker pool with queue limit, job timeout, and graceful shutdown.

   - Worker recycle on memory threshold
   - Tests for saturation behavior
   - Benchmark parallel speedup

6. Debug cluster cache inconsistency after deploy — architecture fix.

   - Externalize cache or version keys
   - Rolling worker drain
   - Validation tests

## Runtime Assumptions

7. What is the overhead model for postMessage at 10k msgs/sec?

   - Serialization cost vs batching
   - Main thread still serializes
   - When offload hurts latency

8. child_process pool surviving native segfault — protocol and supervision.

   - Length-prefixed framing
   - Max restart rate
   - Health of pool from primary

## Production Judgment

9. 8 vCPU VM — how many cluster workers vs worker threads for mixed workload?

   - Leave headroom for libuv and GC
   - Metrics for right-sizing
   - Autoscaling pitfalls

10. Multi-tenant user code execution — isolation roadmap.

    - Threat model tiers
    - Cost of microVMs vs workers
    - Audit logging requirements

## Staff-Level Selection

11. Platform standard for CPU offload in Node services.

    - Approved patterns (pool library, limits)
    - Anti-patterns (sync crypto on request path)
    - Design review checklist

12. Game day: kill random workers during load — validate cluster resilience.

    - Expected client retry behavior
    - SLO impact measurement
    - Fix backlog from exercise

13. Deprecate in-process cache after split-brain incident — program management.

    - Dual-write period
    - Metrics proving coherence
    - Rollback triggers

14. Staff interview: "Just use cluster" — required depth for principal engineer.

    - Stateless design, IPC costs, isolation
    - Link to [[09-System-Design/README|System Design]] scaling
    - Career ladder expectations

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Model choice | One-size cluster | Matches workload, isolation, IPC costs |
| Internals | Names workers | cluster scheduling, SAB/Atomics, pool protocols |
| Production | Scales replicas only | Right-sizing, tenant isolation, game days |

## Related Notes

- [[Career/README|Career]]
- [[06-NodeJS/_exercises/Concurrency and Scaling Exercises.md|Concurrency and Scaling Exercises]]
- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/README|Node.js]]
