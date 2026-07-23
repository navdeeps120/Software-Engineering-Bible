---
title: Linux Code Labs
aliases: [Linux Mechanism Labs, TypeScript Host Simulations]
track: 10-Linux
topic: linux-code-labs
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/README|Linux]]"]
tags: [linux, typescript, procfs, cgroup, systemd, labs]
created: 2026-07-23
updated: 2026-07-23
---

# Linux Code Labs

Deterministic **in-process TypeScript simulations** for Linux host mechanisms:
procfs parsing, DAC/ACL permissions, signals/rlimits, page-cache/OOM,
mounts/ENOSPC, socket tables, cgroup v2 budgets, namespace isolation sketches,
systemd unit graphs, and journal rate limits. Code is MIT licensed.

Mirrors [[09-System-Design/code/README|System Design]] tooling: **TypeScript +
Vitest**, no build step, no live Linux VM required for CI. Notes still document
real-host command practice (`ps`, `ss`, `strace`, …).

## Labs

| Module | File | Teaches |
| --- | --- | --- |
| Processes | `procfs.ts` | `/proc` status/stat fixtures |
| Permissions | `permissions.ts` | DAC, ACL, sticky, umask |
| Signals / limits | `signalsRlimits.ts` | dispositions, soft/hard rlimits |
| Memory / OOM | `memoryOom.ts` | dirty ratio, swap pressure, OOM victim |
| Filesystems | `mounts.ts` | mount resolve, ENOSPC bytes/inodes |
| Networking | `sockets.ts` | ss-like table, ESTAB/TIME-WAIT pressure |
| Isolation | `cgroup.ts` / `namespaces.ts` | v2 budgets, namespace membership |
| systemd | `systemd.ts` | Requires= topo order + cycles |
| Logging | `journal.ts` | ring buffer + per-unit rate limit |

## Run

```bash
npm install
npm test
```

## Handoffs

| Concern | Home |
| --- | --- |
| Process/VM/syscall *models* | [[01-Computer-Science/code/README\|CS labs]] |
| Docker images / K8s controllers | [[14-Docker/README\|Docker]], [[15-Kubernetes/README\|Kubernetes]] |
| Fleet CI/CD platforms | [[16-DevOps/README\|DevOps]] |
| Multi-service SLOs | [[09-System-Design/README\|System Design]] |

## Related Notes

- [[10-Linux/02-Processes-Signals-and-Job-Control/Process Lifecycle ps and procfs|Process Lifecycle ps and procfs]]
- [[10-Linux/07-Cgroups-Namespaces-and-Isolation/cgroup v2 Controllers CPU Memory IO|cgroup v2 Controllers]]
- [[10-Linux/06-systemd-Timers-and-Logging/Unit Types Dependencies and Targets|Unit Types Dependencies]]
- [[10-Linux/projects/Linux Host Workbench/README|Linux Host Workbench]]
