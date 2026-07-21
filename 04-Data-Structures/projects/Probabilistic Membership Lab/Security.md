---
title: "Probabilistic Membership Lab — Security"
aliases: []
track: 04-Data-Structures
topic: probabilistic-membership-lab-security
difficulty: intermediate
status: active
prerequisites: []
tags: [project, data-structures, security]
created: 2026-07-21
updated: 2026-07-21
---

# Security — Probabilistic Membership Lab

## Correctness Boundary

Bloom filters must not gate security decisions alone.

| Misuse | Risk | Mitigation |
| --- | --- | --- |
| Authorization from Bloom only | False positive grants access | Exact verification tier required |
| Cache negative only | Safer pattern | Document "definitely not" semantics |
| Saturation ignored | FP rate approaches 1 | Rebuild alerts; monitor insert/n ratio |

## Resource Limits

- Cap `m`, `k`, and insert count from untrusted CLI
- Checked multiplication when sizing bit array bytes

## Related Documents

- [[04-Data-Structures/projects/Probabilistic Membership Lab/README|README]]
- [[04-Data-Structures/10-Probabilistic-Structures/Bloom Filters|Bloom Filters]]
