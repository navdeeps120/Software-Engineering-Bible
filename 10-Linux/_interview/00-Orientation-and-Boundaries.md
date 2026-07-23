---
title: Orientation and Boundaries Interview
aliases: [00 Orientation Interview]
track: 10-Linux
topic: orientation-and-boundaries-interview
difficulty: beginner
status: active
prerequisites: ["[[10-Linux/00-Orientation-and-Boundaries/Why Linux Exists for Engineers|Why Linux Exists for Engineers]]"]
tags: [interviews, linux, orientation, adr]
created: 2026-07-23
updated: 2026-07-23
---

# Orientation and Boundaries Interview

## Linked Topic

- [[10-Linux/00-Orientation-and-Boundaries/Why Linux Exists for Engineers|Why Linux Exists for Engineers]]
- [[10-Linux/00-Orientation-and-Boundaries/CS Models vs Linux Operations Boundaries|CS Models vs Linux Operations Boundaries]]
- [[10-Linux/00-Orientation-and-Boundaries/Distributions Kernel and Userspace|Distributions Kernel and Userspace]]
- [[10-Linux/00-Orientation-and-Boundaries/Failure Domains on a Single Host|Failure Domains on a Single Host]]
- [[10-Linux/00-Orientation-and-Boundaries/ADR Discipline for Host Decisions|ADR Discipline for Host Decisions]]

## How to Practice

1. Answer out loud in 2–5 minutes; name symptom → mechanism → tool before commands.
2. Separate CS theory, Linux ops, Docker/K8s, and Backend ownership explicitly.
3. State single-host failure domains before proposing knobs.
4. Close with an ADR-worthy decision and a rollback.

## Junior — Contracts and Boundaries

1. What problem does Linux host ops solve that reading CS process theory alone does not?

   - **Strong:** Production contracts—`procfs`, signals as delivered, OOM policy, mounts, systemd—not PCB diagrams
   - **Weak:** Listing random shell commands

2. Where is the boundary between Linux and Docker for "isolation"?

   - **Strong:** Namespaces/cgroups as host primitives vs images/engine UX; handoff to [[14-Docker/README|Docker]]
   - **Weak:** "Docker is a different OS"

3. Name three host failures that look like application bugs.

   - **Strong:** ENOSPC, OOM kill, fd/port exhaustion with first tools
   - **Weak:** "Restart the app"

## Mid — Modeling and ADRs

4. How do you partition failure domains on a single host?

   - **Strong:** CPU/mem/disk/net/init with blast-radius budgets; shared deps called out
   - **Weak:** "Everything can fail"

5. Kernel vs userspace vs distro—give one decision that belongs in each.

   - **Strong:** Sysctl/ABI vs tools/daemons vs packaging/release policy
   - **Weak:** "Ubuntu vs Linux" confusion unresolved

6. Walk through an ADR for a live sysctl change.

   - **Strong:** Context, measure, persist path, rollback, rejected "blog copy"
   - **Weak:** `sysctl -w` with no documentation

7. When should you escalate from Linux track to System Design?

   - **Strong:** Multi-host topology, SLO across services, multi-region—not single-box triage
   - **Weak:** Never / always

## Senior — Production Judgment

8. Two teams: one edits `/etc` live, one only rebuilds images. What risks appear?

   - **Strong:** Drift, unreproducible incidents, break-glass vs purity; alignment path
   - **Weak:** "Images are always better" without incident reality

9. "The box is slow" with healthy app CPU—how do you triage host vs code?

   - **Strong:** Ordered CPU/mem/disk/net, steal, iowait, saturation; evidence before blame
   - **Weak:** Profile only the Node process

## Staff — Org and Standards

10. How would you define Linux host review standards across 20 teams?

    - **Strong:** Triage order, evidence pack, ADR for knobs, hardening baseline, exception process
    - **Weak:** "Use the wiki" without enforcement

11. Platform wants one golden AMI with every sysctl "optimized." Assess blast radius.

    - **Strong:** Undocumented knobs, workload mismatch, drift; measured baselines + ADRs
    - **Weak:** Cost savings only

12. Draft a hiring signal: what must a senior demonstrate in a Linux ops loop?

    - **Strong:** Symptom→mechanism→tool, budgets, failure domains, handoffs; not trivia flags
    - **Weak:** Memorizing man-page switches

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Boundaries | Tech list | Track ownership with handoffs |
| Domains | Vague | Budgets and shared-dep risk |
| Staff | Opinions | Standards, ADRs, adoption |

## Related Notes

- [[10-Linux/_exercises/00-Orientation-and-Boundaries|Orientation Exercises]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
