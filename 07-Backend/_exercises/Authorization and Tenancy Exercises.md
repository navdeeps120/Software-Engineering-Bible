---
title: Authorization and Tenancy Exercises
aliases: [Authorization and Tenancy Drills]
track: 07-Backend
topic: authorization-and-tenancy-exercises
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [exercises, backend, authorization, rbac, tenancy]
created: 2026-07-22
updated: 2026-07-22
---

# Authorization and Tenancy Exercises

Model RBAC and ABAC, enforce resource ownership, isolate multi-tenant data at the app boundary, and apply least privilege for service identities.

## Linked Topic

- [[07-Backend/05-Authorization-and-Tenancy/RBAC and Permission Modeling|RBAC and Permission Modeling]]
- [[07-Backend/05-Authorization-and-Tenancy/ABAC and Policy Decision Points Concepts|ABAC and Policy Decision Points Concepts]]
- [[07-Backend/05-Authorization-and-Tenancy/Resource Ownership Checks|Resource Ownership Checks]]
- [[07-Backend/05-Authorization-and-Tenancy/Multi-Tenant Isolation at the App Boundary|Multi-Tenant Isolation at the App Boundary]]
- [[07-Backend/05-Authorization-and-Tenancy/Least Privilege for Service Identities|Least Privilege for Service Identities]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Design roles (`viewer`, `editor`, `admin`) for a document API. Map HTTP methods to permissions and decide where checks run (middleware vs service).

**Hint:** [[07-Backend/05-Authorization-and-Tenancy/RBAC and Permission Modeling|RBAC and Permission Modeling]].

**Acceptance criteria:**

- [ ] Permission matrix (role × action)
- [ ] 403 vs 404 policy for cross-tenant access documented
- [ ] Separation from [[07-Backend/04-Authentication/JWT Access Tokens and Claims|Authentication]] checks

### Problem 2 — `intermediate`

**Prompt:** When does RBAC fail and ABAC help? Give three attributes (owner, department, classification) and example policies.

**Hint:** [[07-Backend/05-Authorization-and-Tenancy/ABAC and Policy Decision Points Concepts|ABAC and Policy Decision Points Concepts]].

**Acceptance criteria:**

- [ ] Policy decision point vs enforcement point diagram
- [ ] Deny-overrides vs permit rules stated
- [ ] Handoff to [[09-System-Design/README|System Design]] for org-scale PDP

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[07-Backend/code/README|code labs]], add `requirePermission('documents:read')` middleware and apply to `GET /documents/:id`.

**Acceptance criteria:**

- [ ] Loads permissions from authenticated user context
- [ ] Returns 403 with stable error code
- [ ] Tests cover missing permission and happy path

### Problem 2 — `intermediate`

**Prompt:** Enforce tenant isolation: every query includes `tenantId` from JWT claim; repository rejects cross-tenant IDs even if UUID guessed.

**Hint:** [[07-Backend/05-Authorization-and-Tenancy/Multi-Tenant Isolation at the App Boundary|Multi-Tenant Isolation at the App Boundary]].

**Acceptance criteria:**

- [ ] Tenant injected at repository boundary, not optional param
- [ ] Integration test proves tenant A cannot read tenant B resource
- [ ] Index strategy note for `(tenantId, id)`

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Authorization checks fan out to DB on every request. Cache role assignments with TTL and invalidation on role change event.

**Acceptance criteria:**

- [ ] Cache key scoped by user + tenant
- [ ] Invalidation on admin role update
- [ ] Stale cache window documented

### Problem 2 — `advanced`

**Prompt:** Service account `billing-worker` needs read invoices, write ledger—nothing else. Design scoped credentials and route-level guard.

**Hint:** [[07-Backend/05-Authorization-and-Tenancy/Least Privilege for Service Identities|Least Privilege for Service Identities]].

**Acceptance criteria:**

- [ ] Machine identity separate from user JWT
- [ ] mTLS or signed service token option
- [ ] Audit log for service actions

## Debug

### Problem 1 — `intermediate`

**Prompt:** User reports "access denied" but role shows admin in UI. Trace stale JWT claims vs DB roles; fix with versioned permissions claim.

**Acceptance criteria:**

- [ ] Root cause: token issued before role change
- [ ] Fix: `permVersion` claim or short access token TTL
- [ ] Support playbook for forced re-login

### Problem 2 — `advanced`

**Prompt:** IDOR vulnerability: `GET /users/:id` returns any user. Audit all routes for ownership checks; add regression test generator pattern.

**Hint:** [[07-Backend/05-Authorization-and-Tenancy/Resource Ownership Checks|Resource Ownership Checks]].

**Acceptance criteria:**

- [ ] Checklist applied to resource routes
- [ ] Prefer 404 for cross-tenant enumeration
- [ ] Static analysis or test template for new routes

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Launch multi-tenant SaaS on shared schema. Define tenant provisioning, default roles, and data export isolation for GDPR requests.

**Acceptance criteria:**

- [ ] Tenant creation workflow with admin bootstrap
- [ ] Export scoped strictly to tenant
- [ ] Runbook for tenant offboarding

### Problem 2 — `advanced`

**Prompt:** Enterprise requires custom ABAC policies per customer without redeploying. Design policy storage, evaluation cache, and safe DSL boundaries.

**Acceptance criteria:**

- [ ] No arbitrary code execution in policies
- [ ] Evaluation timeout and complexity limits
- [ ] Canary rollout for policy changes

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Model | Hard-coded `if (user.isAdmin)` | RBAC/ABAC with enforcement points |
| Tenancy | tenantId optional query param | Mandatory repository scoping, IDOR tests |
| Production | Same JWT for users and workers | Least-privilege service identities, policy DSL safety |

## Related Notes

- [[07-Backend/code/README|code labs]]
- [[07-Backend/_interview/Authorization and Tenancy Interview.md|Authorization and Tenancy Interview]]
- [[07-Backend/README|Backend]]
- [[Career/README|Career]]
