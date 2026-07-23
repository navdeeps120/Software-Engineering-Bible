---
title: Messaging Streams and Async Topologies Interview
aliases: [06 Messaging Interview]
track: 09-System-Design
topic: messaging-streams-and-async-topologies-interview
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Queue vs Log vs Pub-Sub Topology Choice|Queue vs Log vs Pub-Sub Topology Choice]]"]
tags: [interviews, system-design, messaging, queues, streams]
created: 2026-07-23
updated: 2026-07-23
---

# Messaging Streams and Async Topologies Interview

## Linked Topic

- [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Queue vs Log vs Pub-Sub Topology Choice|Queue vs Log vs Pub-Sub Topology Choice]]
- [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Ordering Partitions Idempotency and Exactly-Once Claims|Ordering Partitions Idempotency and Exactly-Once Claims]]
- [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Backpressure Consumer Lag and Load Shedding|Backpressure Consumer Lag and Load Shedding]]
- [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Fan-out Broadcast and Notification Architectures|Fan-out Broadcast and Notification Architectures]]
- [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Outbox at System Scale Cross-Service Contracts|Outbox at System Scale Cross-Service Contracts]]

## How to Practice

1. Choose topology before broker brand.
2. Treat exactly-once claims skeptically; design idempotency.
3. Define lag SLOs and DLQ policy.
4. Use outbox for cross-service facts.

## Junior

1. Queue vs pub-sub—when each?

   - **Strong:** Competing work vs many independent consumers
   - **Weak:** Same thing

2. What does partition ordering guarantee?

   - **Strong:** Order within key/partition only
   - **Weak:** Global order free

3. Why at-least-once + idempotent consumer?

   - **Strong:** End-to-end reality; dedupe keys
   - **Weak:** Broker exactly-once enough

## Mid

4. Design partition key for per-channel chat ordering.

   - **Strong:** Channel id; hot channel plan
   - **Weak:** Random key

5. Consumer lag grows—when incident vs expected buffer?

   - **Strong:** Lag age SLO; business deadline
   - **Weak:** Any lag is outage

6. Poison message handling?

   - **Strong:** Retry budget, DLQ, alert, replay tooling
   - **Weak:** Infinite retry

7. Why outbox over dual-write DB + queue?

   - **Strong:** Atomic local intent; relay; loss/dupe modes
   - **Weak:** Two writes fine

## Senior

8. Design notification fan-out for 5M users.

   - **Strong:** Fan-out topology, chunking, lag budget, push/pull hybrid
   - **Weak:** One giant topic blast

9. Replay 45 minutes of lag without DDoS dependencies.

   - **Strong:** Rate-limited replay, backpressure, shed
   - **Weak:** Max parallelism catch-up

## Staff

10. Standardize messaging SLOs across teams.

    - **Strong:** Produce success, E2E latency, lag, DLQ rate; budgets
    - **Weak:** Per-team ad-hoc

11. When is a log (Kafka-style) wrong?

    - **Strong:** Simple work queue, low volume, no replay need—ops cost
    - **Weak:** Always Kafka

12. Cross-service event contract governance?

    - **Strong:** Schema evolution, idempotency keys, ownership, compatibility
    - **Weak:** JSON anything

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Topology | Brand-first | Queue/log/pubsub fit |
| Delivery | Exactly-once myth | Idempotent consumers |
| Ops | Ignore lag | SLOs, DLQ, replay |

## Related Notes

- [[09-System-Design/_exercises/06-Messaging-Streams-and-Async-Topologies|Messaging Exercises]]
- [[Career/README|Career]]
- [[09-System-Design/README|System Design]]
