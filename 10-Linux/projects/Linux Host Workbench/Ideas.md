---
title: "Linux Host Workbench — Ideas"
aliases: []
track: 10-Linux
topic: linux-host-workbench-ideas
difficulty: intermediate
status: active
prerequisites: []
tags: [project, linux, ideas]
created: 2026-07-23
updated: 2026-07-23
---

# Ideas — Linux Host Workbench

## Idea Backlog

| ID | Idea | Value hypothesis | Cost | Next research step |
| --- | --- | --- | --- | --- |
| I-001 | PSI-style pressure signals in cgroup clinic | Closer to modern mem/IO triage | medium | Define synthetic PSI fields + thresholds |
| I-002 | Drop-in override merge for systemd workshop | Real-world unit debugging | low | Spec `.d/*.conf` precedence fixtures |
| I-003 | nftables sets/maps teaching mode | Richer firewall pedagogy | medium | Bound set cardinality in limits |
| I-004 | ENOSPC / inode exhaustion IO lab | Complements FS chapter | medium | Mount fixture + quota model |
| I-005 | OOM score selector overlay on procfs | Ties memory chapter to inspector | low | Reuse status parse + score files |
| I-006 | Evidence-pack ZIP export for postmortems | Portfolio demo realism | medium | Sanitize + size caps |
| I-007 | Interactive Mermaid export from unit graphs | Better interview demos | low | Static diagram templates |

## Parking Lot

Live VMs in CI, Docker image builds, Kubernetes manifests, cloud IAM, and claiming kernel/systemd/nftables production parity are deferred—they violate ADR-001 / ADR-005.

Ideas enter [[10-Linux/projects/Linux Host Workbench/Roadmap|Roadmap]] only with validated learning problem, measurable outcome, architecture impact, maintenance owner, and compatibility plan.

## Related Documents

- [[10-Linux/projects/Linux Host Workbench/Roadmap|Roadmap]]
- [[10-Linux/projects/Linux Host Workbench/ADR/ADR-001 Simulation Scope|ADR-001]]
