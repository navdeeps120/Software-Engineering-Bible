---
title: "Graceful Shutdown Harness — Security"
aliases: []
track: 06-NodeJS
topic: graceful-shutdown-harness-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, nodejs, security]
created: 2026-07-22
updated: 2026-07-22
---

# Security — Graceful Shutdown Harness

## Focus

Teardown hooks that exfiltrate secrets under panic, infinite hooks delaying forced exit, and health endpoints leaking internal drain state to attackers.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| Hook logs env on error | Secret leak | Redact env in default logger |
| Malicious hook never resolves | Hang until hard timeout | Per-hook timeout; global hard cap |
| Readiness exposes stack traces | Info disclosure | Generic 503 body during drain |
| SIGINT loop from untrusted terminal | DoS | Idempotent drain; ignore after forced phase |

## Controls

- Hook names logged, not hook bodies.
- Hard timeout always wins—document operational expectation for orchestrators.
- Readiness route returns minimal JSON `{ ready: boolean }`.

## Related Documents

- [[06-NodeJS/projects/Graceful Shutdown Harness/README|README]]
- [[06-NodeJS/09-Security-and-Supply-Chain/Secrets Env Injection and Least Privilege|Secrets Env Injection and Least Privilege]]
