---
title: "Linux Host Workbench — Lessons Learned"
aliases: []
track: 10-Linux
topic: linux-host-workbench-lessons-learned
difficulty: intermediate
status: active
prerequisites: []
tags: [project, linux, lessons]
created: 2026-07-23
updated: 2026-07-23
---

# Lessons Learned — Linux Host Workbench

## Technical Lessons

- Procfs is the operator’s source of truth—but only if you know which fields are stale or arch-specific.
- cgroup v2 budgets teach noisy-neighbor containment better than v1 dual-hierarchy nostalgia.
- nftables ordered chains beat “iptables folklore” for modern host firewall pedagogy.
- systemd dependency cycles are configuration bugs; graph tools catch them before boot pain.
- Golden signals on a single box still need a stop condition—more tools ≠ more clarity.
- Containers are composed from host primitives; confusing the boundary creates cargo-cult ops.

## Process and Product Lessons

Documentation must separate implemented behavior from target integration. Portfolio value comes from evidence—tests, trade-offs, security boundaries—not tool-name breadth. A CLI creates reproducible demos but adds schema and exit-code compatibility obligations. Live VMs in CI feel “real” but violate portability and ADR-001; fixtures win.

## Repeat and Change

**Repeat:** ADR-first defaults, step-clock simulations, honest non-goals, mini-project modularity.  
**Change:** Prefer golden scenario fixtures over narrative-only acceptance; gate release claims on smoke tests.

## Related Documents

- [[10-Linux/projects/Linux Host Workbench/Engineering Journal|Engineering Journal]]
- [[10-Linux/projects/Linux Host Workbench/Architecture|Architecture]]
