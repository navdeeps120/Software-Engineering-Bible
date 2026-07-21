---
title: "Sorting and Selection Bake-Off — Testing"
aliases: []
track: 05-Algorithms
topic: sorting-selection-bake-off-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, algorithms, testing]
created: 2026-07-21
updated: 2026-07-21
---

# Testing — Sorting and Selection Bake-Off

## Strategy

Shared vectors establish sort and selection contracts first; representation-specific tests cover pivot policies, stability tags, and integer range validation; adversarial suites guard quadratic exposure.

## Critical Paths

1. Sort empty, single-element, two-element, all-equal arrays
2. Stability: equal keys with satellite indices preserve order (merge, stable variants)
3. Integer sorts: min/max boundary, single bucket, full range
4. Quicksort: adversarial pivot vectors trigger introsort or documented fallback
5. Quickselect: median, k=1, k=n, duplicate keys
6. Certificate checker rejects intentionally corrupted outputs in negative tests

## Commands

```bash
cd 05-Algorithms/code/typescript && npm test -- -t "MergeSort|Quicksort|Heapsort|CountingSort|Quickselect"
cd 05-Algorithms/code/python && python -m pytest -q -k "merge_sort or quicksort or heapsort or counting_sort or quickselect"
```

## Definition of Done

- [ ] Dual-language green on `shared/vectors/sort*.json` and `select*.json`
- [ ] Stability vectors pass only on algorithms marked stable
- [ ] Out-of-range integer keys fail with explicit error, not wrong order
- [ ] Certificate checker integrated in vector runner exit code
- [ ] Benchmark fixtures committed—not wall-clock thresholds alone

## Related Documents

- [[05-Algorithms/projects/Sorting and Selection Bake-Off/README|README]]
- [[05-Algorithms/projects/Algorithm Workbench/Testing|Algorithm Workbench Testing]]
