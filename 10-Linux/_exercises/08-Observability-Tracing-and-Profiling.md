---
title: Observability Tracing and Profiling Exercises
aliases: [08 Observability Exercises]
track: 10-Linux
topic: observability-tracing-and-profiling-exercises
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/_exercises/07-Cgroups-Namespaces-and-Isolation|Cgroups Namespaces and Isolation Exercises]]"]
tags: [exercises, linux, observability, strace, perf, ebpf, procfs]
created: 2026-07-23
updated: 2026-07-23
---

# Observability Tracing and Profiling Exercises

Read host metrics from procfs/sysfs, apply strace/lsof first aid, interpret perf flame graphs, use eBPF intro tooling safely, and correlate logs on one box.

## Linked Topic

- [[10-Linux/08-Observability-Tracing-and-Profiling/Metrics from procfs and sysfs|Metrics from procfs and sysfs]]
- [[10-Linux/08-Observability-Tracing-and-Profiling/strace and lsof First-Aid Tracing|strace and lsof First-Aid Tracing]]
- [[10-Linux/08-Observability-Tracing-and-Profiling/perf CPU Profiles and Flame Graph Intuition|perf CPU Profiles and Flame Graph Intuition]]
- [[10-Linux/08-Observability-Tracing-and-Profiling/eBPF Intro for Operators|eBPF Intro for Operators]]
- [[10-Linux/08-Observability-Tracing-and-Profiling/Logging Correlation on a Single Host|Logging Correlation on a Single Host]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** List five golden host signals you can derive from `/proc` and `/sys` without a vendor agent. Map each to a failure class.

**Hint:** [[10-Linux/08-Observability-Tracing-and-Profiling/Metrics from procfs and sysfs|Metrics from procfs and sysfs]].

**Acceptance criteria:**

- [ ] CPU, mem, disk, net, pressure-like signals
- [ ] Source path named per signal
- [ ] Distinguishes counters vs gauges

### Problem 2 — `intermediate`

**Prompt:** When is `strace` appropriate vs harmful? What does attach cost do to a latency-sensitive process?

**Hint:** [[10-Linux/08-Observability-Tracing-and-Profiling/strace and lsof First-Aid Tracing|strace and lsof First-Aid Tracing]].

**Acceptance criteria:**

- [ ] Time-boxed, filtered usage
- [ ] Production caution stated
- [ ] `lsof`/`ss` often first alternatives

### Problem 3 — `intermediate`

**Prompt:** Explain sampling profilers vs tracing: how to read a flame graph (wide = hot). What is on-CPU vs off-CPU profiling intuition?

**Acceptance criteria:**

- [ ] Link to [[10-Linux/08-Observability-Tracing-and-Profiling/perf CPU Profiles and Flame Graph Intuition|perf CPU Profiles and Flame Graph Intuition]]
- [ ] Misread pitfalls (inlined frames, missing symbols)
- [ ] When CPU profile will not explain IO wait

## Observe

### Problem 1 — `beginner`

**Prompt:** Build a one-host snapshot script/checklist: load, meminfo highlights, disk latency, socket counts, top PIDs. Run twice 60s apart.

**Acceptance criteria:**

- [ ] Diffable artifacts
- [ ] Tools listed
- [ ] No secrets in output

### Problem 2 — `intermediate`

**Prompt:** Use `lsof`/`ss` to find who holds a port or deleted-but-open log file filling disk.

**Acceptance criteria:**

- [ ] Deleted file size accounted
- [ ] Process identified
- [ ] Safe remediation (rotate/reopen) proposed

### Problem 3 — `advanced`

**Prompt:** Capture a short `perf` top/record on a hot process (lab). Interpret top stacks; note symbol quality.

**Acceptance criteria:**

- [ ] Hot functions hypothesized
- [ ] Privilege and overhead noted
- [ ] Optional: eBPF tool compared for lower overhead ([[10-Linux/08-Observability-Tracing-and-Profiling/eBPF Intro for Operators|eBPF Intro]])

## Model

### Problem 1 — `beginner`

**Prompt:** Model an observability budget: max continuous strace time, max capture size, who can run perf. Write policy.

**Acceptance criteria:**

- [ ] Risk vs value trade-offs
- [ ] Approval for production attach
- [ ] Prefer metrics first

### Problem 2 — `intermediate`

**Prompt:** Design host log correlation: systemd journal fields + app request IDs. Show how to join during an incident.

**Hint:** [[10-Linux/08-Observability-Tracing-and-Profiling/Logging Correlation on a Single Host|Logging Correlation on a Single Host]].

**Acceptance criteria:**

- [ ] Correlation keys defined
- [ ] Clock skew caveat
- [ ] Handoff to multi-service tracing → [[09-System-Design/README|System Design]]

### Problem 3 — `advanced`

**Prompt:** Model a first-aid decision tree: latency high → on-CPU vs IO vs lock vs net. Attach tools per branch.

**Acceptance criteria:**

- [ ] Mermaid decision tree
- [ ] Time-boxes per branch
- [ ] Stop criteria when to escalate to app APM

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Engineer leaves `strace -p` attached overnight. Impact and prevention controls.

**Acceptance criteria:**

- [ ] Performance blast radius
- [ ] Detection (unexpected tracers)
- [ ] Policy/automation kill-switch

### Problem 2 — `advanced`

**Prompt:** eBPF program / probe causes verifier or load issues; team wants "disable security." Write a safety response.

**Acceptance criteria:**

- [ ] Least privilege for BPF
- [ ] Rollout and rollback
- [ ] Link to Security track for deeper policy

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Assemble an Observability First-Aid Kit card: 10 commands with why/when/danger.

**Acceptance criteria:**

- [ ] Ten entries
- [ ] Danger column filled
- [ ] Aligns with [[10-Linux/projects/Observability First-Aid Kit/README|Observability First-Aid Kit]]

### Problem 2 — `advanced`

**Prompt:** Standardize host golden signals export (node exporter or equivalent). Cardinality and label rules for a fleet.

**Acceptance criteria:**

- [ ] Signal list
- [ ] High-cardinality anti-patterns
- [ ] Ownership of dashboards/alerts

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Tooling | Trace first | Metrics → scoped attach |
| Profiles | Pretty flames | Actionable hot path + next experiment |
| Correlation | Grep randomly | Keys, time, journal fields |

## Related Notes

- [[10-Linux/_interview/08-Observability-Tracing-and-Profiling|Observability Interview]]
- [[10-Linux/projects/Observability First-Aid Kit/README|Observability First-Aid Kit]]
- [[10-Linux/README|Linux]]
- [[Career/README|Career]]
