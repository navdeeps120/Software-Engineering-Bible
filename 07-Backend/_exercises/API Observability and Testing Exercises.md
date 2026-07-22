---
title: API Observability and Testing Exercises
aliases: [API Observability and Testing Drills]
track: 07-Backend
topic: api-observability-and-testing-exercises
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [exercises, backend, observability, testing, tracing]
created: 2026-07-22
updated: 2026-07-22
---

# API Observability and Testing Exercises

Instrument RED metrics, distributed tracing, structured logs with correlation IDs, contract and load testing, and controlled failure injection at the service edge.

## Linked Topic

- [[07-Backend/09-API-Observability-and-Testing/RED Metrics and SLIs for APIs|RED Metrics and SLIs for APIs]]
- [[07-Backend/09-API-Observability-and-Testing/Distributed Tracing Across Handlers|Distributed Tracing Across Handlers]]
- [[07-Backend/09-API-Observability-and-Testing/Structured Logs with Request Correlation|Structured Logs with Request Correlation]]
- [[07-Backend/09-API-Observability-and-Testing/Contract Integration and Load Testing|Contract Integration and Load Testing]]
- [[07-Backend/09-API-Observability-and-Testing/Chaos and Failure Injection at the Service Edge|Chaos and Failure Injection at the Service Edge]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Define RED metrics for `POST /orders`. Which labels are high-cardinality traps to avoid?

**Hint:** [[07-Backend/09-API-Observability-and-Testing/RED Metrics and SLIs for APIs|RED Metrics and SLIs for APIs]].

**Acceptance criteria:**

- [ ] Rate, Errors, Duration defined with formulas
- [ ] Safe labels: method, route template, status class
- [ ] SLI example with target (e.g. 99.9% success)

### Problem 2 — `intermediate`

**Prompt:** Contrast unit, integration, contract, and load tests for an Express API. What belongs in CI vs nightly?

**Hint:** [[07-Backend/09-API-Observability-and-Testing/Contract Integration and Load Testing|Contract Integration and Load Testing]].

**Acceptance criteria:**

- [ ] Test pyramid for backend services
- [ ] Contract tests tied to OpenAPI
- [ ] Load test success criteria (p95 latency, error rate)

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[07-Backend/code/README|code labs]], add structured JSON logging middleware: `requestId`, `method`, `path`, `status`, `durationMs`.

**Acceptance criteria:**

- [ ] One JSON object per request line
- [ ] Errors log stack in dev only
- [ ] Correlation ID matches response header

### Problem 2 — `intermediate`

**Prompt:** Wire OpenTelemetry spans around HTTP handler, DB call, and outbound fetch. Propagate trace context on outbound headers.

**Hint:** [[07-Backend/09-API-Observability-and-Testing/Distributed Tracing Across Handlers|Distributed Tracing Across Handlers]].

**Acceptance criteria:**

- [ ] Parent/child span relationships correct
- [ ] Span attributes include `http.route`, `db.statement` (sanitized)
- [ ] Test exports spans to in-memory exporter

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Logs cost $8k/month after adding debug fields. Define log levels, sampling for health checks, and dynamic debug toggle per tenant.

**Hint:** [[07-Backend/09-API-Observability-and-Testing/Structured Logs with Request Correlation|Structured Logs with Request Correlation]].

**Acceptance criteria:**

- [ ] Health check logs sampled to 1%
- [ ] Feature flag enables trace/log verbosity
- [ ] PII redaction rules listed

### Problem 2 — `advanced`

**Prompt:** Contract tests flake on timestamp fields. Design deterministic fixtures, clock injection, and schema subsets for CI.

**Acceptance criteria:**

- [ ] Golden files with frozen timestamps
- [ ] OpenAPI `format: date-time` validated loosely where needed
- [ ] Separate strict vs snapshot contract suites

## Debug

### Problem 1 — `intermediate`

**Prompt:** p99 latency spike but CPU flat—trace shows queue wait in connection pool. Diagnose pool size vs handler concurrency.

**Acceptance criteria:**

- [ ] Trace waterfall screenshot or ASCII
- [ ] Pool metrics added (waiting, active)
- [ ] Fix: pool sizing formula documented

### Problem 2 — `advanced`

**Prompt:** Inject 500 errors on 5% of `/health` during game day. Verify alerts fire on SLI not liveness, and runbook executes.

**Hint:** [[07-Backend/09-API-Observability-and-Testing/Chaos and Failure Injection at the Service Edge|Chaos and Failure Injection at the Service Edge]].

**Acceptance criteria:**

- [ ] Fault injection behind feature flag
- [ ] Readiness vs liveness probe behavior verified
- [ ] Post-game report with action items

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Define SLO dashboard for public API: availability, latency, saturation. Wire alerts with multi-window burn rates.

**Acceptance criteria:**

- [ ] SLI definitions match user journeys
- [ ] Error budget policy linked to deploy freeze
- [ ] Handoff to [[16-DevOps/README|DevOps]] for platform tooling

### Problem 2 — `advanced`

**Prompt:** Multi-service checkout fails intermittently—logs scattered. Design trace-first incident response: required instrumentation, traceQL queries, and ownership.

**Acceptance criteria:**

- [ ] Mandatory span names across services
- [ ] Runbook queries for checkout trace ID
- [ ] Gap analysis for missing instrumentation

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Metrics | Logs only | RED with safe labels and SLO targets |
| Testing | Handler unit tests only | Contract + integration + targeted load |
| Incidents | grep logs manually | Trace-correlated, chaos-validated runbooks |

## Related Notes

- [[07-Backend/code/README|code labs]]
- [[07-Backend/_interview/API Observability and Testing Interview.md|API Observability and Testing Interview]]
- [[07-Backend/README|Backend]]
- [[Career/README|Career]]
