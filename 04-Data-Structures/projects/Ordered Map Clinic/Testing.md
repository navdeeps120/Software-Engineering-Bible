---
title: "Ordered Map Clinic — Testing"
aliases: []
track: 04-Data-Structures
topic: ordered-map-clinic-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, data-structures, testing]
created: 2026-07-21
updated: 2026-07-21
---

# Testing — Ordered Map Clinic

## Critical Paths

1. Shared tree vectors on BST and AVL backends
2. Sorted insert degeneracy: BST height O(n), AVL height O(log n)
3. Range queries inclusive/exclusive boundaries
4. Delete node with 0/1/2 children
5. Rotation trace matches expected sequence on fixed insert script

## Commands

```bash
cd 04-Data-Structures/code/typescript && npm test -- -t "BST|AVL"
cd 04-Data-Structures/code/python && python -m pytest -q -k "bst or avl"
```

## Definition of Done

- [ ] Backend swap produces identical results on non-degenerate shared vectors
- [ ] AVL balance invariant checked after every mutator in debug
- [ ] CLI schema tests for `--backend` and range output ordering

## Related Documents

- [[04-Data-Structures/projects/Ordered Map Clinic/README|README]]
