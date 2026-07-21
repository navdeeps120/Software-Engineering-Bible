---
title: "Probabilistic Membership Lab — Testing"
aliases: []
track: 04-Data-Structures
topic: probabilistic-membership-lab-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, data-structures, testing]
created: 2026-07-21
updated: 2026-07-21
---

# Testing — Probabilistic Membership Lab

## Critical Paths

1. Shared bloom vectors—deterministic seeds for reproducible bit patterns
2. After insert, `maybeContains` true; absent key with all zero bits returns false
3. No false negatives on insert-only suite
4. Statistical FP test: empirical rate near theoretical at `n_plan` (fixed seed, tolerance band)
5. Two-tier demo: Bloom FP triggers exact confirmation exactly once per unique key

## Commands

```bash
cd 04-Data-Structures/code/typescript && npm test -- -t "BloomFilter"
cd 04-Data-Structures/code/python && python -m pytest -q -k "bloom"
```

## Definition of Done

- [ ] Deterministic tests do not flaky-fail on FP statistical checks (use fixed keys or large n with tolerance)
- [ ] Saturation case asserts warning metric when `insertCount > n_plan`
- [ ] Delete stretch tests marked optional and document false-negative risk

## Related Documents

- [[04-Data-Structures/projects/Probabilistic Membership Lab/README|README]]
