---
title: "Authentication Server — Security"
aliases: []
track: 07-Backend
topic: authentication-server-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, backend, security, auth]
created: 2026-07-22
updated: 2026-07-22
---

# Security — Authentication Server

## Threat Model Summary

Aligns with [[07-Backend/04-Authentication/Authentication Server Threat Model|Authentication Server Threat Model]]. Lab scope covers credential theft, token replay, session fixation precursors, and privilege escalation via missing RBAC—not nation-state IdP attacks.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| Credential stuffing | Account takeover | Rate limit login; generic errors |
| Refresh token theft | Persistent access | Rotation + reuse detection |
| JWT alg none / key confusion | Forgery | Fixed alg; key from env; verify tests |
| Session fixation | Hijack session | New session id on login |
| CSRF on cookie auth | State change as victim | SameSite + CSRF token on mutations |
| Timing on user lookup | Enumeration | Consistent response path in tests |

## Controls

- bcrypt with configurable cost; document production cost separately.
- httpOnly cookies; `Secure` flag in production config.
- JWT access TTL ≤ 15m in lab defaults; refresh TTL ≤ 7d.
- RBAC enforced at middleware—not only in route handlers.
- Secrets from environment; redact in structured logs.

## Out of Scope

OAuth/OIDC broker, hardware keys, WebAuthn, and cross-tenant federation → [[18-Security/README|Security]] and [[09-System-Design/README|System Design]].

## Related Documents

- [[07-Backend/projects/Authentication Server/README|README]]
- [[07-Backend/projects/Backend Service Toolkit/ADR/ADR-002 Auth Default Sessions vs JWT|ADR-002]]
- [[07-Backend/10-Production-Services/Security Review Checklist for APIs|Security Review Checklist for APIs]]
