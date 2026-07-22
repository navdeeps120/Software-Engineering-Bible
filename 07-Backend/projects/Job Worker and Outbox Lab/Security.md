---
title: "Job Worker and Outbox Lab — Security"
aliases: []
track: 07-Backend
topic: job-worker-outbox-lab-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, backend, security, jobs, outbox]
created: 2026-07-22
updated: 2026-07-22
---

# Security — Job Worker and Outbox Lab

## Focus

Unsafe job deserialization, secret leakage in outbox payloads, and unauthorized dead-letter replay.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| Arbitrary handler from payload type | RCE if dynamic eval | Typed JobRegistry only |
| Secrets in outbox JSON | Exposure at rest | Reference ids; load secrets in handler |
| Admin replay dead letters | Privilege abuse | RBAC on replay API when exposed |
| Worker infinite retry on poison message | DoS | Max attempts + DEAD state |

## Controls

- Payload schema validated before enqueue at API edge.
- Handlers run with same privilege as worker process—document least privilege.
- Dead-letter rows redacted in test logs.

## Related Documents

- [[07-Backend/projects/Job Worker and Outbox Lab/README|README]]
- [[07-Backend/05-Authorization-and-Tenancy/Least Privilege for Service Identities|Least Privilege for Service Identities]]
- [[07-Backend/projects/Backend Service Toolkit/Security|Backend Service Toolkit Security]]
