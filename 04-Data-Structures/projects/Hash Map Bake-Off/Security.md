---
title: "Hash Map Bake-Off — Security"
aliases: []
track: 04-Data-Structures
topic: hash-map-bake-off-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, data-structures, security]
created: 2026-07-21
updated: 2026-07-21
---

# Security — Hash Map Bake-Off

## Focus

Hash-flooding and algorithmic complexity attacks on in-memory maps—relevant before exposing user-controlled keys on hot paths. See [[04-Data-Structures/04-Hash-Tables-and-Sets/Hash-Flooding DoS and Randomized Hashing|Hash-Flooding DoS and Randomized Hashing]].

## Adversarial Key Suite

| Generator | Intent | Expected naive outcome |
| --- | --- | --- |
| Single-bucket keys | Max chain/probe depth | O(n) lookup |
| Permutation collision | Stress equals after hash match | CPU burn on long chains |
| Long string keys | Memory + hash CPU | Allocation pressure |

Mitigation checklist:

- [ ] Per-process random hash seed (document seed for reproducible tests)
- [ ] Cap max table size and key length
- [ ] Monitor p95 probe/chain in production-like benchmarks
- [ ] Escalate to treeified bucket or external store only in Backend/Databases tracks—not this lab

## Controls

- JSON/CLI loaders reject oversized keys and operation counts.
- No user-supplied hash function without audit in educational CLI.
- Benchmark reports label adversarial runs explicitly—never mix with uniform latency SLOs.

## Related Documents

- [[04-Data-Structures/projects/Hash Map Bake-Off/README|README]]
- [[04-Data-Structures/projects/Structures Workbench/ADR/ADR-002 Hash Collision Strategy|ADR-002]]
