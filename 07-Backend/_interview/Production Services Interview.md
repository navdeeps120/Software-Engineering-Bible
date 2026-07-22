---
title: Production Services Interview
aliases: [Production Services Interview Questions]
track: 07-Backend
topic: production-services-interview
difficulty: advanced
status: active
prerequisites: ["[[07-Backend/10-Production-Services/Operational Readiness for Backend Services|Operational Readiness for Backend Services]]"]
tags: [interviews, backend, production, deployment, readiness]
created: 2026-07-22
updated: 2026-07-22
---

# Production Services Interview

## Linked Topic

- [[07-Backend/10-Production-Services/Configuration Feature Flags and Secrets for Services|Configuration Feature Flags and Secrets for Services]]
- [[07-Backend/10-Production-Services/Reverse Proxy Expectations and Trusted Headers|Reverse Proxy Expectations and Trusted Headers]]
- [[07-Backend/10-Production-Services/Health Dependencies and Readiness Semantics|Health Dependencies and Readiness Semantics]]
- [[07-Backend/10-Production-Services/Deployment Topologies for Single Services|Deployment Topologies for Single Services]]
- [[07-Backend/10-Production-Services/Security Review Checklist for APIs|Security Review Checklist for APIs]]
- [[07-Backend/10-Production-Services/Operational Readiness for Backend Services|Operational Readiness for Backend Services]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Split liveness vs readiness before dependency checks.
3. Name config validation, secrets, and feature-flag defaults.
4. Close with launch checklist and rollback criteria.

## Contracts

1. Contrast liveness, readiness, and startup probes.

   - k8s behavior on each failure
   - External deps in readiness only
   - Long init vs request serving

2. Twelve-factor config for Express services — env vs secrets vs flags.

   - Fail fast validation at boot
   - No secrets in repo
   - Flag fail-open vs fail-closed policy

## Deployment and Proxy

3. Rolling deploy behind nginx — trust proxy and client IP.

   - `trust proxy` hop count
   - Rate limiter IP source
   - Header spoofing without proxy

4. Blue/green deploy with shared database — schema compatibility rules.

   - Expand-contract migrations
   - Traffic shift and rollback metrics
   - Two versions concurrently

## Health and Config

5. Implement `/health/live` and `/health/ready` with bounded DB check.

   - Live never calls external deps
   - Ready timeout
   - 503 semantics for orchestrator

6. Config module validates env with schema — boot failure messages.

   - Single entry to configuration
   - `.env.example` completeness
   - Typed access in services

## Production Judgment

7. Pods restart loop — liveness kills during slow startup.

   - Startup probe tuning
   - Migrations not in request path
   - initialDelay vs failureThreshold

8. All users 403 after deploy — feature flag default regression.

   - Kill switch runbook
   - Flag visibility for ops
   - Safe defaults documented

9. Pre-launch operational readiness — minimum checklist items.

   - Runbooks, dashboards, on-call
   - Load test sign-off
   - Security review P0/P1

## Staff-Level Selection

10. Org launch gate for new public APIs — mandatory artifacts.

    - OpenAPI, SLO, runbooks, DR
    - Review board composition
    - Exception path for experiments

11. Security review checklist — prioritize findings for API launch.

    - authN/Z, input limits, rate limits, headers
    - Dependency audit
    - P0 blocks ship

12. Single service deployment topologies — when blue/green vs rolling.

    - Cost vs rollback speed
    - Stateful dependencies
    - Connection drain requirements

13. Secrets rotation without downtime — backend responsibilities.

    - Dual-secret acceptance window
    - Config reload vs restart
    - Handoff to DevOps vault

14. Post-incident: readiness checked Redis but not Postgres — fix standards.

    - Dependency completeness template
    - False healthy incident cost
    - Automated readiness contract tests

15. Backend Service Toolkit as platform — adoption and versioning strategy.

    - Shared middleware package semver
    - Breaking change comms
    - Link to [[07-Backend/projects/Backend Service Toolkit/README|Backend Service Toolkit]]

16. Decommission legacy API version — operational steps.

    - Traffic telemetry gate
    - Customer comms timeline
    - Redirect vs hard 410 policy

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Health | One `/health` endpoint | Live/ready split, bounded checks |
| Config | `.env` committed | Schema validation, secrets, flag policy |
| Launch | Ship on green CI | Readiness checklist, security review, rollback |

## Related Notes

- [[Career/README|Career]]
- [[07-Backend/_exercises/Production Services Exercises.md|Production Services Exercises]]
- [[07-Backend/code/README|code labs]]
- [[07-Backend/README|Backend]]
