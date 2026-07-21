---
title: "Ordered Map Clinic — Security"
aliases: []
track: 04-Data-Structures
topic: ordered-map-clinic-security
difficulty: intermediate
status: active
prerequisites: []
tags: [project, data-structures, security]
created: 2026-07-21
updated: 2026-07-21
---

# Security — Ordered Map Clinic

## Algorithmic Complexity

Sorted or adversarial key streams degrade BST to O(n) operations—equivalent to intentional CPU exhaustion on hot paths. Mitigations:

- Document BST as **lab baseline only**; AVL is default for CLI demos handling untrusted key order.
- Cap operation count and map size from JSON/CLI.
- Prefer iterative traversals with explicit stack depth limit.

## Controls

- Reject non-total or unstable comparators in debug builds.
- No automatic rebalancing switch hidden from user—backend flag must be explicit.

## Related Documents

- [[04-Data-Structures/projects/Ordered Map Clinic/README|README]]
- [[04-Data-Structures/projects/Structures Workbench/ADR/ADR-003 Balanced Tree Default|ADR-003]]
