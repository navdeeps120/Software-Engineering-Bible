---
title: "Backend Service Toolkit — Known Issues"
aliases: []
track: 07-Backend
topic: backend-service-toolkit-known-issues
difficulty: intermediate
status: active
prerequisites: []
tags: [project, backend, issues]
created: 2026-07-22
updated: 2026-07-22
---

# Known Issues — Backend Service Toolkit

## Open Issues

| ID | Summary | Severity | Workaround | Status |
| --- | --- | --- | --- | --- |
| KI-001 | Code lab tree [[07-Backend/code\|07-Backend/code]] not yet fully implemented | high | Follow module paths in docs; implement with test-first workflow | open |
| KI-002 | No package facade or `bst` CLI adapter yet | high | Import planned paths directly during development | open |
| KI-003 | Mini Express is pedagogical subset—not Express 4 parity | medium | Compare with real Express docs for edge cases | accepted for lab |
| KI-004 | Fake adapter has no durability across process restart | medium | Document handoff to Databases track for real engines | accepted for lab |
| KI-005 | In-process outbox poller not horizontally scalable | medium | Teach pattern only; link Message Queue Client Patterns | accepted for lab |
| KI-006 | OpenAPI smoke covers demo routes only—not full enterprise surface | low | Extend spec as modules land | open |

## Technical Debt

Add dedicated test modules per capability, public re-exports, CLI schema validation, clean-install CI, tarball smoke tests, demo server lifecycle tests, and benchmark fixtures. Pay auth and idempotency contract debt before new capabilities.

## Risk Rule

No issue above may be hidden or represented as production Express, OAuth, or database engine compatibility. Track delivery in [[07-Backend/projects/Backend Service Toolkit/Roadmap|Roadmap]] and investigations in [[07-Backend/projects/Backend Service Toolkit/Debug Diary|Debug Diary]].

## Related Documents

- [[07-Backend/projects/Backend Service Toolkit/Postmortem|Postmortem]]
- [[07-Backend/projects/Backend Service Toolkit/Roadmap|Roadmap]]
