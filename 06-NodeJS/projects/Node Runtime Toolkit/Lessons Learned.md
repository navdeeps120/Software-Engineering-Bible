---
title: "Node Runtime Toolkit — Lessons Learned"
aliases: []
track: 06-NodeJS
topic: node-runtime-toolkit-lessons-learned
difficulty: intermediate
status: active
prerequisites: []
tags: [project, nodejs, lessons]
created: 2026-07-22
updated: 2026-07-22
---

# Lessons Learned — Node Runtime Toolkit

## Technical Lessons

- Userland models clarify invariants but cannot reproduce libuv phase ordering, full HTTP parser behavior, or npm resolution hoisting without explicit scope boundaries.
- Stream backpressure is a protocol between stages—benchmarks that only measure throughput hide memory cliffs.
- Worker threads share the process identity; they offload CPU, not untrusted code.
- Graceful shutdown is a state machine with hard timeouts—health checks must flip before drain completes.
- Dual-package hazards appear at the boundary between `import` and `require`, not inside either syntax alone.

## Process and Product Lessons

Documentation must separate implemented behavior from target integration. Portfolio value comes from evidence—tests, trade-offs, security boundaries—not feature breadth. A CLI creates reproducible demos but adds schema and exit-code compatibility obligations.

## Repeat and Change

Repeat test-first edge-case work and explicit non-goals (no Express, ORM, auth, Node replacement claims). Next: contract tests before facade/CLI; benchmark baselines only after representative fixtures exist.

## Curriculum Feedback

Cross-link event loop, streams, workers, shutdown, module exports, diagnostics, and supply-chain notes to mini-project READMEs and [[06-NodeJS/projects/Node Runtime Toolkit/Architecture|Architecture]].

## Related Documents

- [[06-NodeJS/projects/Node Runtime Toolkit/Engineering Journal|Engineering Journal]]
- [[06-NodeJS/projects/Node Runtime Toolkit/Postmortem|Postmortem]]
