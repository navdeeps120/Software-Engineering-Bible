---
title: "Isolation Anomaly Clinic — Security"
aliases: []
track: 08-Databases
topic: isolation-anomaly-clinic-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, databases, security]
created: 2026-07-22
updated: 2026-07-22
---

# Security — Isolation Anomaly Clinic

## Focus

Schedule injection causing unbounded lock growth, resource exhaustion via deep transaction chains, and leaking fixture data labeled as PII in anomaly reports.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| 10k-step schedule | CPU hang | Max steps per run |
| Lock bombing | Memory exhaustion | Max locks + max txns |
| Crafted wait-for graph | Stack overflow in DFS | Edge cap + iterative cycle detect |
| Sensitive fixture values in JSON output | Data leak | Redact `value` fields in public report mode |
| Confusion with production isolation | Wrong app design | Banner: educational simplification |

## Controls

- Schedule parser rejects unknown ops and nested expressions.
- Default report mode shows keys only, not tuple payloads.
- Engine runs in-process only—no SQL wire protocol attack surface.

## Related Documents

- [[08-Databases/projects/Isolation Anomaly Clinic/README|README]]
- [[08-Databases/05-Transactions-and-Isolation/Isolation Levels and Product Defaults|Isolation Levels and Product Defaults]]
