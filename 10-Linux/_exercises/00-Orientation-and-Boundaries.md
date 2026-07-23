---
title: Orientation and Boundaries Exercises
aliases: [00 Orientation Exercises]
track: 10-Linux
topic: orientation-and-boundaries-exercises
difficulty: beginner
status: active
prerequisites: ["[[10-Linux/README|Linux]]"]
tags: [exercises, linux, orientation, adr, failure-domains]
created: 2026-07-23
updated: 2026-07-23
---

# Orientation and Boundaries Exercises

Separate Linux host operations from CS models and container platforms, map single-host failure domains, and practice ADR discipline before cargo-cult commands.

## Linked Topic

- [[10-Linux/00-Orientation-and-Boundaries/Why Linux Exists for Engineers|Why Linux Exists for Engineers]]
- [[10-Linux/00-Orientation-and-Boundaries/CS Models vs Linux Operations Boundaries|CS Models vs Linux Operations Boundaries]]
- [[10-Linux/00-Orientation-and-Boundaries/Distributions Kernel and Userspace|Distributions Kernel and Userspace]]
- [[10-Linux/00-Orientation-and-Boundaries/Failure Domains on a Single Host|Failure Domains on a Single Host]]
- [[10-Linux/00-Orientation-and-Boundaries/ADR Discipline for Host Decisions|ADR Discipline for Host Decisions]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Draw a Mermaid diagram showing ownership for a Node API on a Linux VM: CS process model, Linux ops triage, Backend timeouts, Docker image/runtime. Label which track owns `ps`/`procfs`, PCB theory, Express keep-alive, and `docker run`.

**Hint:** Start from [[10-Linux/00-Orientation-and-Boundaries/CS Models vs Linux Operations Boundaries|CS Models vs Linux Operations Boundaries]].

**Acceptance criteria:**

- [ ] Four ownership regions with handoff arrows
- [ ] Explicit links to [[01-Computer-Science/README|Computer Science]], [[07-Backend/README|Backend]], [[14-Docker/README|Docker]]
- [ ] One anti-pattern called out (e.g., teaching page tables as Linux ops)

### Problem 2 — `intermediate`

**Prompt:** List five production failures that look like "app bugs" but are host-contract failures. For each, name the symptom, owning layer, and first diagnostic question.

**Hint:** See [[10-Linux/00-Orientation-and-Boundaries/Why Linux Exists for Engineers|Why Linux Exists for Engineers]].

**Acceptance criteria:**

- [ ] At least one OOM, one ENOSPC, one socket/exhaustion failure
- [ ] Table: symptom → host cause → first tool
- [ ] No answers that only say "restart the service"

### Problem 3 — `intermediate`

**Prompt:** Explain kernel vs userspace vs distribution for an engineer who only knows "Ubuntu." Give three decisions that belong in each layer.

**Acceptance criteria:**

- [ ] Distinguishes kernel ABI, userspace tools, distro packaging/policy
- [ ] Cross-link to [[10-Linux/00-Orientation-and-Boundaries/Distributions Kernel and Userspace|Distributions Kernel and Userspace]]
- [ ] One example where blaming "Linux" is too coarse

## Observe

### Problem 1 — `beginner`

**Prompt:** On a lab host (or fixture), inventory: kernel release, distro ID, systemd vs not, and whether you are in a container/namespace. Record commands and outputs.

**Acceptance criteria:**

- [ ] `uname`, `/etc/os-release`, PID 1 identity captured
- [ ] Evidence for/against containerized environment
- [ ] Assumptions listed if using a simulation fixture

### Problem 2 — `intermediate`

**Prompt:** Observe a healthy host baseline: load average, memory free vs available, disk `%util` snapshot, listening sockets count. Write a one-page "what normal looks like" note.

**Acceptance criteria:**

- [ ] Four resource classes sampled with tool names
- [ ] Distinguishes free vs available (or equivalent)
- [ ] Baseline usable for later incident comparison

### Problem 3 — `advanced`

**Prompt:** Compare two hosts (or fixtures): bare metal vs container. List which `/proc` and `/sys` views can lie or be virtualized from the guest's perspective.

**Acceptance criteria:**

- [ ] At least five misleading signals named
- [ ] Handoff note to [[14-Docker/README|Docker]] / [[15-Kubernetes/README|Kubernetes]]
- [ ] Operator implication: verify cgroup limits before trusting free memory

## Model

### Problem 1 — `beginner`

**Prompt:** Partition a single API host into failure domains: CPU/scheduler, memory/OOM, disk/mounts, network/stack, init/systemd. Assign a blast-radius budget (users/% of traffic) each domain may take down.

**Hint:** Use [[10-Linux/00-Orientation-and-Boundaries/Failure Domains on a Single Host|Failure Domains on a Single Host]].

**Acceptance criteria:**

- [ ] Mermaid of domains with shared dependencies
- [ ] Numeric blast-radius budgets per domain
- [ ] Kernel panic vs process crash distinguished

### Problem 2 — `intermediate`

**Prompt:** Model "noisy neighbor on one box": batch job + latency-sensitive API sharing CPU and disk. Express contention as a host constraint that must drive cgroup budgets later.

**Acceptance criteria:**

- [ ] Contention quantified (e.g., share of cores, IO weight)
- [ ] Implication for latency SLO named
- [ ] Link forward to [[10-Linux/07-Cgroups-Namespaces-and-Isolation/Resource Budgets and Noisy Neighbor Containment|Resource Budgets and Noisy Neighbor Containment]]

### Problem 3 — `advanced`

**Prompt:** Draft an ADR for "tune sysctl live vs reboot-required change" for a production host. Include context, decision, consequences, and rejected alternatives.

**Hint:** Follow [[10-Linux/00-Orientation-and-Boundaries/ADR Discipline for Host Decisions|ADR Discipline for Host Decisions]].

**Acceptance criteria:**

- [ ] Context cites risk of persistence and rollback
- [ ] At least two rejected alternatives with why
- [ ] Consequences include documentation and drift detection

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Root disk fills to 100%. Simulate blast radius for logging, databases on same disk, and systemd journal. Which products fail closed vs degrade?

**Acceptance criteria:**

- [ ] Per-subsystem degradation policy
- [ ] Fail-open vs fail-closed justified for the API
- [ ] Budget vs actual blast radius compared

### Problem 2 — `advanced`

**Prompt:** Leadership wants one golden AMI with every sysctl "optimized." Write a failure brief arguing why undocumented host knobs collapse operability.

**Acceptance criteria:**

- [ ] Drift and blast-radius argument
- [ ] Counterproposal: ADR + measured baselines
- [ ] Link to performance module without requiring deep tuning yet

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Onboard a new SRE to Linux standards: write a one-page "how we operate hosts" guide covering symptom→tool order, ADR location, and when to escalate to DevOps/containers tracks.

**Acceptance criteria:**

- [ ] Template pointers and example links
- [ ] Escalation criteria to [[16-DevOps/README|DevOps]] and [[14-Docker/README|Docker]]
- [ ] Interview/exercise practice loop referenced

### Problem 2 — `advanced`

**Prompt:** Two teams merge: one SSHes and edits `/etc` live; the other only changes via imaged rebuilds. Design a 90-day alignment plan that does not freeze incident response.

**Acceptance criteria:**

- [ ] Phased adoption of ADR + change windows
- [ ] Emergency break-glass procedure
- [ ] Explicit non-goals (no full config-management rewrite in 90 days)

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Boundaries | Lists commands | Separates CS / Linux / Docker / Backend with handoffs |
| Modeling | Vague "the box" | Failure domains, budgets, ADR-worthy decisions |
| Production | Heroic SSH | Standards, evidence, escalation paths |

## Related Notes

- [[10-Linux/_interview/00-Orientation-and-Boundaries|Orientation Interview]]
- [[10-Linux/code/README|Linux code labs]]
- [[10-Linux/README|Linux]]
- [[Career/README|Career]]
