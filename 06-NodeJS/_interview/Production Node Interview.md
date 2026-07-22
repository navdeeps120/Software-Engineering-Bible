---
title: Production Node Interview
aliases: [Production Node Interview Questions]
track: 06-NodeJS
topic: production-node-interview
difficulty: advanced
status: active
prerequisites: ["[[06-NodeJS/10-Production-Node/Operational Readiness Checklist for Node Processes|Operational Readiness Checklist for Node Processes]]"]
tags: [interviews, nodejs, production, operations, twelve-factor]
created: 2026-07-22
updated: 2026-07-22
---

# Production Node Interview

## Linked Topic

- [[06-NodeJS/10-Production-Node/Graceful Shutdown and Drain|Graceful Shutdown and Drain]]
- [[06-NodeJS/10-Production-Node/Configuration Twelve-Factor on Node|Configuration Twelve-Factor on Node]]
- [[06-NodeJS/10-Production-Node/Structured Logging and Correlation IDs|Structured Logging and Correlation IDs]]
- [[06-NodeJS/10-Production-Node/Health Readiness and Liveness Hooks|Health Readiness and Liveness Hooks]]
- [[06-NodeJS/10-Production-Node/Testing Node Servers Integration and Contract Tests|Testing Node Servers Integration and Contract Tests]]
- [[06-NodeJS/10-Production-Node/Operational Readiness Checklist for Node Processes|Operational Readiness Checklist for Node Processes]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Sketch probe timeline + SIGTERM + drain before "graceful" claims.
3. Tie config, logs, and tests to twelve-factor and SLO evidence.
4. Close with rollback and on-call runbook specifics.

## Contracts

1. Liveness vs readiness vs startup probes — responses during graceful shutdown.

   - Kubernetes effects of each failure
   - Dependency checks (DB) placement
   - Avoiding traffic to draining pods

2. Twelve-factor config contract for Node services.

   - Env validation at boot
   - Port binding (`process.env.PORT`)
   - Forbidden secret defaults

## Internal Implementation

3. Walk SIGTERM → readiness fail → `server.close` → active connections timeline.

   - preStop hook sleep rationale
   - keep-alive clients prolonging drain
   - Force destroy after deadline

4. Structured logging pipeline: stdout JSON → collector → query fields.

   - Correlation id via AsyncLocalStorage
   - Log levels and sampling
   - PII redaction hooks

## Coding

5. Implement shutdown coordinator with deadline and in-flight request counter.

   - SIGTERM/SIGINT handling
   - Test completing vs forced paths
   - Exit codes documented

6. Integration test harness: ephemeral port, parallel-safe, contract assertions.

   - `node:test` lifecycle
   - OpenAPI or snapshot contracts
   - CI flake prevention

## Runtime Assumptions

7. Deploy causes 503s despite graceful shutdown — timing inequality proof.

   - terminationGracePeriodSeconds vs drain
   - ALB deregistration delay
   - Load test acceptance criteria

8. When is dotenv acceptable vs strict env-from-platform only?

   - Dev/prod parity risks
   - Test environment isolation
   - Secret leakage in repo

## Production Judgment

9. Operational readiness checklist for new Node microservice — top priorities.

   - SLO/SLI, alerts, runbooks, load test, security
   - Rollback verified in staging
   - On-call ownership

10. Missing correlation ids in prod logs during incident — fix and prevent.

    - ALS gap root cause
    - Alert on schema violations
    - Post-incident lint/review rule

## Staff-Level Selection

11. Platform golden path for Node on Kubernetes — chart, probes, shutdown, metrics.

    - Versioned base chart
    - Override policy for long-poll services
    - Adoption metrics across teams

12. Synthesize track into Node Runtime Toolkit portfolio — staffing and curriculum.

    - Maps modules to CLI subcommands
    - Hiring loop integration
    - Stage gate checklist enforcement

13. Org rollback policy when Node upgrade correlates with error budget burn.

    - Automated canary analysis
    - Communication template
    - Forward-fix vs revert criteria

14. Staff interview: "We're production-ready because tests pass" — required evidence.

    - Drain math, probes, observability, supply chain
    - Game day participation
    - [[Career/README|Career]] ladder alignment for staff bar

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Operability | Single /health | Probe roles, drain timeline, structured logs |
| Coding | Unit tests only | Shutdown coordinator, parallel integration harness |
| Production | Checklist lip service | SLO evidence, rollback policy, platform golden path |

## Related Notes

- [[Career/README|Career]]
- [[06-NodeJS/_exercises/Production Node Exercises.md|Production Node Exercises]]
- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/README|Node.js]]
