---
title: "URL Shortener API — Security"
aliases: []
track: 07-Backend
topic: url-shortener-api-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, backend, security, rest]
created: 2026-07-22
updated: 2026-07-22
---

# Security — URL Shortener API

## Focus

Open redirect, SSRF-via-target-URL, short code enumeration, and idempotency key guessing.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| `javascript:` target URL | XSS on redirect | Scheme allowlist http/https |
| Internal IP in target | SSRF if server fetches URL | Validate URL; redirect only—no server-side fetch in v1 |
| Short sequential codes | Enumeration | CSPRNG codes; rate limit creates |
| Open redirect chain | Phishing | Optional domain allowlist for enterprise mode |
| Idempotency key reuse across users | Cross-tenant bleed | Scope keys by authenticated owner when auth enabled |

## Controls

- Validation middleware before service layer—fail closed.
- Log redirects with correlation id, not full target in public errors.
- Rate limit `POST /v1/links` per IP or API key fixture.

## Related Documents

- [[07-Backend/projects/URL Shortener API/README|README]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Rate Limiting and Quotas|Rate Limiting and Quotas]]
- [[07-Backend/projects/Backend Service Toolkit/Security|Backend Service Toolkit Security]]
