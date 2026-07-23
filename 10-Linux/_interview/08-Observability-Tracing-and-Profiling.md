---
title: Observability Tracing and Profiling Interview
aliases: [08 Observability Interview]
track: 10-Linux
topic: observability-tracing-and-profiling-interview
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/08-Observability-Tracing-and-Profiling/Metrics from procfs and sysfs|Metrics from procfs and sysfs]]"]
tags: [interviews, linux, observability, strace, perf, ebpf]
created: 2026-07-23
updated: 2026-07-23
---

# Observability Tracing and Profiling Interview

## Linked Topic

- [[10-Linux/08-Observability-Tracing-and-Profiling/Metrics from procfs and sysfs|Metrics from procfs and sysfs]]
- [[10-Linux/08-Observability-Tracing-and-Profiling/strace and lsof First-Aid Tracing|strace and lsof First-Aid Tracing]]
- [[10-Linux/08-Observability-Tracing-and-Profiling/perf CPU Profiles and Flame Graph Intuition|perf CPU Profiles and Flame Graph Intuition]]
- [[10-Linux/08-Observability-Tracing-and-Profiling/eBPF Intro for Operators|eBPF Intro for Operators]]
- [[10-Linux/08-Observability-Tracing-and-Profiling/Logging Correlation on a Single Host|Logging Correlation on a Single Host]]

## How to Practice

1. Metrics and scoped observation before continuous tracing.
2. Time-box `strace`/`perf`; state overhead.
3. Read flame graphs as hot paths, not decoration.
4. Correlate journal + app IDs with clock caveats.

## Junior

1. Name four host signals you can get from procfs/sysfs.

   - **Strong:** Load/CPU, meminfo, disk stats, net/dev or similar with paths
   - **Weak:** Only "use Datadog"

2. When is `strace` the wrong tool?

   - **Strong:** Hot path latency, long attach, need sampling profile instead
   - **Weak:** Always first tool

3. What does a wide flame frame suggest?

   - **Strong:** More on-CPU time in that stack
   - **Weak:** "Important function" without time meaning

## Mid

4. Deleted file still consuming disk—how find and fix?

   - **Strong:** `lsof` deleted; restart/reopen process; then unlink space frees
   - **Weak:** Only `du` confusion

5. On-CPU vs IO-wait latency—how choose tools?

   - **Strong:** Profile vs iostat/wchan; CPU flame won't fix disk
   - **Weak:** One tool for all

6. eBPF for operators—promise and caution?

   - **Strong:** Low-overhead visibility; privilege, verifier, safety
   - **Weak:** Disable security to run anything

7. Correlate a request across journal and app log on one host?

   - **Strong:** Shared request ID / unit / PID / time window
   - **Weak:** Grep only ERROR

## Senior

8. Production attach policy for tracers/profilers?

   - **Strong:** Approval, duration, filters, auto-kill, prefer metrics
   - **Weak:** SSH and attach freely

9. Decision tree for high latency on a box—outline.

   - **Strong:** CPU/mem/disk/net branches with tools and time-boxes
   - **Weak:** Restart service

## Staff

10. Golden signals export cardinality rules for a fleet?

    - **Strong:** Stable labels; avoid per-PID explosion; owners
    - **Weak:** Unlimited labels

11. How do host tools hand off to distributed tracing?

    - **Strong:** Single-host correlation → System Design multi-service traces
    - **Weak:** Replace Jaeger with strace

12. Staff incident: overnight strace left attached—controls?

    - **Strong:** Detect tracers, policy, automation, culture
    - **Weak:** Blame only

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Order | Trace first | Metrics → scoped |
| Profiles | Pretty | Actionable next step |
| Policy | Ad hoc | Time-box + approval |

## Related Notes

- [[10-Linux/_exercises/08-Observability-Tracing-and-Profiling|Observability Exercises]]
- [[10-Linux/projects/Observability First-Aid Kit/README|Observability First-Aid Kit]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
