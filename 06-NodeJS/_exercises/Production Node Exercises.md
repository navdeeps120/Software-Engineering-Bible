---
title: Production Node Exercises
aliases: [Production Node Drills]
track: 06-NodeJS
topic: production-node-exercises
difficulty: advanced
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [exercises, nodejs, production, operations, twelve-factor]
created: 2026-07-22
updated: 2026-07-22
---

# Production Node Exercises

Synthesize graceful shutdown, twelve-factor configuration, structured logging, health probes, integration testing, and operational readiness checklists into shippable Node services.

## Linked Topic

- [[06-NodeJS/10-Production-Node/Graceful Shutdown and Drain|Graceful Shutdown and Drain]]
- [[06-NodeJS/10-Production-Node/Configuration Twelve-Factor on Node|Configuration Twelve-Factor on Node]]
- [[06-NodeJS/10-Production-Node/Structured Logging and Correlation IDs|Structured Logging and Correlation IDs]]
- [[06-NodeJS/10-Production-Node/Health Readiness and Liveness Hooks|Health Readiness and Liveness Hooks]]
- [[06-NodeJS/10-Production-Node/Testing Node Servers Integration and Contract Tests|Testing Node Servers Integration and Contract Tests]]
- [[06-NodeJS/10-Production-Node/Operational Readiness Checklist for Node Processes|Operational Readiness Checklist for Node Processes]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Distinguish liveness, readiness, and startup probes for a Node HTTP service with DB dependency. What should each return during graceful shutdown?

**Hint:** [[06-NodeJS/10-Production-Node/Health Readiness and Liveness Hooks|Health Readiness and Liveness Hooks]].

**Acceptance criteria:**

- [ ] Probe table: path, success, failure effect
- [ ] Behavior during drain documented
- [ ] Kubernetes manifest snippet

### Problem 2 — `intermediate`

**Prompt:** Apply twelve-factor config to Node: env vars vs files, port binding, dev/prod parity pitfalls with `NODE_ENV`. When is dotenv acceptable?

**Hint:** [[06-NodeJS/10-Production-Node/Configuration Twelve-Factor on Node|Configuration Twelve-Factor on Node]].

**Acceptance criteria:**

- [ ] Config schema with validation at boot
- [ ] Forbidden pattern: silent defaults for secrets
- [ ] Link to [[16-DevOps/README|DevOps]] for platform wiring

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[06-NodeJS/code/README|code labs]], implement `createServerWithShutdown(httpServer)` handling SIGTERM: stop accept, `server.close()`, timeout, force destroy sockets.

**Acceptance criteria:**

- [ ] In-flight request completes in happy path test
- [ ] Force exit after configurable deadline
- [ ] Exit codes documented

### Problem 2 — `intermediate`

**Prompt:** Add structured JSON logger with level, timestamp, `requestId` from ALS, and child logger for module prefix. Ensure stdout only in prod (no pretty print).

**Hint:** [[06-NodeJS/10-Production-Node/Structured Logging and Correlation IDs|Structured Logging and Correlation IDs]].

**Acceptance criteria:**

- [ ] JSON schema stable for log aggregator
- [ ] Correlation id in access and error logs
- [ ] Test asserts log fields on sample request

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Integration tests spin real server on port 0 but flake under parallel CI. Design dynamic port allocation, `node:test` lifecycle, and hermetic env isolation.

**Hint:** [[06-NodeJS/10-Production-Node/Testing Node Servers Integration and Contract Tests|Integration and Contract Tests]].

**Acceptance criteria:**

- [ ] Parallel-safe test harness
- [ ] Contract tests for OpenAPI or snapshot responses
- [ ] CI timing budget stated

### Problem 2 — `advanced`

**Prompt:** Reduce deploy-induced 503s: coordinate readiness flip, preStop hook sleep, connection draining, and ALB deregistration delay. Quantify safe timings.

**Acceptance criteria:**

- [ ] Timeline Mermaid from SIGTERM to zero connections
- [ ] Inequality: grace ≥ drain + probe intervals
- [ ] Load test proves zero failed requests during roll

## Debug

### Problem 1 — `intermediate`

**Prompt:** Pods killed mid-request during rollout despite "graceful shutdown." Debug missing `readiness` fail, premature process exit, or keep-alive clients. Fix checklist.

**Acceptance criteria:**

- [ ] Three hypotheses ranked
- [ ] Fix validated with kubectl/event timeline
- [ ] Documented probe and hook values

### Problem 2 — `advanced`

**Prompt:** Production logs missing correlation ids on async error paths. Trace ALS loss and patch logging wrapper; add test that throws after two awaits still logs `requestId`.

**Acceptance criteria:**

- [ ] Root cause tied to context loss
- [ ] Patch verified in test
- [ ] Alert on logs missing required fields

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Complete operational readiness checklist for a new Node microservice: metrics, alerts, runbooks, SLOs, load test, security review, and rollback — tailored from the track checklist.

**Hint:** [[06-NodeJS/10-Production-Node/Operational Readiness Checklist for Node Processes|Operational Readiness Checklist]].

**Acceptance criteria:**

- [ ] Checklist ≥20 items with owners
- [ ] SLO/SLI defined
- [ ] Rollback tested in staging

### Problem 2 — `advanced`

**Prompt:** Design "Node Runtime Toolkit" portfolio synthesis: loop tracer, stream pipeline, worker pool, shutdown harness, path-safe fs — unified CLI with subcommands and production docs.

**Acceptance criteria:**

- [ ] Architecture diagram linking mini projects
- [ ] Single install/run story
- [ ] README maps features to track modules

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Operability | Health returns 200 always | Readiness/liveness/shutdown coordinated with probes |
| Implementation | console.log | JSON logs, shutdown coordinator, parallel-safe integration tests |
| Production | Checklist copied | Timed drain math, rollback proof, portfolio synthesis |

## Related Notes

- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/_interview/Production Node Interview.md|Production Node Interview]]
- [[06-NodeJS/README|Node.js]]
- [[Career/README|Career]]
