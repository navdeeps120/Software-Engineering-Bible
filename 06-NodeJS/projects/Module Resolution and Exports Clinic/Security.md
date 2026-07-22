---
title: "Module Resolution and Exports Clinic — Security"
aliases: []
track: 06-NodeJS
topic: module-resolution-exports-clinic-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, nodejs, security]
created: 2026-07-22
updated: 2026-07-22
---

# Security — Module Resolution and Exports Clinic

## Focus

Prototype pollution via manifest keys, path escape through export targets, and false confidence that simulation equals Node core behavior for supply-chain decisions.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| `__proto__` in package.json | Pollution | Safe parse; reject dangerous keys |
| Export target `../../../../etc/passwd` | Escape | Normalize and jail to fixture root |
| Typo-squat package name in fixture loader | Confusion in demos | Prefix fixtures `@fixture/` |
| Treating warning as security audit | False assurance | Document non-goals; link npm audit |

## Controls

- Fixture FS root enforced on every resolved path.
- No install scripts, lifecycle hooks, or network fetches.
- Supply-chain policy for real projects: [[06-NodeJS/projects/Node Runtime Toolkit/ADR/ADR-005 Supply-Chain Policy|ADR-005]].

## Related Documents

- [[06-NodeJS/projects/Module Resolution and Exports Clinic/README|README]]
- [[06-NodeJS/09-Security-and-Supply-Chain/Prototype Pollution at the Host Boundary|Prototype Pollution at the Host Boundary]]
