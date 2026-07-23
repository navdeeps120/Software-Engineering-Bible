---
title: Messaging Streams and Async Topologies Exercises
aliases: [06 Messaging Exercises]
track: 09-System-Design
topic: messaging-streams-and-async-topologies-exercises
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/_exercises/05-Caching-at-Product-Scale|Caching at Product Scale Exercises]]"]
tags: [exercises, system-design, messaging, queues, streams, outbox]
created: 2026-07-23
updated: 2026-07-23
---

# Messaging Streams and Async Topologies Exercises

Choose queue vs log vs pub-sub topologies, design ordering and idempotency contracts, manage lag and backpressure, architect fan-out, and apply outbox patterns at system scale.

## Linked Topic

- [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Queue vs Log vs Pub-Sub Topology Choice|Queue vs Log vs Pub-Sub Topology Choice]]
- [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Ordering Partitions Idempotency and Exactly-Once Claims|Ordering Partitions Idempotency and Exactly-Once Claims]]
- [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Backpressure Consumer Lag and Load Shedding|Backpressure Consumer Lag and Load Shedding]]
- [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Fan-out Broadcast and Notification Architectures|Fan-out Broadcast and Notification Architectures]]
- [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Outbox at System Scale Cross-Service Contracts|Outbox at System Scale Cross-Service Contracts]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Contrast competing consumers (queue), partitioned log, and pub-sub fan-out. Give one product fit each.

**Hint:** [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Queue vs Log vs Pub-Sub Topology Choice|Queue vs Log vs Pub-Sub Topology Choice]].

**Acceptance criteria:**

- [ ] Topology mechanics clear
- [ ] Fit/misfit examples
- [ ] Not vendor-specific

### Problem 2 — `intermediate`

**Prompt:** Debunk "exactly-once" as commonly claimed. What can you actually guarantee end-to-end?

**Hint:** [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Ordering Partitions Idempotency and Exactly-Once Claims|Ordering Partitions Idempotency and Exactly-Once Claims]].

**Acceptance criteria:**

- [ ] At-least-once + idempotent consumer framing
- [ ] Broker vs end-to-end distinction
- [ ] Ordering scope (partition) stated

### Problem 3 — `intermediate`

**Prompt:** Define consumer lag and backpressure. When is lag a feature vs an incident?

**Acceptance criteria:**

- [ ] Lag SLO concept
- [ ] Backpressure mechanisms
- [ ] Link to [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Backpressure Consumer Lag and Load Shedding|Backpressure Consumer Lag and Load Shedding]]

## Model

### Problem 1 — `beginner`

**Prompt:** Model a notification pipeline: 5M users, 1 broadcast event, per-user delivery. Estimate fan-out messages and partition count needs.

**Hint:** [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Fan-out Broadcast and Notification Architectures|Fan-out Broadcast and Notification Architectures]].

**Acceptance criteria:**

- [ ] Message volume estimate
- [ ] Time-to-deliver budget
- [ ] Partition/consumer parallelism sketch

### Problem 2 — `intermediate`

**Prompt:** Model poison messages: 0.01% fail permanently. Show how retries without DLQ amplify load.

**Acceptance criteria:**

- [ ] Amplification math
- [ ] DLQ/quarantine policy
- [ ] Alerting on DLQ growth

### Problem 3 — `advanced`

**Prompt:** Model outbox lag vs dual-write loss risk for "order created → charge payment." Quantify inconsistency windows.

**Hint:** [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Outbox at System Scale Cross-Service Contracts|Outbox at System Scale Cross-Service Contracts]].

**Acceptance criteria:**

- [ ] Dual-write failure mode
- [ ] Outbox consistency argument
- [ ] Cross-service contract fields (ids, versions)

## Design

### Problem 1 — `intermediate`

**Prompt:** Design topic/partition keys for chat messages requiring per-channel ordering but high throughput.

**Acceptance criteria:**

- [ ] Key = channel (or justify otherwise)
- [ ] Hot channel mitigation
- [ ] Consumer scaling plan

### Problem 2 — `intermediate`

**Prompt:** Design idempotent consumer for payment events with at-least-once delivery. Include dedupe store and fencing.

**Acceptance criteria:**

- [ ] Idempotency key scheme
- [ ] Retention of dedupe state
- [ ] Side-effect safety

### Problem 3 — `advanced`

**Prompt:** Design hybrid fan-out: push for online users, pull/catch-up for offline. Define lag budgets.

**Acceptance criteria:**

- [ ] Online/offline paths
- [ ] Catch-up API contract
- [ ] Cost vs freshness trade-off

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Consumers stop; lag grows for 45 minutes. Design shed/replay strategy that does not DDoS dependencies on catch-up.

**Acceptance criteria:**

- [ ] Replay rate limiting
- [ ] Dependency protection
- [ ] User-visible degradation during lag

### Problem 2 — `advanced`

**Prompt:** Broker loses a partition replica under-replicated. Walk availability and durability decisions for producers.

**Acceptance criteria:**

- [ ] Producer ack policy implications
- [ ] Product RPO impact
- [ ] Ops escalation path

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write SLOs for a messaging backbone: produce success, end-to-end latency, lag age, DLQ rate.

**Acceptance criteria:**

- [ ] SLI definitions
- [ ] Error budget policy
- [ ] Dashboard sketch

### Problem 2 — `advanced`

**Prompt:** Standardize outbox usage across 20 services: shared library vs patterns doc. Argue ownership of the relay.

**Acceptance criteria:**

- [ ] Contract fields standardized
- [ ] Relay ownership and HA
- [ ] Link to Backend outbox client patterns

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Topology | "Use Kafka" | Queue/log/pubsub matched to need |
| Delivery | Exactly-once claim | At-least-once + idempotency |
| Ops | Ignore lag | Lag SLOs, DLQ, replay controls |

## Related Notes

- [[09-System-Design/_interview/06-Messaging-Streams-and-Async-Topologies|Messaging Interview]]
- [[09-System-Design/README|System Design]]
- [[07-Backend/_exercises/Caching Jobs and Messaging Exercises|Backend Messaging Exercises]]
- [[Career/README|Career]]
