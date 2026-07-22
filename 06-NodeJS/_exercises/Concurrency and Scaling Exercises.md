---
title: Concurrency and Scaling Exercises
aliases: [Concurrency and Scaling Drills]
track: 06-NodeJS
topic: concurrency-and-scaling-exercises
difficulty: advanced
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [exercises, nodejs, concurrency, workers, cluster]
created: 2026-07-22
updated: 2026-07-22
---

# Concurrency and Scaling Exercises

Choose workers, cluster, child processes, and offload paths with explicit IPC contracts, isolation boundaries, and measurable scaling limits on Node.

## Linked Topic

- [[06-NodeJS/06-Concurrency-and-Scaling/worker_threads Model|worker_threads Model]]
- [[06-NodeJS/06-Concurrency-and-Scaling/Worker Pools and Message Passing|Worker Pools and Message Passing]]
- [[06-NodeJS/06-Concurrency-and-Scaling/SharedArrayBuffer Atomics on Node|SharedArrayBuffer Atomics on Node]]
- [[06-NodeJS/06-Concurrency-and-Scaling/cluster and Multi-Process Scaling|cluster and Multi-Process Scaling]]
- [[06-NodeJS/06-Concurrency-and-Scaling/child_process IPC Patterns|child_process IPC Patterns]]
- [[06-NodeJS/06-Concurrency-and-Scaling/Choosing Threads Processes and Offload|Choosing Threads Processes and Offload]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Compare `worker_threads`, `cluster.fork`, and `child_process.fork` on memory isolation, shared state, startup cost, and crash blast radius. When is each appropriate?

**Hint:** [[06-NodeJS/06-Concurrency-and-Scaling/Choosing Threads Processes and Offload|Choosing Threads Processes and Offload]].

**Acceptance criteria:**

- [ ] Comparison table with four axes
- [ ] One anti-pattern per option named
- [ ] Mermaid showing process vs thread boundaries

### Problem 2 — `intermediate`

**Prompt:** Explain structured clone limits for `postMessage` vs `SharedArrayBuffer` + Atomics for a counter. Include transferables and prototype loss.

**Hint:** [[06-NodeJS/06-Concurrency-and-Scaling/SharedArrayBuffer Atomics on Node|SharedArrayBuffer Atomics on Node]].

**Acceptance criteria:**

- [ ] Clone algorithm limits listed
- [ ] Race example without Atomics
- [ ] Link to [[06-NodeJS/07-Timers-Events-and-IPC/MessagePort BroadcastChannel and Structured Clone|Structured Clone]]

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[06-NodeJS/code/README|code labs]], implement a fixed-size worker pool executing CPU tasks (hash file blocks). Main thread accepts jobs via async API and respects backpressure when queue full.

**Acceptance criteria:**

- [ ] Pool size configurable
- [ ] Queue overflow policy (reject vs block) documented
- [ ] Benchmark shows parallel speedup on multi-core

### Problem 2 — `intermediate`

**Prompt:** Build `cluster` HTTP server sharing port with sticky-session-free design (stateless JWT). Primary handles metrics; workers handle requests. Graceful worker recycle on memory threshold.

**Hint:** [[06-NodeJS/06-Concurrency-and-Scaling/cluster and Multi-Process Scaling|cluster and Multi-Process Scaling]].

**Acceptance criteria:**

- [ ] SO_REUSEPORT / cluster scheduling understood
- [ ] Worker replace without dropping listening socket
- [ ] Integration test hits all workers over time

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Profile message-passing overhead vs SharedArrayBuffer ring buffer for 1M small jobs/sec. Choose design for image thumbnail service with latency SLO 200ms p99.

**Acceptance criteria:**

- [ ] Benchmark methodology and numbers
- [ ] Serialization cost breakdown
- [ ] Selected design justified against SLO

### Problem 2 — `advanced`

**Prompt:** Offload PDF parsing to child process pool to survive native segfaults. Design IPC protocol (length-prefixed JSON), heartbeat, and restart policy with max restart rate.

**Hint:** [[06-NodeJS/06-Concurrency-and-Scaling/child_process IPC Patterns|child_process IPC Patterns]].

**Acceptance criteria:**

- [ ] Protocol version field and schema
- [ ] Crash isolation demonstrated in test
- [ ] Circuit breaker on repeated child death

## Debug

### Problem 1 — `intermediate`

**Prompt:** Workers hang after ~1000 jobs — message port not referenced, GC closes port. Reproduce, fix with explicit port management, and add leak test.

**Acceptance criteria:**

- [ ] Root cause tied to event loop refs
- [ ] Fix documented in pool lifecycle
- [ ] Leak test runs 10k jobs stable RSS

### Problem 2 — `advanced`

**Prompt:** Cluster workers serve stale in-memory cache after deploy. Diagnose shared-nothing assumption violation and design external cache + rolling worker drain.

**Acceptance criteria:**

- [ ] Deploy timeline Mermaid with cache inconsistency window
- [ ] Fix uses versioned cache keys or Redis
- [ ] Rollout avoids split-brain reads

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Node service on 8 vCPU VM — choose worker count vs cluster worker count vs single process + async I/O. Present decision for mixed CPU and I/O workload with numbers.

**Acceptance criteria:**

- [ ] CPU-bound vs I/O-bound phases quantified
- [ ] Recommendation with core allocation diagram
- [ ] Autoscaling metric choice (CPU vs RPS vs queue depth)

### Problem 2 — `advanced`

**Prompt:** Multi-tenant SaaS runs user code snippets. Compare isolated-vm, worker sandboxes, and separate microVMs. Pick phased approach with cost and security trade-offs.

**Acceptance criteria:**

- [ ] Threat model: infinite loop, memory bomb, native escape
- [ ] Three-tier isolation roadmap
- [ ] Kill criteria and audit logging requirements

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Model choice | "Use cluster always" | Matches threads/processes/offload to workload and failure modes |
| Implementation | Spawns workers ad hoc | Pool, cluster recycle, IPC protocol with tests |
| Production | Ignores crash isolation | Segfault offload, deploy cache coherence, tenant isolation roadmap |

## Related Notes

- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/_interview/Concurrency and Scaling Interview.md|Concurrency and Scaling Interview]]
- [[06-NodeJS/README|Node.js]]
- [[Career/README|Career]]
