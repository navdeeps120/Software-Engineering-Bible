---
title: Observability and Control Planes Interview
aliases: [10 Observability Interview]
track: 09-System-Design
topic: observability-and-control-planes-interview
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/10-Observability-and-Control-Planes/SLIs SLOs Error Budgets for Multi-Service Systems|SLIs SLOs Error Budgets for Multi-Service Systems]]"]
tags: [interviews, system-design, observability, slo, progressive-delivery]
created: 2026-07-23
updated: 2026-07-23
---

# Observability and Control Planes Interview

## Linked Topic

- [[09-System-Design/10-Observability-and-Control-Planes/SLIs SLOs Error Budgets for Multi-Service Systems|SLIs SLOs Error Budgets for Multi-Service Systems]]
- [[09-System-Design/10-Observability-and-Control-Planes/Distributed Tracing Correlation Across Regions|Distributed Tracing Correlation Across Regions]]
- [[09-System-Design/10-Observability-and-Control-Planes/Cardinality and Metric Topology Risks|Cardinality and Metric Topology Risks]]
- [[09-System-Design/10-Observability-and-Control-Planes/Capacity Signals and Autoscaling Intents|Capacity Signals and Autoscaling Intents]]
- [[09-System-Design/10-Observability-and-Control-Planes/Progressive Delivery of Distributed Systems|Progressive Delivery of Distributed Systems]]

## How to Practice

1. Prefer user-journey SLIs over infra gauges as SLOs.
2. Trace across regions and async boundaries.
3. Treat cardinality as a production risk.
4. Tie progressive delivery to error budgets.

## Junior

1. SLI vs SLO vs error budget?

   - **Strong:** Measure, target, remaining failure allowance
   - **Weak:** Synonyms

2. Why is CPU utilization a poor product SLO?

   - **Strong:** Not user-visible; can be healthy while broken
   - **Weak:** CPU is the SLO

3. What is distributed tracing for?

   - **Strong:** Cross-service latency attribution
   - **Weak:** Replace logs

## Mid

4. Define SLIs for multi-service checkout.

   - **Strong:** Success rate, p99 latency, payment auth success—journey level
   - **Weak:** Per-pod restarts

5. Where do traces break across messaging?

   - **Strong:** Context propagation into producers/consumers; sampling
   - **Weak:** "Traces always work"

6. Dangerous metric labels?

   - **Strong:** user_id, URL path unbounded, request_id
   - **Weak:** More labels always better

7. Autoscale consumers on CPU vs lag—which?

   - **Strong:** Lag matches intent; CPU can lie
   - **Weak:** CPU default

## Senior

8. Progressive delivery gates for a risky config change.

   - **Strong:** 1→10→50→100, burn-rate abort, dependency caution
   - **Weak:** Feature flag without metrics

9. Metrics pipeline down—how do you operate?

   - **Strong:** Halt deploys, fallback signals, degraded mode
   - **Weak:** Fly blind shipping

## Staff

10. Error-budget policy with product: who freezes features?

    - **Strong:** Decision rights, exceptions, templates
    - **Weak:** Eng-only silent freezes

11. Cardinality budget as platform standard?

    - **Strong:** CI/design gates, allowlists, examples
    - **Weak:** After outages only

12. Control plane for progressive delivery across 30 teams?

    - **Strong:** Shared gates, overrides audited, link to DevOps
    - **Weak:** Each team invents canaries

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| SLOs | Infra as SLO | User journeys + budgets |
| Traces | Tool name | Cross-region/async correlation |
| Rollout | Big-bang | Progressive + abort |

## Related Notes

- [[09-System-Design/_exercises/10-Observability-and-Control-Planes|Observability Exercises]]
- [[16-DevOps/README|DevOps]]
- [[Career/README|Career]]
