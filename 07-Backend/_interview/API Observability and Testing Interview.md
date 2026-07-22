---
title: API Observability and Testing Interview
aliases: [API Observability and Testing Interview Questions]
track: 07-Backend
topic: api-observability-and-testing-interview
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/09-API-Observability-and-Testing/RED Metrics and SLIs for APIs|RED Metrics and SLIs for APIs]]"]
tags: [interviews, backend, observability, testing, tracing]
created: 2026-07-22
updated: 2026-07-22
---

# API Observability and Testing Interview

## Linked Topic

- [[07-Backend/09-API-Observability-and-Testing/RED Metrics and SLIs for APIs|RED Metrics and SLIs for APIs]]
- [[07-Backend/09-API-Observability-and-Testing/Distributed Tracing Across Handlers|Distributed Tracing Across Handlers]]
- [[07-Backend/09-API-Observability-and-Testing/Structured Logs with Request Correlation|Structured Logs with Request Correlation]]
- [[07-Backend/09-API-Observability-and-Testing/Contract Integration and Load Testing|Contract Integration and Load Testing]]
- [[07-Backend/09-API-Observability-and-Testing/Chaos and Failure Injection at the Service Edge|Chaos and Failure Injection at the Service Edge]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Define SLI and RED metrics before tool names.
3. Separate unit, contract, integration, and load test roles.
4. Close with incident response using traces and SLO burn rates.

## Contracts

1. Define RED metrics for an Express API — safe label cardinality.

   - Rate, errors, duration
   - Route templates vs raw paths
   - SLI example with target

2. Structured logging contract per request.

   - JSON fields required
   - Correlation ID propagation
   - PII redaction rules

## Tracing and Metrics

3. Wire traces across HTTP handler, DB, and outbound fetch.

   - Parent/child spans
   - Context propagation headers
   - Error span attributes

4. p99 latency up, CPU flat — trace interpretation.

   - Pool wait vs external dependency
   - Connection pool metrics
   - Fix hypothesis order

## Testing

5. Place unit, integration, contract, and load tests in CI pyramid.

   - OpenAPI-driven contract tests
   - Nightly load thresholds
   - Flake control for timestamps

6. Contract tests fail on dynamic fields — deterministic fixture strategy.

   - Clock injection
   - Schema subsets
   - Golden file maintenance

## Production Judgment

7. Logs cost spike after debug deploy — sampling and level policy.

   - Health check sampling
   - Dynamic debug per tenant
   - Cost vs debuggability

8. Game day: inject 5% errors on readiness — alert validation.

   - SLI vs liveness probe
   - Runbook execution
   - Post-game action items

9. Multi-service checkout failure — trace-first incident response.

   - Required span names
   - TraceQL/query examples
   - Instrumentation gap analysis

## Staff-Level Selection

10. Define SLO dashboard and multi-window burn alerts for public API.

    - Error budget policy
    - Deploy freeze triggers
    - Handoff to [[16-DevOps/README|DevOps]]

11. Standardize observability middleware org-wide.

    - Required fields and metric names
    - Versioned telemetry package
    - Opt-out process

12. Chaos testing scope for backend vs platform team.

    - Service-edge faults owned by backend
    - AZ failures owned by platform
    - Safety guardrails

13. Load test showed pass but prod failed Black Friday — gap analysis.

    - Traffic shape realism
    - Cache cold start
    - Dependency mock fidelity

14. Missing traces in serverless/edge adapter — propagation fix.

    - W3C tracecontext
    - Broken middleware order
    - Vendor-specific limits

15. Hire bar: what observability story must senior backend candidates tell?

    - RED + traces + SLO incident
    - Link to exercises and labs
    - False positive alert tuning example

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Metrics | grep logs | RED, safe labels, SLOs and burn rates |
| Testing | Unit only | Contract + integration + realistic load |
| Incidents | Manual log dive | Trace-correlated runbooks, chaos validation |

## Related Notes

- [[Career/README|Career]]
- [[07-Backend/_exercises/API Observability and Testing Exercises.md|API Observability and Testing Exercises]]
- [[07-Backend/code/README|code labs]]
- [[07-Backend/README|Backend]]
