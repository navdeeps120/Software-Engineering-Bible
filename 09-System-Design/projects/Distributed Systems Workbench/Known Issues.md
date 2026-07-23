---
title: "Distributed Systems Workbench — Known Issues"
aliases: []
track: 09-System-Design
topic: distributed-systems-workbench-known-issues
difficulty: intermediate
status: active
prerequisites: []
tags: [project, system-design, issues]
created: 2026-07-23
updated: 2026-07-23
---

# Known Issues — Distributed Systems Workbench

## Open Issues

| ID | Summary | Severity | Workaround | Status |
| --- | --- | --- | --- | --- |
| KI-001 | Code lab tree [[09-System-Design/code\|09-System-Design/code]] not yet fully implemented | high | Follow module paths in docs; implement with test-first workflow | open |
| KI-002 | No package facade or `dsw` CLI adapter yet | high | Import planned paths directly during development | open |
| KI-003 | Capacity model omits compression/index overhead unless opted in | medium | Document assumptions in report | accepted for lab |
| KI-004 | Consistent-hash is not Maglev; remap % differs from production LBs | medium | Teach concept; link wiki algorithms note | accepted for lab |
| KI-005 | Quorum demo is not linearizability proof under all timings | medium | Document R+W>N limits | accepted for lab |
| KI-006 | Failover playbook uses offset surrogates, not real LSNs/DNS | medium | Pair with Databases + DevOps notes | accepted for lab |
| KI-007 | Gallery is metadata, not runnable clone apps | medium | Follow wiki clone case studies for depth | open |

## Technical Debt

Add dedicated test modules per capability, public re-exports, CLI schema validation, clean-install CI, tarball smoke tests, and benchmark fixtures. Pay contract and safety debt before new capabilities.

## Risk Rule

No issue above may be hidden or represented as production LB/DB/orchestration compatibility. Track delivery in [[09-System-Design/projects/Distributed Systems Workbench/Roadmap|Roadmap]] and investigations in [[09-System-Design/projects/Distributed Systems Workbench/Debug Diary|Debug Diary]].

## Related Documents

- [[09-System-Design/projects/Distributed Systems Workbench/Ideas|Ideas]]
- [[09-System-Design/projects/Distributed Systems Workbench/Postmortem|Postmortem]]
