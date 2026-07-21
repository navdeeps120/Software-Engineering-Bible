---
title: "JavaScript Runtime Toolkit — Security"
aliases: []
track: 02-JavaScript
topic: "javascript-runtime-toolkit-security"
difficulty: advanced
status: active
prerequisites: []
tags: [project, javascript, security]
created: "2026-07-21"
updated: "2026-07-21"
---

# Security — JavaScript Runtime Toolkit

## Trust Boundaries

```mermaid
flowchart LR
    Untrusted[CLI JSON input] --> Validator[Schema + resource limits]
    Validator --> Adapter[CLI adapter]
    Adapter --> Pure[In-process domain modules]
    Pure --> Output[Escaped JSON output]
```

## Threat Model

| Threat | Example | Control |
| --- | --- | --- |
| Code execution | input treated as JavaScript | parse JSON only; forbid `eval`, `Function`, VM |
| Resource exhaustion | huge graph or concurrency | byte, depth, node, edge, item, and concurrency caps |
| Prototype pollution | dangerous object keys | use validated records/Maps; reject unsafe keys where objects are built |
| Terminal injection | control characters in errors | JSON escaping and structured diagnostics |
| Supply-chain compromise | malicious dependency/update | lockfile, review, audit, provenance, minimal dependencies |

## Controls

The package needs no credentials, network access, filesystem writes, or authentication. Abort and timeout are cooperative controls, not isolation. The toolkit must never claim safe execution of arbitrary modules because it does not execute modules at all.

## Security Acceptance

- Negative tests cover malformed, oversized, deeply nested, cyclic, and aborted inputs.
- Dependency audit findings are triaged by exploitability, not blindly suppressed.
- Release token scope is publish-only and unavailable to pull-request jobs.
- Security limitations link to [[02-JavaScript/projects/JavaScript Runtime Toolkit/Known Issues|Known Issues]] and [[02-JavaScript/projects/JavaScript Runtime Toolkit/Postmortem|Postmortem]].
