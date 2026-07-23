---
title: Memory Swap and OOM Exercises
aliases: [03 Memory OOM Exercises]
track: 10-Linux
topic: memory-swap-and-oom-exercises
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/_exercises/02-Processes-Signals-and-Job-Control|Processes Signals and Job Control Exercises]]"]
tags: [exercises, linux, memory, swap, oom, page-cache]
created: 2026-07-23
updated: 2026-07-23
---

# Memory Swap and OOM Exercises

Interpret RSS/VSZ and page cache, recognize swap thrashing, reason about OOM killer policy, and apply NUMA basics for operators.

## Linked Topic

- [[10-Linux/03-Memory-Swap-and-OOM/Virtual Memory Ops RSS vs VSZ|Virtual Memory Ops RSS vs VSZ]]
- [[10-Linux/03-Memory-Swap-and-OOM/Page Cache Dirty Writeback and Drop Caches Myths|Page Cache Dirty Writeback and Drop Caches Myths]]
- [[10-Linux/03-Memory-Swap-and-OOM/Swap Pressure and thrashing Symptoms|Swap Pressure and thrashing Symptoms]]
- [[10-Linux/03-Memory-Swap-and-OOM/OOM Killer Scores and Policy|OOM Killer Scores and Policy]]
- [[10-Linux/03-Memory-Swap-and-OOM/NUMA Basics for Host Operators|NUMA Basics for Host Operators]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Define VSZ, RSS, PSS (if available), and why "free memory is wasted memory" is both true and dangerous as an ops slogan.

**Hint:** [[10-Linux/03-Memory-Swap-and-OOM/Virtual Memory Ops RSS vs VSZ|Virtual Memory Ops RSS vs VSZ]].

**Acceptance criteria:**

- [ ] Metrics defined with units
- [ ] Shared libraries / page cache caveats
- [ ] Handoff VM theory → [[01-Computer-Science/03-Memory-and-Addressing/Virtual Memory|Virtual Memory]]

### Problem 2 — `intermediate`

**Prompt:** Explain page cache, dirty pages, and writeback. Why is `echo 3 > drop_caches` usually the wrong first fix?

**Hint:** [[10-Linux/03-Memory-Swap-and-OOM/Page Cache Dirty Writeback and Drop Caches Myths|Page Cache Dirty Writeback and Drop Caches Myths]].

**Acceptance criteria:**

- [ ] Cache reclaim is normal under pressure
- [ ] Drop caches costs and when (rarely) justified
- [ ] Dirty ratio pressure symptoms named

### Problem 3 — `intermediate`

**Prompt:** Describe OOM killer scoring at operator level: what raises score, what `oom_score_adj` does, and fail-closed vs kill-victim trade-offs.

**Acceptance criteria:**

- [ ] Link to [[10-Linux/03-Memory-Swap-and-OOM/OOM Killer Scores and Policy|OOM Killer Scores and Policy]]
- [ ] Protecting PID 1 / critical agents discussed
- [ ] Preference for cgroup limits where possible

## Observe

### Problem 1 — `beginner`

**Prompt:** Snapshot `free -h` / `/proc/meminfo` and top RSS consumers. Interpret available vs free.

**Acceptance criteria:**

- [ ] Available explained correctly
- [ ] Top consumers listed with RSS
- [ ] Page cache size noted without panic

### Problem 2 — `intermediate`

**Prompt:** Observe swap: `si`/`so` or `/proc/vmstat` trends under a lab memory hog. Correlate latency with thrashing.

**Hint:** [[10-Linux/03-Memory-Swap-and-OOM/Swap Pressure and thrashing Symptoms|Swap Pressure and thrashing Symptoms]].

**Acceptance criteria:**

- [ ] Thrashing symptoms ≠ "swap enabled is bad" slogan
- [ ] Time series or before/after captured
- [ ] Distinguishes swap presence vs swap storm

### Problem 3 — `advanced`

**Prompt:** On a NUMA host/fixture, observe node locality (`numastat` or equivalent). Hypothesize remote memory penalty for a large allocator.

**Acceptance criteria:**

- [ ] Per-node free/used noted
- [ ] Link to [[10-Linux/03-Memory-Swap-and-OOM/NUMA Basics for Host Operators|NUMA Basics for Host Operators]]
- [ ] When NUMA matters vs ignore

## Model

### Problem 1 — `beginner`

**Prompt:** Size host memory for an API: heap working set 4 GiB, page cache desire, OS headroom, peak factor. Show budget table.

**Acceptance criteria:**

- [ ] Working set ≠ VSZ
- [ ] Headroom for spikes and page cache
- [ ] Alert thresholds proposed

### Problem 2 — `intermediate`

**Prompt:** Model OOM policy for co-located API + batch: who dies first under pressure? Express with `oom_score_adj` and/or cgroup memory max.

**Acceptance criteria:**

- [ ] Victim preference justified by product impact
- [ ] Prefer cgroup isolation over global OOM gambling
- [ ] Forward link to cgroups module

### Problem 3 — `advanced`

**Prompt:** Model writeback storm: large sequential write dirtying cache. Predict latency impact on readers and mitigations (throttle, separate disks, ionice/cgroup io).

**Acceptance criteria:**

- [ ] Dirty/writeback mechanism tied to symptom
- [ ] At least two mitigations with trade-offs
- [ ] Observability signals listed

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Host OOMs the database process nightly. Write triage: leak vs undersize vs noisy neighbor vs fork bomb.

**Acceptance criteria:**

- [ ] Decision tree with evidence
- [ ] Journal/OOM kill lines as artifacts
- [ ] Temporary mitigation vs durable fix

### Problem 2 — `advanced`

**Prompt:** Disable swap to "fix latency," then OOM kills spike. Argue when swap helps vs hurts and what to measure.

**Acceptance criteria:**

- [ ] Not a binary ideology
- [ ] Workload-dependent recommendation
- [ ] ADR-quality trade-off writeup

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Create a memory incident runbook: golden signals, first ten minutes, capture list before reboot.

**Acceptance criteria:**

- [ ] Ordered steps
- [ ] Artifacts: meminfo, smaps_rollup sample, OOM logs
- [ ] When to reboot vs not

### Problem 2 — `advanced`

**Prompt:** Fleet standard: memory alerts on `MemAvailable` and cgroup `memory.current`/`memory.max`. Design thresholds and false-positive controls.

**Acceptance criteria:**

- [ ] Host vs container signal split
- [ ] Page cache aware alerting
- [ ] Escalation to [[09-System-Design/README|System Design]] for multi-host capacity

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Metrics | Free is low → panic | Available, RSS, cache, pressure |
| OOM | Random kill | Policy, scores, cgroup preference |
| Swap | Always on/off | Thrashing evidence and workload fit |

## Related Notes

- [[10-Linux/_interview/03-Memory-Swap-and-OOM|Memory OOM Interview]]
- [[10-Linux/README|Linux]]
- [[Career/README|Career]]
