---
title: Orientation Exercises
aliases: [Orientation Drills]
track: 07-Backend
topic: orientation-exercises
difficulty: beginner
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [exercises, backend, orientation]
created: 2026-07-22
updated: 2026-07-22
---

# Orientation Exercises

Separate backend product concerns from the Node host, map service layering and hexagonal boundaries, and reason about production failure modes before building HTTP APIs.

## Linked Topic

- [[07-Backend/00-Orientation/Why Backend Services Exist|Why Backend Services Exist]]
- [[07-Backend/00-Orientation/Node Host vs Backend Product Boundary|Node Host vs Backend Product Boundary]]
- [[07-Backend/00-Orientation/Service Layering and Hexagonal Intuition|Service Layering and Hexagonal Intuition]]
- [[07-Backend/00-Orientation/Backend Failure Modes in Production|Backend Failure Modes in Production]]
- [[07-Backend/00-Orientation/WinterCG and Multi-Runtime API Portability|WinterCG and Multi-Runtime API Portability]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Draw a Mermaid diagram showing how a backend service sits above the Node host. Label which layer owns HTTP routing, business rules, database access, and socket I/O.

**Hint:** Start from [[07-Backend/00-Orientation/Node Host vs Backend Product Boundary|Node Host vs Backend Product Boundary]].

**Acceptance criteria:**

- [ ] Four layers distinguished with call direction arrows
- [ ] Handoff to [[06-NodeJS/README|Node.js]] for host I/O explicitly noted
- [ ] Cross-link to [[02-JavaScript/README|JavaScript]] for language semantics

### Problem 2 — `intermediate`

**Prompt:** List five backend failure modes that are *not* fixed by "use async/await." For each, name the product symptom and the layer where the fix belongs.

**Hint:** See [[07-Backend/00-Orientation/Backend Failure Modes in Production|Backend Failure Modes in Production]].

**Acceptance criteria:**

- [ ] At least two auth/tenancy failures included
- [ ] At least one data consistency failure included
- [ ] Table maps symptom → root cause → owning module

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[07-Backend/code/README|code labs]], scaffold a `service-info` endpoint on a minimal Express app that returns service name, version, and runtime metadata—without leaking secrets from `process.env`.

**Acceptance criteria:**

- [ ] `GET /service-info` returns JSON with version and Node version
- [ ] Env allowlist documented; no raw `process.env` dump
- [ ] README cross-link added to code labs index

### Problem 2 — `intermediate`

**Prompt:** Implement a hexagonal sketch: HTTP adapter → application service → in-memory repository port. Swap the repository in tests without touching route handlers.

**Hint:** Mirror [[07-Backend/00-Orientation/Service Layering and Hexagonal Intuition|Service Layering and Hexagonal Intuition]].

**Acceptance criteria:**

- [ ] Port interface defined; adapter implements it
- [ ] Route handler calls service, not repository directly
- [ ] Unit test uses fake repository; integration test uses HTTP client

## Optimize

### Problem 1 — `intermediate`

**Prompt:** A team puts all business logic in route handlers "for speed." Measure refactor cost: count handlers, extract one domain service, and estimate regression test surface.

**Acceptance criteria:**

- [ ] Before/after dependency diagram
- [ ] Two measurable benefits (testability, reuse) with evidence
- [ ] Migration strategy without big-bang rewrite

### Problem 2 — `advanced`

**Prompt:** Evaluate deploying the same TypeScript service to Node LTS and a WinterCG edge worker. Define a portable API surface checklist and forbidden imports.

**Hint:** Use [[07-Backend/00-Orientation/WinterCG and Multi-Runtime API Portability|WinterCG and Multi-Runtime API Portability]].

**Acceptance criteria:**

- [ ] Allow/deny list covers fetch, crypto, storage, timers
- [ ] CI gate names smoke tests and failure policy
- [ ] Rollback path if Node-only API slips in

## Debug

### Problem 1 — `intermediate`

**Prompt:** On-call reports "backend is slow" but Node event-loop delay is normal. Write a debug brief distinguishing host saturation from product-layer issues (N+1 queries, missing cache, auth fan-out).

**Acceptance criteria:**

- [ ] Checklist separates host metrics from RED API metrics
- [ ] Three product-layer hypotheses with validation steps
- [ ] Links to [[07-Backend/09-API-Observability-and-Testing/RED Metrics and SLIs for APIs|RED Metrics and SLIs for APIs]]

### Problem 2 — `advanced`

**Prompt:** Two microservices share a database "temporarily." Symptoms: subtle tenancy leaks and deadlocks. Build a migration brief to enforce app-boundary isolation.

**Acceptance criteria:**

- [ ] Root cause tied to missing ownership checks
- [ ] Phased cutover with dual-write risks named
- [ ] Success criteria for per-service repositories

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Leadership asks why backend engineers need Node literacy if they use Express. Draft a one-page boundary doc: what Backend owns vs what Node owns vs what Databases owns.

**Acceptance criteria:**

- [ ] Scope table with handoff links to [[06-NodeJS/README|Node.js]] and [[08-Databases/README|Databases]]
- [ ] Three concrete incident examples crossing boundaries
- [ ] Hiring bar bullets aligned with exercises

### Problem 2 — `advanced`

**Prompt:** Platform team proposes "framework-free HTTP" for all new services. Assess velocity, security, and observability trade-offs; recommend a default with escape hatches.

**Acceptance criteria:**

- [ ] Comparison of raw `http` vs Express/Fastify for product APIs
- [ ] Non-negotiable middleware list (auth, validation, logging)
- [ ] Mermaid adoption timeline with pilot criteria

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Boundaries | "Backend = APIs" | Separates host, product service, data engines with handoffs |
| Implementation | Monolithic route handlers | Hexagonal ports/adapters with test doubles |
| Production | Blames Node for product bugs | Failure-mode taxonomy, metrics separation, boundary RFC |

## Related Notes

- [[07-Backend/code/README|code labs]]
- [[07-Backend/_interview/Orientation Interview.md|Orientation Interview]]
- [[07-Backend/README|Backend]]
- [[Career/README|Career]]
