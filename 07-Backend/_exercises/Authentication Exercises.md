---
title: Authentication Exercises
aliases: [Authentication Drills]
track: 07-Backend
topic: authentication-exercises
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [exercises, backend, authentication, jwt, oauth]
created: 2026-07-22
updated: 2026-07-22
---

# Authentication Exercises

Implement sessions, password hashing, JWT access tokens, refresh rotation, OAuth/OIDC application flows, and auth-server threat modeling—without conflating authentication with authorization.

## Linked Topic

- [[07-Backend/04-Authentication/Sessions Cookies and CSRF Boundaries|Sessions Cookies and CSRF Boundaries]]
- [[07-Backend/04-Authentication/Password Hashing and Credential Storage|Password Hashing and Credential Storage]]
- [[07-Backend/04-Authentication/JWT Access Tokens and Claims|JWT Access Tokens and Claims]]
- [[07-Backend/04-Authentication/Refresh Token Rotation|Refresh Token Rotation]]
- [[07-Backend/04-Authentication/OAuth2 and OIDC Application Flows|OAuth2 and OIDC Application Flows]]
- [[07-Backend/04-Authentication/Authentication Server Threat Model|Authentication Server Threat Model]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Define authentication vs authorization with three API examples (login, view own profile, admin delete user). Which checks belong in authN vs authZ middleware?

**Hint:** [[07-Backend/04-Authentication/Sessions Cookies and CSRF Boundaries|Sessions Cookies and CSRF Boundaries]].

**Acceptance criteria:**

- [ ] Clear definitions with failure responses (401 vs 403)
- [ ] Cross-link to [[07-Backend/05-Authorization-and-Tenancy/RBAC and Permission Modeling|RBAC and Permission Modeling]]
- [ ] Mermaid request flow through auth middleware

### Problem 2 — `intermediate`

**Prompt:** Compare session cookies (`HttpOnly`, `Secure`, `SameSite`) vs bearer JWT in `Authorization` header for a SPA and a mobile app.

**Acceptance criteria:**

- [ ] CSRF implications for cookie sessions
- [ ] Token storage risks on mobile
- [ ] Refresh strategy differs per client type

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[07-Backend/code/README|code labs]], implement `POST /login` with bcrypt password verify, server-side session store, and `POST /logout` that invalidates session.

**Acceptance criteria:**

- [ ] Passwords never logged; timing-safe compare
- [ ] Session cookie flags documented
- [ ] 401 on missing/invalid session for protected route

### Problem 2 — `intermediate`

**Prompt:** Add JWT access tokens (15m) + refresh token rotation with reuse detection. Document revocation on password change.

**Hint:** [[07-Backend/04-Authentication/Refresh Token Rotation|Refresh Token Rotation]].

**Acceptance criteria:**

- [ ] Refresh token stored hashed server-side
- [ ] Reused refresh token revokes family
- [ ] Tests cover rotation and reuse attack

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Auth middleware calls database on every request to validate session. Add short-lived JWT with session version claim and periodic DB check.

**Acceptance criteria:**

- [ ] Invalidation via session version bump
- [ ] Latency improvement estimated
- [ ] Trade-off: stale revocation window documented

### Problem 2 — `advanced`

**Prompt:** Integrate OIDC authorization code flow with PKCE for SPA login. Map IdP claims to local user record without trusting unverified JWT from client.

**Hint:** [[07-Backend/04-Authentication/OAuth2 and OIDC Application Flows|OAuth2 and OIDC Application Flows]].

**Acceptance criteria:**

- [ ] Server-side token exchange
- [ ] State/nonce validation
- [ ] Handoff to [[18-Security/README|Security]] for deep threat modeling

## Debug

### Problem 1 — `intermediate`

**Prompt:** Users logged out randomly at noon UTC. Trace session TTL, cookie `Max-Age`, and server clock skew.

**Acceptance criteria:**

- [ ] Root cause identified (TTL vs cron vs timezone)
- [ ] Fix with explicit expiry semantics
- [ ] Monitoring for session validation failures

### Problem 2 — `advanced`

**Prompt:** Attacker replays stolen refresh tokens from multiple IPs. Design detection, step-up auth, and family revocation alerts.

**Hint:** [[07-Backend/04-Authentication/Authentication Server Threat Model|Authentication Server Threat Model]].

**Acceptance criteria:**

- [ ] Reuse detection triggers alert
- [ ] User notification flow
- [ ] Rate limit on refresh endpoint

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Migrate from session-only to JWT for mobile clients while web keeps cookies. Dual-stack plan with shared user store and unified logout.

**Acceptance criteria:**

- [ ] Phased rollout with feature flag
- [ ] Logout invalidates all device tokens
- [ ] Rollback without password reset storm

### Problem 2 — `advanced`

**Prompt:** Enterprise customer demands SAML; product uses OIDC. Draft bridge architecture, session establishment, and audit log fields for auth events.

**Acceptance criteria:**

- [ ] Identity federation diagram
- [ ] Required audit fields (subject, issuer, amr, ip)
- [ ] SLA for IdP outage degradation mode

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| AuthN vs authZ | Uses 401 and 403 interchangeably | Precise separation with middleware placement |
| Implementation | Plaintext passwords or JWT in localStorage sermon | bcrypt, rotation, PKCE, hashed refresh store |
| Production | Single auth mode for all clients | Client-appropriate flows, reuse detection, federation plan |

## Related Notes

- [[07-Backend/code/README|code labs]]
- [[07-Backend/_interview/Authentication Interview.md|Authentication Interview]]
- [[07-Backend/README|Backend]]
- [[Career/README|Career]]
