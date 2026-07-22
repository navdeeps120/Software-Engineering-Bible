---
title: "Mini B-Plus Index Lab — Testing"
aliases: []
track: 08-Databases
topic: mini-b-plus-index-lab-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, databases, testing]
created: 2026-07-22
updated: 2026-07-22
---

# Testing — Mini B+ Index Lab

## Strategy

Golden-tree fixtures for small fanout; fuzz inserts with reference sorted map; recovery integration after random splits; range-scan order assertions.

## Critical Paths

1. Empty tree insert → single leaf root
2. Sequential inserts trigger splits; height increases predictably at fanout boundaries
3. Random insert/search agrees with `Map` reference implementation
4. Range `[a, z)` returns sorted keys with no gaps or duplicates beyond policy
5. WAL crash + recovery preserves all keys
6. `explainIndexLookup` page counts match instrumented counters

## Commands

```bash
cd 08-Databases/code
npm test -- tests/labs.test.ts -t "BPlusIndex"
```

## Definition of Done

- [ ] Split promotion cases covered: leaf-only, internal, root
- [ ] Duplicate-key policy has explicit tests
- [ ] Corrupt child pointer rejected on load
- [ ] Range scan empty range returns `[]` without error
- [ ] Tree dump snapshot stable for regression on fixed seed

## Related Documents

- [[08-Databases/projects/Mini B-Plus Index Lab/README|README]]
- [[08-Databases/projects/Toy Page and WAL Store/Testing|Toy Page and WAL Store Testing]]
