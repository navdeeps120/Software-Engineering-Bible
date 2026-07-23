---
title: Capacity Latency and Bottlenecks Exercises
aliases: [01 Capacity Exercises]
track: 09-System-Design
topic: capacity-latency-and-bottlenecks-exercises
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/_exercises/00-Orientation-and-Boundaries|Orientation and Boundaries Exercises]]"]
tags: [exercises, system-design, capacity, latency, bottlenecks]
created: 2026-07-23
updated: 2026-07-23
---

# Capacity Latency and Bottlenecks Exercises

Estimate capacity from workload assumptions, set percentile latency budgets, apply Little's Law, find bottlenecks, and trade cost against performance.

## Linked Topic

- [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Back-of-Envelope Capacity Estimation|Back-of-Envelope Capacity Estimation]]
- [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Latency Budgets Percentiles and Tail Behavior|Latency Budgets Percentiles and Tail Behavior]]
- [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Throughput Queuing and Littles Law Intuition|Throughput Queuing and Littles Law Intuition]]
- [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Bottleneck Finding CPU Memory Disk Network|Bottleneck Finding CPU Memory Disk Network]]
- [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Cost Performance and Capacity Trade-offs|Cost Performance and Capacity Trade-offs]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Define QPS, RPS, concurrent users, and occupancy. Give one example where confusing them leads to under-provisioning.

**Hint:** [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Back-of-Envelope Capacity Estimation|Back-of-Envelope Capacity Estimation]].

**Acceptance criteria:**

- [ ] Precise definitions with units
- [ ] Counterexample with wrong conclusion
- [ ] Peak vs average distinguished

### Problem 2 — `intermediate`

**Prompt:** Why is p99 more actionable than average latency for a checkout API? Explain tail amplification across three serial hops.

**Hint:** [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Latency Budgets Percentiles and Tail Behavior|Latency Budgets Percentiles and Tail Behavior]].

**Acceptance criteria:**

- [ ] Serial composition effect explained
- [ ] Numerical example with hop budgets
- [ ] User-visible SLO mapping

### Problem 3 — `intermediate`

**Prompt:** State Little's Law and interpret L = λW for an API with 2000 RPS and 50 ms mean latency. What does concurrency imply for thread/connection pools?

**Acceptance criteria:**

- [ ] Correct L computation
- [ ] Pool sizing implication
- [ ] Link to [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Throughput Queuing and Littles Law Intuition|Throughput Queuing and Littles Law Intuition]]

## Model

### Problem 1 — `beginner`

**Prompt:** Estimate storage and bandwidth for 10M users uploading 2 photos/day of 1 MB average, 3-year retention, 80/20 hot/cold.

**Acceptance criteria:**

- [ ] Daily ingest, yearly growth, total TB
- [ ] Peak bandwidth with peak factor
- [ ] Assumptions listed

### Problem 2 — `intermediate`

**Prompt:** Build a latency budget table for "open feed": CDN, edge, API, cache, DB. Allocate p99 so end-to-end ≤ 300 ms.

**Acceptance criteria:**

- [ ] Per-hop budgets sum ≤ 300 ms with margin
- [ ] Contingency for cache miss path
- [ ] Which hop is non-negotiable called out

### Problem 3 — `advanced`

**Prompt:** Model a write path with queueing: service time 8 ms, arrival 80% of capacity. Estimate queue wait using an M/M/1-style intuition (order of magnitude, not proof).

**Acceptance criteria:**

- [ ] Utilization ρ stated
- [ ] Wait time grows nonlinearly near saturation
- [ ] Operational implication: headroom target (e.g., 50–70%)

## Design

### Problem 1 — `intermediate`

**Prompt:** Design a capacity plan for a read-heavy catalog: replicas, cache hit rate target, and instance counts. Justify from QPS and p99.

**Acceptance criteria:**

- [ ] Read/write paths sized separately
- [ ] Cache miss storm capacity reserved
- [ ] Cost line-item rough order

### Problem 2 — `intermediate`

**Prompt:** Given CPU-bound vs IO-bound profiles, choose vertical vs horizontal scale first. Document decision criteria.

**Hint:** [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Bottleneck Finding CPU Memory Disk Network|Bottleneck Finding CPU Memory Disk Network]].

**Acceptance criteria:**

- [ ] Decision tree with metrics signals
- [ ] When scale-out fails (serialization points)
- [ ] Trade-off table

### Problem 3 — `advanced`

**Prompt:** Optimize cost for a batch analytics job vs online API sharing a fleet. Propose isolation so online p99 is protected.

**Hint:** [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Cost Performance and Capacity Trade-offs|Cost Performance and Capacity Trade-offs]].

**Acceptance criteria:**

- [ ] Isolation mechanism (pools, queues, priority)
- [ ] Cost vs SLO trade-off quantified roughly
- [ ] Failure mode if batch bleeds into online

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Traffic spikes 5× for 10 minutes. Which bottleneck hits first in your earlier catalog design? How do you shed load without cascading?

**Acceptance criteria:**

- [ ] First bottleneck named with evidence
- [ ] Admission control / degradation path
- [ ] Recovery criteria after spike

### Problem 2 — `advanced`

**Prompt:** Disk bandwidth saturates while CPU is idle. Design a diagnosis playbook that avoids "add more app servers."

**Acceptance criteria:**

- [ ] Metric chain: app → network → storage
- [ ] Wrong remediation called out
- [ ] Correct remediation options (shard, cache, compress, slower path)

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Finance asks to cut infra 30%. Produce a capacity negotiation brief that preserves p99 SLOs and names which features lose headroom.

**Acceptance criteria:**

- [ ] Headroom vs SLO risk matrix
- [ ] Non-negotiable vs deferrable capacity
- [ ] Rollback if error budget burns

### Problem 2 — `advanced`

**Prompt:** Use [[09-System-Design/projects/Capacity Estimator Lab/README|Capacity Estimator Lab]] (or equivalent) to encode one product estimate as a reproducible artifact reviewed in design meetings.

**Acceptance criteria:**

- [ ] Inputs versioned; outputs reproducible
- [ ] Sensitivity analysis on peak factor
- [ ] Linked from an ADR

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Estimation | Round numbers only | Units, peaks, retention, sensitivity |
| Latency | Average focus | Percentile budgets and composition |
| Bottlenecks | "Scale more" | Resource-specific diagnosis and trade-offs |

## Related Notes

- [[09-System-Design/_interview/01-Capacity-Latency-and-Bottlenecks|Capacity Interview]]
- [[09-System-Design/projects/Capacity Estimator Lab/README|Capacity Estimator Lab]]
- [[09-System-Design/README|System Design]]
- [[Career/README|Career]]
