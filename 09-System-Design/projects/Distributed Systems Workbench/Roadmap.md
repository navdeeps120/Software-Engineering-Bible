---
title: "Distributed Systems Workbench — Roadmap"
aliases: []
track: 09-System-Design
topic: distributed-systems-workbench-roadmap
difficulty: intermediate
status: active
prerequisites: []
tags: [project, system-design, roadmap]
created: 2026-07-23
updated: 2026-07-23
---

# Roadmap — Distributed Systems Workbench

## Current Phase

P0 contract and integration design is active. Wiki and project documentation exist; distributable product boundaries in [[09-System-Design/code|09-System-Design/code]] do not.

```mermaid
flowchart LR
    P0[Contracts] --> P1[Facade + dsw CLI]
    P1 --> P2[Hardening + tarball]
    P2 --> P3[Benchmarks + stretch labs]
```

| Phase | Outcome | Exit criteria |
| --- | --- | --- |
| P0 | Truthful contracts and decisions | requirements, API, security, tests, ADRs reviewed |
| P1 | Integrated vertical slice | five exports and five CLI command families pass contracts |
| P2 | Release-ready artifact | CI matrix, audit triage, tarball smoke, docs match behavior |
| P3 | Evidence-led enhancements | bench fixtures + Ideas backlog justified by measured need |

## Now

Implement core modules under `09-System-Design/code/src`, define facade exports, CLI JSON schemas, resource ceilings, error codes, and Vitest suites per mini project.

## Next

Land `dsw` adapter, npm pack smoke test, clean-install CI job, golden scenarios for quorum/failover/skew, remap metric harness.

## Later

Optional Maglev mode, cache stampede lab, messaging lag lab, fencing-token demo—only after P2 exit criteria.

## Related Documents

- [[09-System-Design/projects/Distributed Systems Workbench/Planning|Planning]]
- [[09-System-Design/projects/Distributed Systems Workbench/Ideas|Ideas]]
