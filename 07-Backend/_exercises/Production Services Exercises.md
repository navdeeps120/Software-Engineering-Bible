---
title: Production Services Exercises
aliases: [Production Services Drills]
track: 07-Backend
topic: production-services-exercises
difficulty: advanced
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [exercises, backend, production, deployment, readiness]
created: 2026-07-22
updated: 2026-07-22
---

# Production Services Exercises

Synthesize configuration, feature flags, reverse-proxy trust, health and readiness semantics, deployment topologies, security review, and operational readiness for backend services.

## Linked Topic

- [[07-Backend/10-Production-Services/Configuration Feature Flags and Secrets for Services|Configuration Feature Flags and Secrets for Services]]
- [[07-Backend/10-Production-Services/Reverse Proxy Expectations and Trusted Headers|Reverse Proxy Expectations and Trusted Headers]]
- [[07-Backend/10-Production-Services/Health Dependencies and Readiness Semantics|Health Dependencies and Readiness Semantics]]
- [[07-Backend/10-Production-Services/Deployment Topologies for Single Services|Deployment Topologies for Single Services]]
- [[07-Backend/10-Production-Services/Security Review Checklist for APIs|Security Review Checklist for APIs]]
- [[07-Backend/10-Production-Services/Operational Readiness for Backend Services|Operational Readiness for Backend Services]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Contrast liveness, readiness, and startup probes for a service that depends on Postgres and Redis. What fails when each probe fails?

**Hint:** [[07-Backend/10-Production-Services/Health Dependencies and Readiness Semantics|Health Dependencies and Readiness Semantics]].

**Acceptance criteria:**

- [ ] Three probe types with k8s behavior
- [ ] Dependency check belongs in readiness not liveness
- [ ] Mermaid pod lifecycle during dependency outage

### Problem 2 — `intermediate`

**Prompt:** List twelve-factor config rules applied to Express services. Which settings must never be in repo vs env vs secret store?

**Hint:** [[07-Backend/10-Production-Services/Configuration Feature Flags and Secrets for Services|Configuration Feature Flags and Secrets for Services]].

**Acceptance criteria:**

- [ ] Config validation at startup (fail fast)
- [ ] Feature flag vs config distinction
- [ ] Secret rotation without redeploy where possible

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[07-Backend/code/README|code labs]], add `/health/live` (process up) and `/health/ready` (DB ping). Readiness returns 503 when DB unreachable.

**Acceptance criteria:**

- [ ] Live never checks external deps
- [ ] Ready timeout bounded (e.g. 2s)
- [ ] Tests mock DB down scenario

### Problem 2 — `intermediate`

**Prompt:** Implement config module loading env schema (Zod), validating on boot, and exposing typed `config` to services.

**Acceptance criteria:**

- [ ] Missing required env exits non-zero with clear message
- [ ] No `process.env` reads outside config module
- [ ] `.env.example` documents all keys

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Rolling deploy behind nginx: configure `trust proxy`, forward `X-Request-Id`, and preserve client IP for rate limiting.

**Hint:** [[07-Backend/10-Production-Services/Reverse Proxy Expectations and Trusted Headers|Reverse Proxy Expectations and Trusted Headers]].

**Acceptance criteria:**

- [ ] Trusted hop count documented
- [ ] Rate limiter uses real client IP
- [ ] Spoofing risk when proxy misconfigured

### Problem 2 — `advanced`

**Prompt:** Blue/green deploy with two versions behind load balancer. Design traffic shift, schema compatibility, and instant rollback.

**Hint:** [[07-Backend/10-Production-Services/Deployment Topologies for Single Services|Deployment Topologies for Single Services]].

**Acceptance criteria:**

- [ ] Both versions run during shift window
- [ ] Database backward-compatible migrations required
- [ ] Rollback trigger metrics defined

## Debug

### Problem 1 — `intermediate`

**Prompt:** Pods restart loop—liveness kills during slow startup. Fix probe timings and separate heavy init from request serving.

**Acceptance criteria:**

- [ ] `initialDelaySeconds` and `failureThreshold` tuned
- [ ] Startup probe added if needed
- [ ] Init migrations not in request path

### Problem 2 — `advanced`

**Prompt:** Production 403 for all users after deploy—feature flag default flipped. Trace flag evaluation order and safe defaults.

**Acceptance criteria:**

- [ ] Fail-closed vs fail-open documented per flag
- [ ] Flag state visible in `/service-info` (non-secret)
- [ ] Kill switch runbook

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Complete operational readiness checklist before launch: runbooks, on-call, dashboards, backup, security review, load test sign-off.

**Hint:** [[07-Backend/10-Production-Services/Operational Readiness for Backend Services|Operational Readiness for Backend Services]].

**Acceptance criteria:**

- [ ] Checklist ≥20 items with owners
- [ ] Links to dashboards and runbooks
- [ ] Go/no-go meeting agenda

### Problem 2 — `advanced`

**Prompt:** Run security review on public API using checklist: authN/Z, input limits, rate limits, headers, secrets, dependency audit. Prioritize findings P0–P2 with fixes.

**Hint:** [[07-Backend/10-Production-Services/Security Review Checklist for APIs|Security Review Checklist for APIs]].

**Acceptance criteria:**

- [ ] Every checklist section addressed
- [ ] P0 fixes block launch
- [ ] Cross-link to [[07-Backend/projects/Backend Service Toolkit/README|Backend Service Toolkit]]

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Health probes | Single `/health` | Live/ready split, bounded dependency checks |
| Config | `.env` in repo | Schema validation, secrets separation, flags |
| Launch readiness | "Ship it" | Checklist, security review, deploy topology, rollback |

## Related Notes

- [[07-Backend/code/README|code labs]]
- [[07-Backend/_interview/Production Services Interview.md|Production Services Interview]]
- [[07-Backend/README|Backend]]
- [[Career/README|Career]]
