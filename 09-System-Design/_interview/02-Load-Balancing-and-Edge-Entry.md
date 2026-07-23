---
title: Load Balancing and Edge Entry Interview
aliases: [02 Edge LB Interview]
track: 09-System-Design
topic: load-balancing-and-edge-entry-interview
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/02-Load-Balancing-and-Edge-Entry/Load Balancer Roles L4 vs L7|Load Balancer Roles L4 vs L7]]"]
tags: [interviews, system-design, load-balancing, edge]
created: 2026-07-23
updated: 2026-07-23
---

# Load Balancing and Edge Entry Interview

## Linked Topic

- [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Load Balancer Roles L4 vs L7|Load Balancer Roles L4 vs L7]]
- [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Algorithms Round Robin Least Conn Consistent Hash|Algorithms Round Robin Least Conn Consistent Hash]]
- [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Health Checks Drain and Connection Management|Health Checks Drain and Connection Management]]
- [[09-System-Design/02-Load-Balancing-and-Edge-Entry/API Gateway vs Reverse Proxy vs Service Mesh Concepts|API Gateway vs Reverse Proxy vs Service Mesh Concepts]]
- [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Edge Admission Control and Global Traffic Steering|Edge Admission Control and Global Traffic Steering]]

## How to Practice

1. Choose L4 vs L7 before algorithms.
2. Always discuss health, drain, and connection lifecycle.
3. Place gateway vs mesh concerns intentionally.
4. Include global steering and admission under overload.

## Junior

1. When do you choose L4 vs L7 load balancing?

   - **Strong:** Headers/path/auth needs vs raw TCP/UDP performance
   - **Weak:** "L7 is always better"

2. Explain round robin vs least connections.

   - **Strong:** Equal vs long-request imbalance; WebSocket caveat
   - **Weak:** Name only

3. What is the difference between liveness and readiness?

   - **Strong:** Kill vs remove from LB; drain implications
   - **Weak:** Same probe

## Mid

4. How does consistent hashing help sticky workloads? What happens on node loss?

   - **Strong:** Remap fraction / virtual nodes; session impact
   - **Weak:** "Users stay forever"

5. Design drain for rolling deploy of HTTP services.

   - **Strong:** Stop new → finish in-flight → terminate; timeouts
   - **Weak:** SIGKILL pods

6. Where should rate limiting live: CDN, gateway, or service?

   - **Strong:** Blast radius + abuse stage; defense in depth
   - **Weak:** Only one place always

7. Gateway vs reverse proxy vs mesh—what does each own?

   - **Strong:** Edge product policy vs local reverse vs east-west
   - **Weak:** Vendor comparison only

## Senior

8. Half the backends fail health checks. How do you prevent overload on survivors?

   - **Strong:** Max removable %, circuit, admission; rollback
   - **Weak:** Keep sending 100% traffic

9. Design edge admission for flash sales.

   - **Strong:** Queue/reject/shed; Retry-After; fairness/VIP; metrics
   - **Weak:** "Auto-scale infinitely"

## Staff

10. Global Anycast failover moves EU→US. What product risks?

    - **Strong:** Latency, data locality, consistency; staged steering
    - **Weak:** DNS flip only

11. Should every service get a mesh?

    - **Strong:** mTLS/retries/obs needs vs complexity; phased criteria
    - **Weak:** Yes/no absolute

12. Define LB SLO and dashboards for on-call.

    - **Strong:** 5xx, p99, unhealthy hosts, connection errors, deploy correlation
    - **Weak:** CPU of LB VM only

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Layering | Buzzwords | L4/L7 matched to need |
| Ops | Ignore drain | Health/drain/lifecycle |
| Edge | Single choke | Admission + steering |

## Related Notes

- [[09-System-Design/_exercises/02-Load-Balancing-and-Edge-Entry|Edge LB Exercises]]
- [[09-System-Design/projects/Load Balancer From Scratch/README|Load Balancer From Scratch]]
- [[Career/README|Career]]
