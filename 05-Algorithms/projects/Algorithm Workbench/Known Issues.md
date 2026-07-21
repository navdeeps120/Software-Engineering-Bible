---
title: "Algorithm Workbench — Known Issues"
aliases: []
track: 05-Algorithms
topic: algorithm-workbench-known-issues
difficulty: intermediate
status: active
prerequisites: []
tags: [project, algorithms, issues]
created: 2026-07-21
updated: 2026-07-21
---

# Known Issues — Algorithm Workbench

## Open Issues

| ID | Summary | Severity | Workaround | Status |
| --- | --- | --- | --- | --- |
| KI-001 | No unified `seb-alg` CLI adapter yet | high | Run language tests and mini-project docs directly | open |
| KI-002 | Shared vector files not all committed | high | Follow module tests until vectors land | open |
| KI-003 | Facade re-exports incomplete per language | medium | Import modules from `code/` paths | open |
| KI-004 | Certificate checker not wired to all algorithms | medium | Manual output compare in tests | open |
| KI-005 | Advisor rules engine not implemented | medium | Use [[05-Algorithms/13-Production-Selection-and-Interview-Patterns/Algorithm Selection Decision Matrix\|Decision Matrix]] manually | open |
| KI-006 | Experiment report schema draft only | low | Use ad-hoc bench JSON | open |

## Accepted Constraints

- Graph storage imported from Data Structures—no duplicate GraphStore in Algorithms track.
- Floyd-Warshall capped to teaching V— not for production all-pairs.
- Rabin-Karp requires verify on every hash hit—no hash-only mode in default CLI.

## Risk Rule

No issue may be hidden as stdlib compatibility. Track delivery in [[05-Algorithms/projects/Algorithm Workbench/Roadmap|Roadmap]].

## Related Documents

- [[05-Algorithms/projects/Algorithm Workbench/Postmortem|Postmortem]]
- [[05-Algorithms/projects/Algorithm Workbench/Roadmap|Roadmap]]
