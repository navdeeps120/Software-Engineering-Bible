---
title: "Express Clone — Security"
aliases: []
track: 07-Backend
topic: express-clone-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, backend, security, express]
created: 2026-07-22
updated: 2026-07-22
---

# Security — Express Clone

## Focus

Middleware ordering mistakes that bypass auth, error middleware leaking stack traces, unbounded body parsing in downstream middleware, and trusting `X-Forwarded-*` without proxy configuration.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| Auth middleware registered after public routes | Broken access control | Document ordering; test auth-before-handler invariant |
| Verbose error middleware in production | Information disclosure | Generic `500` + correlation id; detail only in logs |
| Missing body size limit before JSON parse | Memory exhaustion | Central limit middleware early in stack |
| Path `../` in mounted static route | Traversal if static added | Reject `..` segments at router boundary |
| `trust proxy` default true | IP spoofing for rate limits | Explicit opt-in; lab defaults to distrust |

## Controls

- Error envelope never includes `err.stack` when `NODE_ENV=production`.
- Lab tests bind `127.0.0.1` only.
- Document that clone is not hardened for internet exposure without [[07-Backend/10-Production-Services/Security Review Checklist for APIs|Security Review Checklist for APIs]].
- Link auth and rate-limit labs for production stacks.

## Related Documents

- [[07-Backend/projects/Express Clone/README|README]]
- [[07-Backend/02-Frameworks-and-Middleware/Middleware Pipeline and Error Middleware|Middleware Pipeline and Error Middleware]]
- [[07-Backend/projects/Backend Service Toolkit/Security|Backend Service Toolkit Security]]
