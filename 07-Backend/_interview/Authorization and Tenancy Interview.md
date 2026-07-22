---
title: Authorization and Tenancy Interview
aliases: [Authorization and Tenancy Interview Questions]
track: 07-Backend
topic: authorization-and-tenancy-interview
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/05-Authorization-and-Tenancy/RBAC and Permission Modeling|RBAC and Permission Modeling]]"]
tags: [interviews, backend, authorization, rbac, tenancy]
created: 2026-07-22
updated: 2026-07-22
---

# Authorization and Tenancy Interview

## Linked Topic

- [[07-Backend/05-Authorization-and-Tenancy/RBAC and Permission Modeling|RBAC and Permission Modeling]]
- [[07-Backend/05-Authorization-and-Tenancy/ABAC and Policy Decision Points Concepts|ABAC and Policy Decision Points Concepts]]
- [[07-Backend/05-Authorization-and-Tenancy/Resource Ownership Checks|Resource Ownership Checks]]
- [[07-Backend/05-Authorization-and-Tenancy/Multi-Tenant Isolation at the App Boundary|Multi-Tenant Isolation at the App Boundary]]
- [[07-Backend/05-Authorization-and-Tenancy/Least Privilege for Service Identities|Least Privilege for Service Identities]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw enforcement point (middleware vs service vs repository).
3. State 403 vs 404 policy for cross-tenant access.
4. Close with IDOR prevention and audit requirements.

## Contracts

1. Design RBAC for document API — roles, permissions, enforcement layer.

   - Permission matrix
   - Where checks cannot be skipped
   - Separation from authN

2. When does RBAC fail and ABAC help?

   - Attribute examples (owner, dept, classification)
   - PDP vs PEP
   - Policy evaluation cost

## Tenancy

3. Enforce multi-tenant isolation at repository boundary.

   - Mandatory `tenantId` from JWT
   - No optional query param
   - Index and query shape

4. 404 vs 403 when tenant B user guesses tenant A resource ID.

   - Enumeration trade-offs
   - Consistent product policy
   - Audit log fields

## Coding

5. Implement `requirePermission('invoices:write')` middleware.

   - Load permissions from context
   - Stable error code
   - Test deny path

6. Fix IDOR in `GET /users/:id` — ownership check pattern.

   - Admin override path
   - Regression test template for new routes
   - Code review checklist

## Production Judgment

7. UI shows admin but API returns 403 — stale JWT claims vs DB roles.

   - Permission version claim
   - Short access token TTL
   - Support forced refresh

8. Service account `billing-worker` over-privileged — least privilege redesign.

   - Scoped machine credentials
   - Route-level guards
   - Audit service actions

## Staff-Level Selection

9. Launch multi-tenant SaaS — provisioning, default roles, GDPR export.

   - Tenant bootstrap workflow
   - Data export isolation
   - Offboarding runbook

10. Customer-specific ABAC policies without redeploy — safe DSL design.

    - No arbitrary code execution
    - Evaluation timeout
    - Canary policy rollout

11. Org-wide authorization library — prevent `if (user.isAdmin)` drift.

    - Required patterns for resource routes
    - Static analysis or codegen
    - Exception process

12. Cross-tenant data leak incident — response and prevention.

    - Containment, notification, root cause
    - Mandatory repository scoping tests
    - Postmortem action items

13. Shared schema multi-tenancy vs DB-per-tenant — authorization implications.

    - Blast radius
    - Connection routing
    - Reporting gaps

14. Fine-grained permissions explode combinatorially — modeling strategy.

    - Resource:action naming
    - Role bundles vs direct grants
    - Cache invalidation on role change

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Model | Hard-coded role checks | RBAC/ABAC with explicit enforcement points |
| Tenancy | Optional tenant filter | Mandatory scoping, IDOR tests, 404 policy |
| Production | Human admin bypass everywhere | Service identities, policy DSL safety, incident playbook |

## Related Notes

- [[Career/README|Career]]
- [[07-Backend/_exercises/Authorization and Tenancy Exercises.md|Authorization and Tenancy Exercises]]
- [[07-Backend/code/README|code labs]]
- [[07-Backend/README|Backend]]
