---
title: "JavaScript Runtime Toolkit — Lessons Learned"
aliases: []
track: 02-JavaScript
topic: "javascript-runtime-toolkit-lessons-learned"
difficulty: intermediate
status: active
prerequisites: []
tags: [project, javascript, lessons]
created: "2026-07-21"
updated: "2026-07-21"
---

# Lessons Learned — JavaScript Runtime Toolkit

## Technical Lessons

- Userland models clarify invariants but cannot reproduce engine job queues, live bindings, or host rejection reporting.
- Ordering is part of an API even when types cannot express it.
- Cooperative cancellation requires every layer to honor the signal.
- Small pure modules make edge cases easier to test than one generalized runtime abstraction.

## Process and Product Lessons

Documentation must separate implemented behavior from target integration. Portfolio value comes from evidence—tests, trade-offs, security boundaries—not from broad feature claims. A CLI makes demonstrations reproducible but also creates validation and compatibility obligations.

## Repeat and Change

Repeat test-first edge-case work and explicit non-goals. Next, add contract tests before the facade/CLI and record benchmark baselines only after representative fixtures exist.

## Curriculum Feedback

Cross-link native promises, module loading, coercion, Proxy invariants, cancellation, and backpressure notes to the relevant mini-project README and [[02-JavaScript/projects/JavaScript Runtime Toolkit/Architecture|Architecture]].
