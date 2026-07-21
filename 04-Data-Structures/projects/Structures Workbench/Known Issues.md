---
title: "Structures Workbench — Known Issues"
aliases: []
track: 04-Data-Structures
topic: structures-workbench-known-issues
difficulty: intermediate
status: active
prerequisites: []
tags: [project, data-structures, issues]
created: 2026-07-21
updated: 2026-07-21
---

# Known Issues — Structures Workbench

## Open Issues

| ID | Summary | Severity | Workaround | Status |
| --- | --- | --- | --- | --- |
| KI-001 | No unified `seb-ds` CLI adapter yet | high | Run language tests and mini-project docs directly | open |
| KI-002 | Shared vector files not all committed | high | Follow module tests until vectors land | open |
| KI-003 | Facade re-exports incomplete per language | medium | Import modules from `code/` paths | open |
| KI-004 | Advisor rules engine not implemented | medium | Use [[04-Data-Structures/14-Production-Selection/Structure Selection Decision Matrix\|Decision Matrix]] manually | open |
| KI-005 | Instrumentation JSON schema draft only | low | Use ad-hoc counters in modules | open |

## Accepted Constraints

- Concurrent structures use deterministic schedules—not lock-free production claims.
- Red-black, B+, lock-free queues remain concept-only per curriculum.
- Graph CLI excludes full algorithm library by design.

## Risk Rule

No issue may be hidden as stdlib compatibility. Track delivery in [[04-Data-Structures/projects/Structures Workbench/Roadmap|Roadmap]].

## Related Documents

- [[04-Data-Structures/projects/Structures Workbench/Postmortem|Postmortem]]
- [[04-Data-Structures/projects/Structures Workbench/Roadmap|Roadmap]]
