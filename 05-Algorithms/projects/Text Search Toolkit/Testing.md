---
title: "Text Search Toolkit — Testing"
aliases: []
track: 05-Algorithms
topic: text-search-toolkit-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, algorithms, testing]
created: 2026-07-21
updated: 2026-07-21
---

# Testing — Text Search Toolkit

## Strategy

All algorithms cross-compared on shared match vectors; prefix-function and Z-array unit tests; Rabin-Karp collision injection tests force character verification.

## Critical Paths

1. Empty text, empty pattern, single char match/mismatch
2. Overlapping occurrences (`aaaa`, pattern `aa`)
3. Repetitive adversarial naive slowdown—KMP/Z linear comparison bounds
4. Rabin-Karp: crafted collision modulo small prime—verify prevents false positive
5. Batch toolkit returns same indices as individual algorithm calls
6. Certificate rejects wrong index list in negative test

## Commands

```bash
cd 05-Algorithms/code/typescript && npm test -- -t "NaiveSearch|KMPSearch|ZAlgorithm|RabinKarp|TextSearch"
cd 05-Algorithms/code/python && python -m pytest -q -k "naive_search or kmp or z_algorithm or rabin_karp"
```

## Definition of Done

- [ ] Dual-language green on `shared/vectors/search*.json`
- [ ] All four algorithms agree on match lists for every vector
- [ ] KMP π and Z arrays match golden files
- [ ] Rabin-Karp collision test proves verify path executed
- [ ] Length caps enforced in CLI integration tests

## Related Documents

- [[05-Algorithms/projects/Text Search Toolkit/README|README]]
- [[05-Algorithms/projects/Algorithm Workbench/Testing|Algorithm Workbench Testing]]
