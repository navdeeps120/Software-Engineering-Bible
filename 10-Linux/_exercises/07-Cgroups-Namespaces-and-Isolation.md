---
title: Cgroups Namespaces and Isolation Exercises
aliases: [07 Cgroups Namespaces Exercises]
track: 10-Linux
topic: cgroups-namespaces-and-isolation-exercises
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/_exercises/03-Memory-Swap-and-OOM|Memory Swap and OOM Exercises]]"]
tags: [exercises, linux, cgroups, namespaces, isolation, containers-handoff]
created: 2026-07-23
updated: 2026-07-23
---

# Cgroups Namespaces and Isolation Exercises

Budget CPU/memory/IO with cgroup v2, understand namespace isolation boundaries, contain noisy neighbors, reason about user namespaces/capabilities, and hand off cleanly to containers.

## Linked Topic

- [[10-Linux/07-Cgroups-Namespaces-and-Isolation/cgroup v2 Controllers CPU Memory IO|cgroup v2 Controllers CPU Memory IO]]
- [[10-Linux/07-Cgroups-Namespaces-and-Isolation/Namespaces Types and Isolation Boundaries|Namespaces Types and Isolation Boundaries]]
- [[10-Linux/07-Cgroups-Namespaces-and-Isolation/Resource Budgets and Noisy Neighbor Containment|Resource Budgets and Noisy Neighbor Containment]]
- [[10-Linux/07-Cgroups-Namespaces-and-Isolation/User Namespaces Capabilities and Privilege Drops|User Namespaces Capabilities and Privilege Drops]]
- [[10-Linux/07-Cgroups-Namespaces-and-Isolation/From Host Primitives to Containers Handoff|From Host Primitives to Containers Handoff]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Explain what cgroups do vs what namespaces do. Give one failure that each cannot prevent.

**Hint:** Start from [[10-Linux/07-Cgroups-Namespaces-and-Isolation/cgroup v2 Controllers CPU Memory IO|cgroup v2 Controllers CPU Memory IO]] and [[10-Linux/07-Cgroups-Namespaces-and-Isolation/Namespaces Types and Isolation Boundaries|Namespaces Types and Isolation Boundaries]].

**Acceptance criteria:**

- [ ] Resource vs isolation identity clear
- [ ] Counterexamples for conflating them
- [ ] Containers = composition, not magic

### Problem 2 — `intermediate`

**Prompt:** Name major namespace types (pid, mnt, net, uts, ipc, user, time if relevant) and what an operator sees differently inside each.

**Acceptance criteria:**

- [ ] Table: namespace → isolated view
- [ ] PID 1 inside a pid namespace explained
- [ ] Host tooling caveats (`ps` from host vs inside)

### Problem 3 — `intermediate`

**Prompt:** Describe cgroup v2 memory.max / cpu.max / io.weight (or max) at operator level. What happens on memory.max breach?

**Acceptance criteria:**

- [ ] OOM in cgroup vs host OOM
- [ ] CPU throttle symptoms
- [ ] Link to [[10-Linux/07-Cgroups-Namespaces-and-Isolation/Resource Budgets and Noisy Neighbor Containment|Resource Budgets and Noisy Neighbor Containment]]

## Observe

### Problem 1 — `beginner`

**Prompt:** Locate the cgroup of a process via `/proc/<pid>/cgroup` and inspect controller files (lab or fixture).

**Acceptance criteria:**

- [ ] Path recorded
- [ ] Current usage vs limits if set
- [ ] systemd slice/scope relationship noted when present

### Problem 2 — `intermediate`

**Prompt:** Observe noisy neighbor: unrestricted batch vs API. Measure latency before/after applying CPU/memory limits.

**Acceptance criteria:**

- [ ] Before/after metrics
- [ ] Limit values justified
- [ ] Side effects (batch slowdown) accepted explicitly

### Problem 3 — `advanced`

**Prompt:** Compare capability set of a rootful vs user-namespaced process (`capsh`/`/proc/<pid>/status`). Interpret privilege drop.

**Hint:** [[10-Linux/07-Cgroups-Namespaces-and-Isolation/User Namespaces Capabilities and Privilege Drops|User Namespaces Capabilities and Privilege Drops]].

**Acceptance criteria:**

- [ ] Cap sets compared
- [ ] "root inside container ≠ host root" stated correctly
- [ ] Residual risk examples

## Model

### Problem 1 — `beginner`

**Prompt:** Budget a host: 8 cores, 32 GiB RAM for API / batch / system. Propose cgroup limits and reserved system slice.

**Acceptance criteria:**

- [ ] Budgets sum with system headroom
- [ ] Overcommit policy explicit
- [ ] Monitoring on throttle/OOM

### Problem 2 — `intermediate`

**Prompt:** Model isolation for untrusted plugin code: which namespaces and which cgroup limits are mandatory minimums?

**Acceptance criteria:**

- [ ] Minimum set listed
- [ ] What remains shared (kernel)
- [ ] Handoff to [[14-Docker/README|Docker]] for image packaging

### Problem 3 — `advanced`

**Prompt:** Draft ADR: enforce budgets via systemd slices vs container runtime only. Consequences for bare processes and SSH sessions.

**Acceptance criteria:**

- [ ] Context and decision
- [ ] Rejected alternatives
- [ ] Drift risk named

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** memory.max too low causes repeated cgroup OOMs. App team wants unlimited. Negotiate with data.

**Acceptance criteria:**

- [ ] Evidence of working set
- [ ] Temporary raise with expiry
- [ ] Leak vs undersize decision tree

### Problem 2 — `advanced`

**Prompt:** Namespace confusion: operator kills wrong PID viewing from inside container. Write a safety briefing for host vs guest tooling.

**Acceptance criteria:**

- [ ] PID mapping hazard
- [ ] Recommended host-side triage
- [ ] Link to [[10-Linux/07-Cgroups-Namespaces-and-Isolation/From Host Primitives to Containers Handoff|From Host Primitives to Containers Handoff]]

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Create a noisy-neighbor runbook: detect throttle/OOM, attribute to cgroup, remediate, prevent.

**Acceptance criteria:**

- [ ] Signals from cpu.stat / memory.events
- [ ] Remediation options ordered
- [ ] Product impact communication

### Problem 2 — `advanced`

**Prompt:** Org standard: every production workload in a budgeted slice. Design rollout across systemd services and container runtimes.

**Acceptance criteria:**

- [ ] Unified budget language
- [ ] Dual-path enforcement
- [ ] Escalation to K8s resource specs → [[15-Kubernetes/README|Kubernetes]]

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Concepts | "Docker isolation" | Namespaces ≠ cgroups |
| Budgets | Guess limits | Working set + headroom + system reserve |
| Safety | Host/guest mixups | Explicit PID/tooling context |

## Related Notes

- [[10-Linux/_interview/07-Cgroups-Namespaces-and-Isolation|Cgroups Namespaces Interview]]
- [[10-Linux/projects/Cgroup Budget Clinic/README|Cgroup Budget Clinic]]
- [[10-Linux/README|Linux]]
- [[Career/README|Career]]
