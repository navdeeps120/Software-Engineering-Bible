---
title: Capacity Latency and Bottlenecks Interview
aliases: [01 Capacity Interview]
track: 09-System-Design
topic: capacity-latency-and-bottlenecks-interview
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Back-of-Envelope Capacity Estimation|Back-of-Envelope Capacity Estimation]]"]
tags: [interviews, system-design, capacity, latency]
created: 2026-07-23
updated: 2026-07-23
---

# Capacity Latency and Bottlenecks Interview

## Linked Topic

- [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Back-of-Envelope Capacity Estimation|Back-of-Envelope Capacity Estimation]]
- [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Latency Budgets Percentiles and Tail Behavior|Latency Budgets Percentiles and Tail Behavior]]
- [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Throughput Queuing and Littles Law Intuition|Throughput Queuing and Littles Law Intuition]]
- [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Bottleneck Finding CPU Memory Disk Network|Bottleneck Finding CPU Memory Disk Network]]
- [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Cost Performance and Capacity Trade-offs|Cost Performance and Capacity Trade-offs]]

## How to Practice

1. Always state assumptions and units.
2. Prefer percentiles over averages for latency.
3. Name the bottleneck resource before scaling advice.
4. End with cost/headroom trade-off.

## Junior

1. Estimate storage for 1M users × 10 photos × 500 KB. Show work.

   - **Strong:** Units, total bytes→TB, retention assumption
   - **Weak:** Guess without arithmetic

2. Why is average latency misleading for SLOs?

   - **Strong:** Tail users; p95/p99; composition across hops
   - **Weak:** "Averages are fine"

3. Define QPS vs concurrent users.

   - **Strong:** Rate vs in-flight; Little's Law bridge
   - **Weak:** Used interchangeably

## Mid

4. Allocate a 200 ms p99 budget across CDN, API, cache, DB.

   - **Strong:** Table with miss-path contingency
   - **Weak:** Equal split without rationale

5. Apply Little's Law: 5k RPS, 40 ms mean latency—what concurrency?

   - **Strong:** L = λW = 200; pool sizing implication
   - **Weak:** Formula memorized, no ops meaning

6. How do you find whether you are CPU-, memory-, disk-, or network-bound?

   - **Strong:** Metric signatures + wrong remediation each
   - **Weak:** "Check htop"

7. Traffic is 3× average at peak. How does that change capacity?

   - **Strong:** Peak factor in estimates; headroom; queueing near saturation
   - **Weak:** Size to average

## Senior

8. Cache hit rate drops 95%→80% at 100k RPS. What happens to origin?

   - **Strong:** Origin QPS 5k→20k; capacity cliff; stampede risk
   - **Weak:** "DB gets slower"

9. Batch jobs steal capacity from online APIs. How do you protect p99?

   - **Strong:** Isolation, priority, pools; cost trade-off
   - **Weak:** "Run batch at night" only

## Staff

10. Finance cuts infra 25%. Negotiate without burning error budget.

    - **Strong:** Headroom vs SLO matrix; deferrable capacity; rollback triggers
    - **Weak:** Accept cut blindly or refuse all cuts

11. Design a capacity review ritual for releases.

    - **Strong:** Estimator artifact, sensitivity, bottleneck owners
    - **Weak:** "Load test sometimes"

12. When is vertical scaling the wrong first move?

    - **Strong:** Serialization points, stateful sticky limits, single-AZ risk
    - **Weak:** Always horizontal

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Numbers | Vague | Units, peaks, sensitivity |
| Latency | Means | Percentile budgets |
| Bottlenecks | Scale more | Resource-specific |

## Related Notes

- [[09-System-Design/_exercises/01-Capacity-Latency-and-Bottlenecks|Capacity Exercises]]
- [[09-System-Design/projects/Capacity Estimator Lab/README|Capacity Estimator Lab]]
- [[Career/README|Career]]
