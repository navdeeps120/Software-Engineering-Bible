---
title: Cgroups Namespaces and Isolation Interview
aliases: [07 Cgroups Namespaces Interview]
track: 10-Linux
topic: cgroups-namespaces-and-isolation-interview
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/07-Cgroups-Namespaces-and-Isolation/cgroup v2 Controllers CPU Memory IO|cgroup v2 Controllers CPU Memory IO]]"]
tags: [interviews, linux, cgroups, namespaces, isolation]
created: 2026-07-23
updated: 2026-07-23
---

# Cgroups Namespaces and Isolation Interview

## Linked Topic

- [[10-Linux/07-Cgroups-Namespaces-and-Isolation/cgroup v2 Controllers CPU Memory IO|cgroup v2 Controllers CPU Memory IO]]
- [[10-Linux/07-Cgroups-Namespaces-and-Isolation/Namespaces Types and Isolation Boundaries|Namespaces Types and Isolation Boundaries]]
- [[10-Linux/07-Cgroups-Namespaces-and-Isolation/Resource Budgets and Noisy Neighbor Containment|Resource Budgets and Noisy Neighbor Containment]]
- [[10-Linux/07-Cgroups-Namespaces-and-Isolation/User Namespaces Capabilities and Privilege Drops|User Namespaces Capabilities and Privilege Drops]]
- [[10-Linux/07-Cgroups-Namespaces-and-Isolation/From Host Primitives to Containers Handoff|From Host Primitives to Containers Handoff]]

## How to Practice

1. Say "namespaces isolate identity; cgroups budget resources" early.
2. Never equate containers with a separate kernel.
3. Prefer measured working sets for limits.
4. Call out host vs guest PID tooling hazards.

## Junior

1. Cgroups vs namespaces in one sentence each?

   - **Strong:** Resource control vs isolated views/IDs
   - **Weak:** Both mean Docker

2. What happens when a cgroup hits `memory.max`?

   - **Strong:** Cgroup OOM / reclaim; may kill inside group
   - **Weak:** Host always reboots

3. Name three namespace types and what they hide.

   - **Strong:** pid/mnt/net (etc.) with examples
   - **Weak:** Cannot name any

## Mid

4. How do you find a process's cgroup and its limits?

   - **Strong:** `/proc/<pid>/cgroup` + controller files / systemd show
   - **Weak:** Guess from `docker stats` only

5. Noisy neighbor on CPU—nice vs cgroup cpu.max?

   - **Strong:** Harder guarantees from cgroup; nice is soft
   - **Weak:** Nice is enough always

6. "Root in container" — is it host root?

   - **Strong:** Often remapped via user ns; still residual risks
   - **Weak:** Always identical / always harmless

7. What can namespaces not protect you from?

   - **Strong:** Shared kernel bugs; some resources; misconfig host
   - **Weak:** "Containers are VMs"

## Senior

8. Budget 8 cores / 32 GiB among API, batch, system.

   - **Strong:** Headroom for system; overcommit explicit; monitors
   - **Weak:** 100% assigned to apps

9. Operator kills wrong PID due to pid namespace—prevention?

   - **Strong:** Know context; host-side tools; map namespaces
   - **Weak:** Blame the engineer only

## Staff

10. Org standard: all workloads budgeted—systemd + runtime. How?

    - **Strong:** Unified language, dual enforcement, K8s handoff
    - **Weak:** Only Docker compose on laptops

11. Negotiating memory.max with app team that wants unlimited?

    - **Strong:** Working set evidence, temporary raise + expiry, leak hunt
    - **Weak:** Unlimited forever

12. Staff ADR: slices vs only container limits for bare services.

    - **Strong:** Consequences for SSH/cron; drift; decision recorded
    - **Weak:** "Containers only" ignoring host jobs

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Concepts | Docker magic | NS ≠ cgroup |
| Budgets | Guess | Measure + headroom |
| Safety | Context blind | Host/guest explicit |

## Related Notes

- [[10-Linux/_exercises/07-Cgroups-Namespaces-and-Isolation|Cgroups Namespaces Exercises]]
- [[10-Linux/projects/Cgroup Budget Clinic/README|Cgroup Budget Clinic]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
