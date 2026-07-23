---
title: Performance Tuning and Kernel Knobs Interview
aliases: [10 Performance Tuning Interview]
track: 10-Linux
topic: performance-tuning-and-kernel-knobs-interview
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/CPU Saturation Steal and Run Queue|CPU Saturation Steal and Run Queue]]"]
tags: [interviews, linux, performance, sysctl, saturation]
created: 2026-07-23
updated: 2026-07-23
---

# Performance Tuning and Kernel Knobs Interview

## Linked Topic

- [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/CPU Saturation Steal and Run Queue|CPU Saturation Steal and Run Queue]]
- [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/Disk and Network Saturation Playbooks|Disk and Network Saturation Playbooks]]
- [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/sysctl Trade-offs Documentation Discipline|sysctl Trade-offs Documentation Discipline]]
- [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/Transparent Huge Pages and Allocator Footguns|Transparent Huge Pages and Allocator Footguns]]
- [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/Capacity Signals Before Buying Hardware|Capacity Signals Before Buying Hardware]]

## How to Practice

1. Name the saturated resource before tuning.
2. Steal and run queue beat "CPU is 70%."
3. Every sysctl answer needs measure/persist/rollback.
4. Buying hardware is last after signals.

## Junior

1. What is CPU steal time?

   - **Strong:** Hypervisor scheduled elsewhere; oversubscribe/noisy neighbor
   - **Weak:** "Stolen by malware"

2. Run queue length 40 on 4 CPUs—interpretation?

   - **Strong:** Severe saturation; latency pain likely
   - **Weak:** "Kinda busy"

3. Why not apply random sysctls from a blog?

   - **Strong:** Workload mismatch, persistence, blast radius
   - **Weak:** Blogs are fine

## Mid

4. Disk saturation playbook—first three checks?

   - **Strong:** Latency, who/what IO, queue; not only %util
   - **Weak:** Buy bigger disk immediately

5. THP risk for latency-sensitive services?

   - **Strong:** Compaction/stalls; measure; scoped disable
   - **Weak:** Always on everywhere

6. What belongs in a sysctl ADR?

   - **Strong:** Hypothesis, metric, persist path, rollback, owner
   - **Weak:** Value only

7. Connection spike drops—somaxconn vs app accept loop?

   - **Strong:** Both layers; observe overflows; don't only raise knobs
   - **Weak:** Max all sysctls

## Senior

8. Prove you need a larger instance type vs fix the app.

   - **Strong:** Capacity signals, peaks, steal, profiles, cost
   - **Weak:** "Feels slow"

9. Blog set `swappiness=0` and weird panic knobs—response?

   - **Strong:** Revert known good, find change source, governance
   - **Weak:** Tune further

## Staff

10. Tuning freeze governance for a fleet?

    - **Strong:** Registry, owners, expiry, emergency path
    - **Weak:** Ban all changes forever

11. Quarterly capacity review—required host signals?

    - **Strong:** Saturation, latency, peaks, headroom; buy criteria
    - **Weak:** Average CPU only

12. When escalate performance from Linux to System Design?

    - **Strong:** Multi-host bottlenecks, fan-out, caching topology
    - **Weak:** Never leave the box

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Saturation | High CPU | Queue/steal/latency |
| Knobs | Blog copy | ADR + measure |
| Hardware | Buy first | Evidence last |

## Related Notes

- [[10-Linux/_exercises/10-Performance-Tuning-and-Kernel-Knobs|Performance Tuning Exercises]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
