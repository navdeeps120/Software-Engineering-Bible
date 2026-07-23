---
title: "Distributed Systems Workbench — Ideas"
aliases: []
track: 09-System-Design
topic: distributed-systems-workbench-ideas
difficulty: intermediate
status: active
prerequisites: []
tags: [project, system-design, ideas]
created: 2026-07-23
updated: 2026-07-23
---

# Ideas — Distributed Systems Workbench

## Idea Backlog

| ID | Idea | Value hypothesis | Cost | Next research step |
| --- | --- | --- | --- | --- |
| I-001 | Maglev lookup table mode for LB | Closer to modern L7 affinity | medium | Compare remap % fixtures vs vnode |
| I-002 | Cache stampede fleet simulator | Ties caching chapter to code | medium | Define thundering-herd scenario DSL |
| I-003 | Queue lag / backpressure topology lab | Messaging chapter executable | medium | Lag budget + shed policy objects |
| I-004 | Fencing-token lease demo | Coordination chapter bridge | low | Reuse failover fence primitives |
| I-005 | Vector-clock causal session store | Extends quorum stretch | medium | Define client session API |
| I-006 | Cost SKU mapper for capacity lab | Interview + planning realism | medium | Disclaimer + regional price fixtures |
| I-007 | Interactive Mermaid export from gallery | Better portfolio demos | low | Static diagram templates |

## Parking Lot

Express/ORM stacks, DB engine internals, Kubernetes/mesh control planes, real cloud DNS failover, and claiming production LB parity are deferred—they violate ADR-001.

Ideas enter [[09-System-Design/projects/Distributed Systems Workbench/Roadmap|Roadmap]] only with validated learning problem, measurable outcome, architecture impact, maintenance owner, and compatibility plan.

## Related Documents

- [[09-System-Design/projects/Distributed Systems Workbench/Roadmap|Roadmap]]
- [[09-System-Design/projects/Distributed Systems Workbench/ADR/ADR-001 Simulation Scope|ADR-001]]
