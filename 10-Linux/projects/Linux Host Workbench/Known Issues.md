---
title: "Linux Host Workbench — Known Issues"
aliases: []
track: 10-Linux
topic: linux-host-workbench-known-issues
difficulty: intermediate
status: active
prerequisites: []
tags: [project, linux, issues]
created: 2026-07-23
updated: 2026-07-23
---

# Known Issues — Linux Host Workbench

## Open Issues

| ID | Summary | Severity | Workaround | Status |
| --- | --- | --- | --- | --- |
| KI-001 | Code lab tree [[10-Linux/code\|10-Linux/code]] not yet fully implemented | high | Follow module paths in docs; implement with test-first workflow | open |
| KI-002 | No package facade or `lhw` CLI adapter yet | high | Import planned paths directly during development | open |
| KI-003 | Procfs field coverage is teaching subset | medium | Document uncovered fields in report `assumptions[]` | accepted for lab |
| KI-004 | Cgroup clinic is not kernel CFS/mm fidelity | medium | Teach budgets; link wiki controller notes | accepted for lab |
| KI-005 | nftables evaluator lacks sets/maps/helpers | medium | Keep rule DSL minimal; contrast in Ideas | accepted for lab |
| KI-006 | systemd workshop is not PID 1 / dbus | medium | Pair with live `systemctl` study outside CI | accepted for lab |
| KI-007 | First-aid kit is not APM / continuous profiling | medium | Hand off multi-service SLOs to System Design | open |
| KI-008 | `10-Linux/code/README` may lag package surface | medium | Keep Implementation Checklist in MOC honest | open |

## Technical Debt

Add dedicated test modules per capability, public re-exports, CLI schema validation, clean-install CI, tarball smoke tests, and benchmark fixtures. Pay contract and safety debt before new capabilities.

## Risk Rule

No issue above may be hidden or represented as live-VM CI, Docker image build, Kubernetes, or cloud IAM compatibility. Track delivery in [[10-Linux/projects/Linux Host Workbench/Roadmap|Roadmap]] and investigations in [[10-Linux/projects/Linux Host Workbench/Debug Diary|Debug Diary]].

## Related Documents

- [[10-Linux/projects/Linux Host Workbench/Ideas|Ideas]]
- [[10-Linux/projects/Linux Host Workbench/Postmortem|Postmortem]]
