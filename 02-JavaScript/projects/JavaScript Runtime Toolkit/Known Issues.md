---
title: "JavaScript Runtime Toolkit — Known Issues"
aliases: []
track: 02-JavaScript
topic: "javascript-runtime-toolkit-known-issues"
difficulty: intermediate
status: active
prerequisites: []
tags: [project, javascript, issues]
created: "2026-07-21"
updated: "2026-07-21"
---

# Known Issues — JavaScript Runtime Toolkit

## Open Issues

| ID | Summary | Severity | Workaround | Status |
| --- | --- | --- | --- | --- |
| KI-001 | No package facade or CLI adapter yet | high | Import source modules inside `02-JavaScript/code` and run Vitest | open |
| KI-002 | Promise model lacks combinators and conformance suite evidence | medium | Use native `Promise` in production | accepted for lab |
| KI-003 | Reactive effects retain stale branch dependencies and cannot be disposed | medium | Keep effects short-lived and branch-stable | open |
| KI-004 | Timeout cannot stop operations that ignore `AbortSignal` | medium | Require cooperative mappers and external isolation for untrusted work | accepted constraint |
| KI-005 | Module graph reports first cycle point, not full cycle path | low | Reconstruct manually from fixture | open |

## Technical Debt

Add dedicated test files per module, package exports/declarations, CLI schema validation, clean-install CI, and packed-artifact smoke tests. Pay down contract and safety debt before adding new capabilities.

## Risk Rule

No issue above may be hidden by documentation or represented as native compatibility. Track delivery in [[02-JavaScript/projects/JavaScript Runtime Toolkit/Roadmap|Roadmap]] and investigations in [[02-JavaScript/projects/JavaScript Runtime Toolkit/Debug Diary|Debug Diary]].
