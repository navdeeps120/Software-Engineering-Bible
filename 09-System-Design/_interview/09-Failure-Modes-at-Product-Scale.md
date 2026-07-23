---
title: Failure Modes at Product Scale Interview
aliases: [09 Failure Modes Interview]
track: 09-System-Design
topic: failure-modes-at-product-scale-interview
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/09-Failure-Modes-at-Product-Scale/Cascading Multi-Service Failure|Cascading Multi-Service Failure]]"]
tags: [interviews, system-design, failure, cascade, bulkheads]
created: 2026-07-23
updated: 2026-07-23
---

# Failure Modes at Product Scale Interview

## Linked Topic

- [[09-System-Design/09-Failure-Modes-at-Product-Scale/Cascading Multi-Service Failure|Cascading Multi-Service Failure]]
- [[09-System-Design/09-Failure-Modes-at-Product-Scale/Zone and Fleet Bulkheads|Zone and Fleet Bulkheads]]
- [[09-System-Design/09-Failure-Modes-at-Product-Scale/Graceful Degradation and Feature Shedding|Graceful Degradation and Feature Shedding]]
- [[09-System-Design/09-Failure-Modes-at-Product-Scale/Chaos Blast Radius and Dependency Failure|Chaos Blast Radius and Dependency Failure]]
- [[09-System-Design/09-Failure-Modes-at-Product-Scale/Multi-Service Incident Playbooks|Multi-Service Incident Playbooks]]

## How to Practice

1. Draw amplification paths, not single root causes.
2. Propose bulkheads and shed ladders.
3. Distinguish fail-open vs fail-closed by feature.
4. Include multi-service roles and comms.

## Junior

1. What is a cascading failure?

   - **Strong:** Dependency issue amplifies upstream via pools/retries
   - **Weak:** "Many things fail"

2. Why can retries make outages worse?

   - **Strong:** Amplification; need budgets/jitter/idempotency
   - **Weak:** Retries always good

3. Give an example of graceful degradation.

   - **Strong:** Serve stale recommendations; keep checkout
   - **Weak:** Show 500 with apology

## Mid

4. Design bulkheads for a homepage with 8 dependencies.

   - **Strong:** Timeouts, pools, optional vs critical, partial render
   - **Weak:** One shared thread pool

5. Zone outage: how do bulkheads change survival?

   - **Strong:** Capacity math, zone-aware routing, headroom
   - **Weak:** Multi-AZ checkbox

6. Feature shedding ladder under CPU pressure?

   - **Strong:** Ordered non-critical features; protect auth/checkout
   - **Weak:** Random kills

7. Auth is slow (not down)—correct response?

   - **Strong:** Edge shed, fail-closed login, don't retry storm
   - **Weak:** Triple retries

## Senior

8. Write a multi-service incident playbook outline.

   - **Strong:** Roles, severity, comms, rollback ownership
   - **Weak:** "Page everyone"

9. Chaos experiment design with abort criteria.

   - **Strong:** Blast-radius cap, revenue windows, abort metrics
   - **Weak:** Break prod randomly

## Staff

10. Shared library deadlock in 40 services—containment?

    - **Strong:** Kill switches, staged rollback, blast radius
    - **Weak:** Wait for full redeploy only

11. Org error-budget policy across services?

    - **Strong:** Ownership, freeze rules, product partnership
    - **Weak:** Each team isolated forever

12. How do you measure bulkhead effectiveness?

    - **Strong:** Fault injection, dependency failure drills, blast-radius metrics
    - **Weak:** Hope from design docs

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Cascades | Single blame | Amplification modeled |
| Isolation | HA only | Zone/fleet bulkheads |
| Response | Heroics | Shed + playbooks |

## Related Notes

- [[09-System-Design/_exercises/09-Failure-Modes-at-Product-Scale|Failure Modes Exercises]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Circuit Breakers and Bulkheads|Circuit Breakers and Bulkheads]]
- [[Career/README|Career]]
