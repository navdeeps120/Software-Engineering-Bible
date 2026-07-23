---
title: "Distributed Systems Workbench — Lessons Learned"
aliases: []
track: 09-System-Design
topic: distributed-systems-workbench-lessons-learned
difficulty: intermediate
status: active
prerequisites: []
tags: [project, system-design, lessons]
created: 2026-07-23
updated: 2026-07-23
---

# Lessons Learned — Distributed Systems Workbench

## Technical Lessons

- Capacity estimates without listed assumptions are lies with decimal places.
- Consistent hashing trades perfect balance for bounded remaps—measure remap %, don’t assert “no disruption.”
- Hotspots are usually key-design failures before hardware failures.
- `R + W > N` is necessary but not sufficient for every consistency claim learners want to make.
- RPO/RTO are product policies; detection delay and fencing are part of the budget, not footnotes.
- Active-passive is easier to teach safely; active-active demands conflict policy up front.

## Process and Product Lessons

Documentation must separate implemented behavior from target integration. Portfolio value comes from evidence—tests, trade-offs, security boundaries—not topology feature breadth. A CLI creates reproducible demos but adds schema and exit-code compatibility obligations. Clone case studies belong in a curated gallery (ADR-005), not infinite one-off apps.

## Repeat and Change

**Repeat:** ADR-first defaults, step-clock simulations, honest non-goals, mini-project modularity.  
**Change:** Prefer golden scenario fixtures over narrative-only acceptance; gate release claims on smoke tests.

## Related Documents

- [[09-System-Design/projects/Distributed Systems Workbench/Engineering Journal|Engineering Journal]]
- [[09-System-Design/projects/Distributed Systems Workbench/Architecture|Architecture]]
