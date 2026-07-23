---
title: Performance Tuning and Kernel Knobs Exercises
aliases: [10 Performance Tuning Exercises]
track: 10-Linux
topic: performance-tuning-and-kernel-knobs-exercises
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/_exercises/08-Observability-Tracing-and-Profiling|Observability Tracing and Profiling Exercises]]"]
tags: [exercises, linux, performance, sysctl, thp, saturation]
created: 2026-07-23
updated: 2026-07-23
---

# Performance Tuning and Kernel Knobs Exercises

Diagnose CPU steal and run queue, apply disk/net saturation playbooks, change sysctl with documentation discipline, avoid THP/allocator footguns, and demand capacity signals before buying hardware.

## Linked Topic

- [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/CPU Saturation Steal and Run Queue|CPU Saturation Steal and Run Queue]]
- [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/Disk and Network Saturation Playbooks|Disk and Network Saturation Playbooks]]
- [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/sysctl Trade-offs Documentation Discipline|sysctl Trade-offs Documentation Discipline]]
- [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/Transparent Huge Pages and Allocator Footguns|Transparent Huge Pages and Allocator Footguns]]
- [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/Capacity Signals Before Buying Hardware|Capacity Signals Before Buying Hardware]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Define run queue length, CPU utilization, iowait, and steal time. What does high steal imply on a hypervisor?

**Hint:** [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/CPU Saturation Steal and Run Queue|CPU Saturation Steal and Run Queue]].

**Acceptance criteria:**

- [ ] Each metric with ops meaning
- [ ] Steal → noisy neighbor / oversubscribe hypothesis
- [ ] Utilization alone insufficient

### Problem 2 — `intermediate`

**Prompt:** Outline disk and network saturation playbooks: first metrics, common misreads, first safe mitigations.

**Hint:** [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/Disk and Network Saturation Playbooks|Disk and Network Saturation Playbooks]].

**Acceptance criteria:**

- [ ] Disk and net sections
- [ ] Latency vs throughput distinction
- [ ] When to stop tuning and fix architecture

### Problem 3 — `intermediate`

**Prompt:** Why is undocumented `sysctl -w` in prod a liability? What belongs in an ADR for a knob change?

**Acceptance criteria:**

- [ ] Link to [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/sysctl Trade-offs Documentation Discipline|sysctl Trade-offs Documentation Discipline]]
- [ ] Persistence, rollback, measurement
- [ ] Blast radius of network/vm knobs

## Observe

### Problem 1 — `beginner`

**Prompt:** Capture `vmstat`/`mpstat`/`uptime` under load. Interpret run queue vs CPU count.

**Acceptance criteria:**

- [ ] Ratio to nCPU computed
- [ ] Steal noted if present
- [ ] Hypothesis written

### Problem 2 — `intermediate`

**Prompt:** Observe THP settings and any compact/stall symptoms relevant to databases or allocators. Record current mode.

**Hint:** [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/Transparent Huge Pages and Allocator Footguns|Transparent Huge Pages and Allocator Footguns]].

**Acceptance criteria:**

- [ ] Current THP policy captured
- [ ] Workload-specific risk noted
- [ ] Change requires measurement plan

### Problem 3 — `advanced`

**Prompt:** Before/after experiment: one sysctl change in lab with explicit metric success criteria and rollback.

**Acceptance criteria:**

- [ ] Hypothesis and metric
- [ ] Result accepted or reverted
- [ ] ADR stub completed

## Model

### Problem 1 — `beginner`

**Prompt:** Model capacity: show you need more CPU vs better code vs less steal. Decision table from signals.

**Hint:** [[10-Linux/10-Performance-Tuning-and-Kernel-Knobs/Capacity Signals Before Buying Hardware|Capacity Signals Before Buying Hardware]].

**Acceptance criteria:**

- [ ] Buy hardware is last after evidence
- [ ] Alternative remediations listed
- [ ] Cost/perf trade-off

### Problem 2 — `intermediate`

**Prompt:** Model TCP backlog / somaxconn / app accept loop relationship for connection spikes.

**Acceptance criteria:**

- [ ] Knob ↔ app behavior linked
- [ ] Oversizing risks
- [ ] Observability for drops/overflows

### Problem 3 — `advanced`

**Prompt:** Model a tuning freeze: only allow knobs with owners, dashboards, and expiry. Design the governance.

**Acceptance criteria:**

- [ ] Registry of knobs
- [ ] Review cadence
- [ ] Emergency exception path

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Someone sets `vm.swappiness=0` and `panic` knobs "from a blog." Incident after reboot. Response and prevention.

**Acceptance criteria:**

- [ ] Identify change source
- [ ] Revert to known good
- [ ] Blog-driven-ops anti-pattern named

### Problem 2 — `advanced`

**Prompt:** THP causes latency spikes for a latency-critical service. Argue disable vs madvise vs app fix with evidence plan.

**Acceptance criteria:**

- [ ] Measurement design
- [ ] Scoped change (service vs host)
- [ ] Residual risk

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write a performance incident runbook: classify CPU/mem/disk/net, collect evidence, safe mitigations, escalate.

**Acceptance criteria:**

- [ ] Classification tree
- [ ] No blind sysctl
- [ ] Time-box before hardware ask

### Problem 2 — `advanced`

**Prompt:** Quarterly capacity review ritual using host signals. Template for "do not buy yet" vs "buy."

**Acceptance criteria:**

- [ ] Required charts/signals
- [ ] Sensitivity to peak factors
- [ ] Link to System Design capacity when multi-host

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Saturation | High CPU = need bigger box | Queue, steal, latency, workload |
| sysctl | Blog copy | ADR, measure, persist, rollback |
| Hardware | Buy first | Signals prove need |

## Related Notes

- [[10-Linux/_interview/10-Performance-Tuning-and-Kernel-Knobs|Performance Tuning Interview]]
- [[10-Linux/README|Linux]]
- [[Career/README|Career]]
