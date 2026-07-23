---
title: Observability and Control Planes Exercises
aliases: [10 Observability Exercises]
track: 09-System-Design
topic: observability-and-control-planes-exercises
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/_exercises/09-Failure-Modes-at-Product-Scale|Failure Modes at Product Scale Exercises]]"]
tags: [exercises, system-design, observability, slo, tracing, progressive-delivery]
created: 2026-07-23
updated: 2026-07-23
---

# Observability and Control Planes Exercises

Define multi-service SLIs/SLOs and error budgets, correlate traces across regions, control metric cardinality, design autoscaling intents from capacity signals, and roll out with progressive delivery.

## Linked Topic

- [[09-System-Design/10-Observability-and-Control-Planes/SLIs SLOs Error Budgets for Multi-Service Systems|SLIs SLOs Error Budgets for Multi-Service Systems]]
- [[09-System-Design/10-Observability-and-Control-Planes/Distributed Tracing Correlation Across Regions|Distributed Tracing Correlation Across Regions]]
- [[09-System-Design/10-Observability-and-Control-Planes/Cardinality and Metric Topology Risks|Cardinality and Metric Topology Risks]]
- [[09-System-Design/10-Observability-and-Control-Planes/Capacity Signals and Autoscaling Intents|Capacity Signals and Autoscaling Intents]]
- [[09-System-Design/10-Observability-and-Control-Planes/Progressive Delivery of Distributed Systems|Progressive Delivery of Distributed Systems]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Define SLI vs SLO vs error budget for a multi-service checkout. Why is "CPU < 80%" a bad SLO?

**Hint:** [[09-System-Design/10-Observability-and-Control-Planes/SLIs SLOs Error Budgets for Multi-Service Systems|SLIs SLOs Error Budgets for Multi-Service Systems]].

**Acceptance criteria:**

- [ ] User-centric SLI examples
- [ ] Bad SLO critique
- [ ] Budget burn meaning

### Problem 2 — `intermediate`

**Prompt:** Explain trace context propagation across regions and async boundaries. Where do traces commonly break?

**Hint:** [[09-System-Design/10-Observability-and-Control-Planes/Distributed Tracing Correlation Across Regions|Distributed Tracing Correlation Across Regions]].

**Acceptance criteria:**

- [ ] Propagation points listed
- [ ] Messaging/async gap named
- [ ] Sampling trade-off

### Problem 3 — `intermediate`

**Prompt:** Why does unbounded label cardinality melt a metrics system? Give three dangerous label choices.

**Hint:** [[09-System-Design/10-Observability-and-Control-Planes/Cardinality and Metric Topology Risks|Cardinality and Metric Topology Risks]].

**Acceptance criteria:**

- [ ] Mechanism explained
- [ ] Three bad labels
- [ ] Safer alternatives

## Model

### Problem 1 — `beginner`

**Prompt:** Model error budget for 99.9% monthly availability. How many minutes of downtime? How does a canary burn budget?

**Acceptance criteria:**

- [ ] Minutes computed
- [ ] Burn-rate alert idea
- [ ] Freeze policy sketch

### Problem 2 — `intermediate`

**Prompt:** Model autoscaling on CPU vs on lag/queue depth for a consumer fleet. Which signal matches intent?

**Hint:** [[09-System-Design/10-Observability-and-Control-Planes/Capacity Signals and Autoscaling Intents|Capacity Signals and Autoscaling Intents]].

**Acceptance criteria:**

- [ ] Signal-to-intent mapping
- [ ] Failure of CPU-only scaling
- [ ] Cooldown / flapping controls

### Problem 3 — `advanced`

**Prompt:** Model progressive delivery: 1% → 10% → 50% → 100% with automatic rollback on SLO burn. Pick gates.

**Hint:** [[09-System-Design/10-Observability-and-Control-Planes/Progressive Delivery of Distributed Systems|Progressive Delivery of Distributed Systems]].

**Acceptance criteria:**

- [ ] Gate metrics
- [ ] Abort thresholds
- [ ] Multi-service dependency caution

## Design

### Problem 1 — `intermediate`

**Prompt:** Design a golden dashboard for a product: edge, service RED, dependency, and business SLIs—without 200 panels.

**Acceptance criteria:**

- [ ] ≤12 panels with purpose
- [ ] Drill-down path to traces/logs
- [ ] Ownership labeled

### Problem 2 — `intermediate`

**Prompt:** Design trace sampling: head-based vs tail-based for rare payment errors. Preserve debugability within cost.

**Acceptance criteria:**

- [ ] Sampling strategy
- [ ] Error-biased retention
- [ ] Cost envelope

### Problem 3 — `advanced`

**Prompt:** Design control-plane rollout for a schema/config change affecting 30 services: progressive delivery + freeze windows.

**Acceptance criteria:**

- [ ] Wave plan
- [ ] Compatibility windows
- [ ] Rollback of config vs binary

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Metrics pipeline is down. How do you operate? Design degraded observability mode.

**Acceptance criteria:**

- [ ] Critical signals fallback
- [ ] When to halt deploys
- [ ] Customer impact assessment without metrics

### Problem 2 — `advanced`

**Prompt:** A high-cardinality deploy blows Prometheus. Contain, recover, and prevent recurrence with standards.

**Acceptance criteria:**

- [ ] Immediate containment
- [ ] Cardinality budget policy
- [ ] Review gate in CI/design

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write an error-budget policy for eng+product: when budgets burn, who decides to freeze features?

**Acceptance criteria:**

- [ ] Decision rights
- [ ] Exception process
- [ ] Communication template

### Problem 2 — `advanced`

**Prompt:** Propose a platform control plane for progressive delivery across teams: shared gates, team overrides, audit.

**Acceptance criteria:**

- [ ] Architecture sketch
- [ ] Override governance
- [ ] Link to DevOps handoff where appropriate

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| SLOs | Infra metrics as SLOs | User journeys and budgets |
| Traces | "We have Jaeger" | Cross-region/async correlation |
| Rollout | Big-bang | Progressive gates and abort |

## Related Notes

- [[09-System-Design/_interview/10-Observability-and-Control-Planes|Observability Interview]]
- [[09-System-Design/README|System Design]]
- [[16-DevOps/README|DevOps]]
- [[Career/README|Career]]
