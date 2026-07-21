---
title: "Text Search Toolkit — Security"
aliases: []
track: 05-Algorithms
topic: text-search-toolkit-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, algorithms, security]
created: 2026-07-21
updated: 2026-07-21
---

# Security — Text Search Toolkit

## Focus

ReDoS is out of scope (no regex engine), but **algorithmic complexity attacks** via long repetitive texts and **hash collision flooding** in Rabin-Karp remain relevant when search runs on untrusted content.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| 100MB text upload | Memory exhaustion | Hard length cap |
| Repetitive pattern/text | CPU burn on naive if mis-dispatched | Default dispatch to KMP/Z for long inputs |
| Rabin-Karp collision spam | False positive storm without verify | Mandatory char verify on hit |
| Many patterns batch | O(patterns * n) blowup | Pattern count cap |
| Binary blob as UTF-8 | Parse exceptions | Explicit encoding mode |

## Controls

- CLI validates text and pattern lengths before allocation.
- Toolkit dispatcher avoids naive for `n*m` product over threshold.
- Rolling hash parameters fixed in deterministic mode; document collision probability in Security.
- No execution of embedded patterns as code.
- Export match indices only—omit full text in benchmark JSON by default.

## Related Documents

- [[05-Algorithms/projects/Text Search Toolkit/README|README]]
- [[05-Algorithms/projects/Algorithm Workbench/ADR/ADR-004 Deterministic Tie-Breaking and RNG|ADR-004]]
- [[05-Algorithms/projects/Algorithm Workbench/Security|Algorithm Workbench Security]]
