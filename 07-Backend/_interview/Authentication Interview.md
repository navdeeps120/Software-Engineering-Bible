---
title: Authentication Interview
aliases: [Authentication Interview Questions]
track: 07-Backend
topic: authentication-interview
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/04-Authentication/Sessions Cookies and CSRF Boundaries|Sessions Cookies and CSRF Boundaries]]"]
tags: [interviews, backend, authentication, jwt, oauth]
created: 2026-07-22
updated: 2026-07-22
---

# Authentication Interview

## Linked Topic

- [[07-Backend/04-Authentication/Sessions Cookies and CSRF Boundaries|Sessions Cookies and CSRF Boundaries]]
- [[07-Backend/04-Authentication/Password Hashing and Credential Storage|Password Hashing and Credential Storage]]
- [[07-Backend/04-Authentication/JWT Access Tokens and Claims|JWT Access Tokens and Claims]]
- [[07-Backend/04-Authentication/Refresh Token Rotation|Refresh Token Rotation]]
- [[07-Backend/04-Authentication/OAuth2 and OIDC Application Flows|OAuth2 and OIDC Application Flows]]
- [[07-Backend/04-Authentication/Authentication Server Threat Model|Authentication Server Threat Model]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Separate authentication (401) from authorization (403) in every scenario.
3. Name cookie flags, token lifetimes, and rotation semantics.
4. Close with threat model and incident response.

## Contracts

1. Define authentication vs authorization with API examples.

   - Login vs permission check
   - 401 vs 403 usage
   - Middleware ordering

2. Session cookie contract for browser SPA — flags and CSRF boundary.

   - HttpOnly, Secure, SameSite
   - CSRF token or double-submit
   - Session fixation on login

## Tokens and Storage

3. Compare session cookies vs bearer JWT for web and mobile.

   - Storage risks (XSS, localStorage)
   - Revocation strategies
   - Refresh token placement

4. Explain refresh token rotation and reuse detection.

   - Hashed storage server-side
   - Family revocation on reuse
   - Clock skew and expiry

## OAuth and OIDC

5. Walk authorization code flow with PKCE for public SPA client.

   - Server-side token exchange
   - State and nonce validation
   - Never trust client-only IdP JWT

6. Map OIDC claims to local user — provisioning and linking.

   - `sub`, `iss` uniqueness
   - Email unverified risks
   - Account takeover scenarios

## Coding

7. Implement login with bcrypt and session regeneration on success.

   - Timing-safe compare
   - No password in logs
   - Logout invalidates server session

8. Review JWT middleware that skips signature verify in dev — production risk.

   - alg none attack
   - Key rotation and `kid`
   - Test with tampered token

## Production Judgment

9. Users logged out at noon UTC — triage session TTL and cron.

   - Absolute vs sliding expiry
   - Timezone bugs
   - Monitoring session validation rate

10. Stolen refresh token used from two IPs — response playbook.

    - Reuse detection alert
    - Force re-auth scope
    - User notification template

## Staff-Level Selection

11. Migrate web sessions to JWT for mobile while keeping cookies for web.

    - Dual-stack auth architecture
    - Unified logout across devices
    - Feature flag rollout

12. Enterprise demands SAML; product is OIDC — bridge design.

    - Session establishment at BFF
    - Audit fields required
    - IdP outage degradation

13. Auth server threat model — top five threats and controls.

    - Credential stuffing, token theft, IdP misconfig
    - Rate limits and MFA escalation
    - Handoff to [[18-Security/README|Security]]

14. Password reset flow — token entropy, expiry, and enumeration defense.

    - Same response for unknown email
    - Single-use tokens
    - Invalidate sessions on reset

15. Standardize auth libraries org-wide — ban list and approved patterns.

    - No custom crypto
    - Required rotation and hashing params
    - Security review gate for auth changes

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| AuthN vs authZ | Conflates 401/403 | Precise middleware and response policy |
| Tokens | JWT in localStorage sermon | Rotation, reuse detection, client-appropriate storage |
| Threats | "Use HTTPS" | Stuffing, fixation, IdP trust, audit playbook |

## Related Notes

- [[Career/README|Career]]
- [[07-Backend/_exercises/Authentication Exercises.md|Authentication Exercises]]
- [[07-Backend/code/README|code labs]]
- [[07-Backend/README|Backend]]
