---
title: "Sorting and Selection Bake-Off — Security"
aliases: []
track: 05-Algorithms
topic: sorting-selection-bake-off-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, algorithms, security]
created: 2026-07-21
updated: 2026-07-21
---

# Security — Sorting and Selection Bake-Off

## Focus

Algorithmic complexity attacks and resource exhaustion on in-memory sort/selection—relevant when user-controlled array sizes or key distributions hit hot paths. See [[05-Algorithms/01-Complexity-and-Analysis/Lower Bounds Decision Trees and Adversaries|Lower Bounds Decision Trees and Adversaries]].

## Adversarial Input Suite

| Generator | Intent | Expected naive outcome |
| --- | --- | --- |
| Sorted input + bad pivot | Quadratic quicksort | O(n²) comparisons |
| All-equal keys | Partition imbalance | Depth without 3-way partition |
| Huge n, small k | Top-k misuse | Full sort if k ignored |
| Wide integer range | Counting sort memory blowup | O(range) allocation |

Mitigation checklist:

- [ ] Hard cap on `n`, `k`, and integer range before allocation
- [ ] Introsort or median-of-medians teaching toggle documented
- [ ] Certificate checker runs on every vector—detect silent wrong order
- [ ] Benchmark reports label adversarial runs separately from uniform latency

## Controls

- JSON/CLI loaders reject oversized arrays and invalid `k`.
- No user-supplied comparator from untrusted scripts without sandbox note.
- Recursive quicksort disabled or depth-bounded in default CLI profile.
- Integer sort range validated before bucket array allocation.

## Related Documents

- [[05-Algorithms/projects/Sorting and Selection Bake-Off/README|README]]
- [[05-Algorithms/projects/Algorithm Workbench/ADR/ADR-001 Sorting Default|ADR-001]]
- [[05-Algorithms/projects/Algorithm Workbench/Security|Algorithm Workbench Security]]
