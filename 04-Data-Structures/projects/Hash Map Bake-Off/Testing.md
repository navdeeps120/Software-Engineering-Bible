---
title: "Hash Map Bake-Off — Testing"
aliases: []
track: 04-Data-Structures
topic: hash-map-bake-off-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, data-structures, testing]
created: 2026-07-21
updated: 2026-07-21
---

# Testing — Hash Map Bake-Off

## Strategy

Contract tests from shared vectors first; representation-specific tests for delete/rehash; adversarial suite for security regression.

## Critical Paths

1. Insert, overwrite, get, delete, iterate
2. Rehash at load threshold—verify all keys retrievable
3. Open addressing: tombstone/backshift correctness after delete storm
4. Adversarial keys: max chain/probe bounded when seeded hash enabled
5. Set facade: add/remove/contains mirrors map keys

## Commands

```bash
cd 04-Data-Structures/code/typescript && npm test -- -t "ChainingHashMap|OpenAddressing|HashSet"
cd 04-Data-Structures/code/python && python -m pytest -q -k "chaining or open_addressing or hash_set"
```

## Definition of Done

- [ ] Dual-language green on `shared/vectors/hash*.json`
- [ ] Rehash test asserts no key loss
- [ ] Adversarial suite documents naive vs mitigated metrics
- [ ] Iterator stability rules documented and tested

## Related Documents

- [[04-Data-Structures/projects/Hash Map Bake-Off/README|README]]
